'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function createGRN(formData: FormData) {
  const productId = parseInt(formData.get('productId') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const freeQuantity = formData.get('freeQuantity') ? parseInt(formData.get('freeQuantity') as string) : 0
  const uom = formData.get('uom') as string || 'Kg'
  const unitCost = parseFloat(formData.get('unitCost') as string)
  const discount = formData.get('discount') ? parseFloat(formData.get('discount') as string) : 0
  const discountType = formData.get('discountType') as string || 'percentage'
  const landedCost = formData.get('landedCost') ? parseFloat(formData.get('landedCost') as string) : 0
  const freightCost = formData.get('freightCost') ? parseFloat(formData.get('freightCost') as string) : 0
  const handlingCost = formData.get('handlingCost') ? parseFloat(formData.get('handlingCost') as string) : 0
  const taxCost = formData.get('taxCost') ? parseFloat(formData.get('taxCost') as string) : 0
  const supplierId = parseInt(formData.get('supplierId') as string)
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null
  const invoiceNumber = formData.get('invoiceNumber') as string || null
  const poNumber = formData.get('poNumber') as string || null
  const paymentType = formData.get('paymentType') as string || 'New Ref'
  const creditPeriod = formData.get('creditPeriod') ? parseInt(formData.get('creditPeriod') as string) : null
  const receivedDate = formData.get('receivedDate') ? new Date(formData.get('receivedDate') as string) : new Date()
  const expiryDate = formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null
  const batchNumber = formData.get('batchNumber') as string || null
  const qcStatus = formData.get('qcStatus') as string || 'Passed'
  const rejectedQty = formData.get('rejectedQty') ? parseInt(formData.get('rejectedQty') as string) : 0
  const rejectionReason = formData.get('rejectionReason') as string || null

  // Calculate total landed cost
  const totalLandedCost = landedCost + freightCost + handlingCost + taxCost
  
  // Calculate true unit cost: (purchase cost + landed cost portion per item)
  const totalQuantity = quantity + freeQuantity
  const trueUnitCost = totalQuantity > 0 ? unitCost + (totalLandedCost / totalQuantity) : unitCost

  // Calculate due date based on credit period
  let dueDate = null
  if (creditPeriod && receivedDate) {
    dueDate = new Date(receivedDate)
    dueDate.setDate(dueDate.getDate() + creditPeriod)
  }

  // Calculate total amount with discount
  let totalAmount = quantity * unitCost
  if (discountType === 'percentage') {
    totalAmount = totalAmount - (totalAmount * (discount / 100))
  } else {
    totalAmount = totalAmount - discount
  }
  totalAmount = totalAmount + totalLandedCost

  // Calculate sellable quantity (total - rejected)
  const sellableQuantity = totalQuantity - rejectedQty

  await prisma.$transaction(async (tx: any) => {
    // Get previous cost for variance calculation
    const previousCostHistory = await tx.productCostHistory.findFirst({
      where: { productId },
      orderBy: { receivedDate: 'desc' }
    })
    
    const previousUnitCost = previousCostHistory?.unitCost || unitCost
    const variancePercentage = previousUnitCost > 0 
      ? ((unitCost - previousUnitCost) / previousUnitCost) * 100 
      : 0

    // Create GRN entry
    const grn = await tx.gRN.create({
      data: {
        productId,
        quantity: sellableQuantity,
        freeQuantity,
        uom,
        unitCost,
        discount,
        discountType,
        landedCost: totalLandedCost,
        freightCost,
        handlingCost,
        taxCost,
        trueUnitCost,
        totalAmount,
        balanceAmount: totalAmount,
        supplierId,
        categoryId,
        subCategoryId,
        invoiceNumber,
        poNumber,
        paymentType,
        creditPeriod,
        dueDate,
        receivedDate,
        expiryDate,
        batchNumber,
        qcStatus,
        rejectedQty,
        rejectionReason,
        paymentStatus: 'PENDING'
      }
    })

    // Create ProductCostHistory entry for price variance tracking
    await tx.productCostHistory.create({
      data: {
        productId,
        unitCost,
        trueUnitCost,
        supplierId,
        grnId: grn.id,
        receivedDate,
        variancePercentage
      }
    })

    // Create StockBatch for FEFO/FIFO tracking
    if (batchNumber && expiryDate) {
      // Check if batch is expiring soon (within 30 days)
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      const isExpiringSoon = expiryDate <= thirtyDaysFromNow

      await tx.stockBatch.create({
        data: {
          productId,
          batchNumber,
          quantity: sellableQuantity,
          freeQuantity,
          uom,
          unitCost,
          trueUnitCost,
          expiryDate,
          receivedDate,
          grnId: grn.id,
          currentQuantity: sellableQuantity,
          isExpiringSoon
        }
      })
    }

    // Update product stock (only sellable quantity)
    await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: {
          increment: sellableQuantity
        },
        costPrice: trueUnitCost // Update product cost price to true cost
      }
    })

    // Create Supplier Ledger entry
    await tx.supplierLedger.create({
      data: {
        supplierId,
        grnId: grn.id,
        referenceType: paymentType,
        referenceNumber: invoiceNumber,
        debit: totalAmount,
        balance: totalAmount,
        dueDate,
        notes: `GRN #${grn.id} - ${invoiceNumber || 'No Invoice'}`
      }
    })

    // Update supplier current balance
    const supplier = await tx.supplier.findUnique({
      where: { id: supplierId }
    })
    if (supplier) {
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          currentBalance: (supplier.currentBalance || 0) + totalAmount
        }
      })
    }

    // Generate Credit Note if items were rejected
    if (rejectedQty > 0) {
      const creditNoteNumber = `CN-${Date.now()}`
      const creditNote = await tx.creditNote.create({
        data: {
          supplierId,
          grnId: grn.id,
          noteNumber: creditNoteNumber,
          totalAmount: rejectedQty * unitCost,
          reason: rejectionReason || 'Quality rejection',
          status: 'Draft'
        }
      })

      await tx.creditNoteItem.create({
        data: {
          creditNoteId: creditNote.id,
          productId,
          quantity: rejectedQty,
          unitCost,
          totalAmount: rejectedQty * unitCost,
          reason: rejectionReason || 'Quality rejection'
        }
      })
    }
  })
  revalidatePath('/grn')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function updateGRN(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const productId = parseInt(formData.get('productId') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const freeQuantity = formData.get('freeQuantity') ? parseInt(formData.get('freeQuantity') as string) : 0
  const uom = formData.get('uom') as string || 'Kg'
  const unitCost = parseFloat(formData.get('unitCost') as string)
  const discount = formData.get('discount') ? parseFloat(formData.get('discount') as string) : 0
  const discountType = formData.get('discountType') as string || 'percentage'
  const landedCost = formData.get('landedCost') ? parseFloat(formData.get('landedCost') as string) : 0
  const freightCost = formData.get('freightCost') ? parseFloat(formData.get('freightCost') as string) : 0
  const handlingCost = formData.get('handlingCost') ? parseFloat(formData.get('handlingCost') as string) : 0
  const taxCost = formData.get('taxCost') ? parseFloat(formData.get('taxCost') as string) : 0
  const supplierId = parseInt(formData.get('supplierId') as string)
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null
  const invoiceNumber = formData.get('invoiceNumber') as string || null
  const poNumber = formData.get('poNumber') as string || null
  const paymentType = formData.get('paymentType') as string || 'New Ref'
  const creditPeriod = formData.get('creditPeriod') ? parseInt(formData.get('creditPeriod') as string) : null
  const receivedDate = formData.get('receivedDate') ? new Date(formData.get('receivedDate') as string) : new Date()
  const expiryDate = formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null
  const batchNumber = formData.get('batchNumber') as string || null
  const qcStatus = formData.get('qcStatus') as string || 'Passed'
  const rejectedQty = formData.get('rejectedQty') ? parseInt(formData.get('rejectedQty') as string) : 0
  const rejectionReason = formData.get('rejectionReason') as string || null

  const existingGRN = await prisma.gRN.findUnique({
    where: { id }
  })

  // Calculate total landed cost
  const totalLandedCost = landedCost + freightCost + handlingCost + taxCost
  
  // Calculate true unit cost
  const totalQuantity = quantity + freeQuantity
  const trueUnitCost = totalQuantity > 0 ? unitCost + (totalLandedCost / totalQuantity) : unitCost

  // Calculate due date based on credit period
  let dueDate = null
  if (creditPeriod && receivedDate) {
    dueDate = new Date(receivedDate)
    dueDate.setDate(dueDate.getDate() + creditPeriod)
  }

  // Calculate total amount with discount
  let totalAmount = quantity * unitCost
  if (discountType === 'percentage') {
    totalAmount = totalAmount - (totalAmount * (discount / 100))
  } else {
    totalAmount = totalAmount - discount
  }
  totalAmount = totalAmount + totalLandedCost

  // Calculate sellable quantity
  const sellableQuantity = totalQuantity - rejectedQty

  await prisma.$transaction(async (tx: any) => {
    await tx.gRN.update({
      where: { id },
      data: {
        productId,
        quantity: sellableQuantity,
        freeQuantity,
        uom,
        unitCost,
        discount,
        discountType,
        landedCost: totalLandedCost,
        freightCost,
        handlingCost,
        taxCost,
        trueUnitCost,
        totalAmount,
        balanceAmount: totalAmount - ((existingGRN as any).paidAmount || 0),
        supplierId,
        categoryId,
        subCategoryId,
        invoiceNumber,
        poNumber,
        paymentType,
        creditPeriod,
        dueDate,
        receivedDate,
        expiryDate,
        batchNumber,
        qcStatus,
        rejectedQty,
        rejectionReason
      }
    })

    // Adjust stock: remove old quantity, add new sellable quantity
    if (existingGRN) {
      const oldFreeQuantity = (existingGRN as any).freeQuantity || 0
      const oldRejectedQty = (existingGRN as any).rejectedQty || 0
      const oldSellableQuantity = existingGRN.quantity + oldFreeQuantity - oldRejectedQty
      const quantityDiff = sellableQuantity - oldSellableQuantity
      
      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            increment: quantityDiff
          },
          costPrice: trueUnitCost
        }
      })

      // Update StockBatch if exists
      if (batchNumber && expiryDate) {
        const today = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)
        const isExpiringSoon = expiryDate <= thirtyDaysFromNow

        const existingBatch = await tx.stockBatch.findFirst({
          where: { grnId: id }
        })
        if (existingBatch) {
          await tx.stockBatch.update({
            where: { id: existingBatch.id },
            data: {
              quantity: sellableQuantity,
              freeQuantity,
              uom,
              unitCost,
              trueUnitCost,
              expiryDate,
              currentQuantity: sellableQuantity,
              isExpiringSoon
            }
          })
        } else {
          await tx.stockBatch.create({
            data: {
              productId,
              batchNumber,
              quantity: sellableQuantity,
              freeQuantity,
              uom,
              unitCost,
              trueUnitCost,
              expiryDate,
              receivedDate,
              grnId: id,
              currentQuantity: sellableQuantity,
              isExpiringSoon
            }
          })
        }
      }
    }
  })
  revalidatePath('/grn')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function deleteGRN(id: number) {
  try {
    const existingGRN = await prisma.gRN.findUnique({
      where: { id }
    })

    await prisma.$transaction(async (tx: any) => {
      await tx.gRN.delete({
        where: { id }
      })

      // Decrease stock by the GRN quantity
      if (existingGRN) {
        const totalQuantity = existingGRN.quantity + ((existingGRN as any).freeQuantity || 0)
        await tx.product.update({
          where: { id: existingGRN.productId },
          data: {
            currentStock: {
              decrement: totalQuantity
            }
          }
        })
      }
    })
    revalidatePath('/grn')
    revalidatePath('/products')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: 'Failed to delete GRN. Please try again.'
    }
  }
}

export async function getGRNs() {
  return prisma.gRN.findMany({
    include: {
      product: {
        include: {
          categoryRef: true,
          subCategoryRef: true
        }
      },
      supplier: true,
      categoryRef: true,
      subCategoryRef: true
    }
  })
}

export async function getPendingGRNsBySupplier(supplierId: number) {
  return prisma.gRN.findMany({
    where: {
      supplierId,
      paymentStatus: {
        in: ['PENDING', 'PARTIALLY_PAID']
      }
    },
    include: {
      product: true,
      supplier: true
    },
    orderBy: {
      dueDate: 'asc'
    }
  })
}

export async function recordSupplierPayment(formData: FormData) {
  const supplierId = parseInt(formData.get('supplierId') as string)
  const paymentAmount = parseFloat(formData.get('paymentAmount') as string)
  const paymentMethod = formData.get('paymentMethod') as string
  const referenceNumber = formData.get('referenceNumber') as string || null
  const selectedGRNs = formData.get('selectedGRNs') as string
  const grnIds = selectedGRNs ? JSON.parse(selectedGRNs) : []
  const paymentDate = formData.get('paymentDate') ? new Date(formData.get('paymentDate') as string) : new Date()
  const notes = formData.get('notes') as string || null

  await prisma.$transaction(async (tx: any) => {
    let remainingPayment = paymentAmount
    
    // Distribute payment across selected GRNs
    for (const grnId of grnIds) {
      if (remainingPayment <= 0) break
      
      const grn = await tx.gRN.findUnique({
        where: { id: grnId }
      })
      
      if (!grn || grn.paymentStatus === 'PAID') continue
      
      const currentBalance = (grn.balanceAmount || grn.totalAmount || 0) - (grn.paidAmount || 0)
      const paymentForThisGRN = Math.min(remainingPayment, currentBalance)
      
      if (paymentForThisGRN > 0) {
        const newPaidAmount = (grn.paidAmount || 0) + paymentForThisGRN
        const newBalance = (grn.totalAmount || 0) - newPaidAmount
        
        // Update GRN payment status
        let newStatus = grn.paymentStatus
        if (newBalance <= 0.01) {
          newStatus = 'PAID'
        } else if (newPaidAmount > 0) {
          newStatus = 'PARTIALLY_PAID'
        }
        
        await tx.gRN.update({
          where: { id: grnId },
          data: {
            paidAmount: newPaidAmount,
            balanceAmount: newBalance,
            paymentStatus: newStatus
          }
        })
        
        // Create Supplier Ledger entry for payment
        await tx.supplierLedger.create({
          data: {
            supplierId,
            grnId: grnId,
            referenceType: 'PAYMENT',
            referenceNumber: referenceNumber,
            credit: paymentForThisGRN,
            balance: (grn.balanceAmount || 0) - paymentForThisGRN,
            paymentMethod,
            paidDate: paymentDate,
            isPaid: true,
            notes: `Payment for GRN #${grnId} - ${notes || ''}`
          }
        })
        
        remainingPayment -= paymentForThisGRN
      }
    }
    
    // Update supplier current balance
    const supplier = await tx.supplier.findUnique({
      where: { id: supplierId }
    })
    if (supplier) {
      await tx.supplier.update({
        where: { id: supplierId },
        data: {
          currentBalance: (supplier.currentBalance || 0) - paymentAmount
        }
      })
    }
  })
  
  revalidatePath('/grn')
  revalidatePath('/suppliers')
  return { success: true }
}
