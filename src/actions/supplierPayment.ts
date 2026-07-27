'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

/**
 * Get outstanding GRNs for a supplier
 */
export async function getOutstandingGRNs(supplierId: number) {
  try {
    const grns = await prisma.gRN.findMany({
      where: {
        supplierId,
        paymentStatus: {
          in: ['PENDING', 'PARTIALLY_PAID']
        }
      },
      include: {
        product: true
      },
      orderBy: {
        receivedDate: 'desc'
      }
    })
    return { success: true, grns }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Allocate payment against specific GRNs
 */
export async function allocatePayment(formData: FormData) {
  try {
    const supplierId = parseInt(formData.get('supplierId') as string)
    const paymentAmount = parseFloat(formData.get('paymentAmount') as string)
    const paymentMethod = formData.get('paymentMethod') as string
    const allocationsJson = formData.get('allocations') as string
    
    if (!supplierId || !paymentAmount || paymentAmount <= 0) {
      return { success: false, error: 'Invalid payment details' }
    }

    const allocations = JSON.parse(allocationsJson)
    
    let totalAllocated = 0
    
    await prisma.$transaction(async (tx) => {
      // Process each allocation
      for (const allocation of allocations) {
        const grnId = allocation.grnId
        const amount = allocation.amount
        
        if (amount <= 0) continue
        
        totalAllocated += amount
        
        // Get current GRN
        const grn = await tx.gRN.findUnique({
          where: { id: grnId }
        })
        
        if (!grn) continue
        
        const currentPaid = grn.paidAmount || 0
        const newPaid = currentPaid + amount
        const totalAmount = grn.totalAmount || 0
        
        // Update GRN
        await tx.gRN.update({
          where: { id: grnId },
          data: {
            paidAmount: newPaid,
            balanceAmount: totalAmount - newPaid,
            paymentStatus: newPaid >= totalAmount ? 'PAID' : 'PARTIALLY_PAID'
          }
        })
        
        // Create ledger entry
        await tx.supplierLedger.create({
          data: {
            supplierId,
            grnId,
            referenceType: 'PAYMENT',
            referenceNumber: `PAY-${Date.now()}`,
            credit: amount,
            balance: (grn.balanceAmount || 0) - amount,
            paymentMethod,
            isPaid: newPaid >= totalAmount,
            paidDate: new Date()
          }
        })
      }
      
      // Create summary ledger entry for the payment
      await tx.supplierLedger.create({
        data: {
          supplierId,
          referenceType: 'PAYMENT',
          referenceNumber: `PAY-${Date.now()}`,
          credit: totalAllocated,
          balance: 0, // Will be recalculated
          paymentMethod,
          isPaid: true,
          paidDate: new Date(),
          notes: `Bulk payment allocation: ${allocations.length} GRNs`
        }
      })
    })
    
    // Recalculate supplier status
    const grns = await prisma.gRN.findMany({
      where: { supplierId }
    })
    
    let totalOutstanding = 0
    let hasPending = false
    let hasOverdue = false
    const today = new Date()
    
    for (const grn of grns) {
      const balance = (grn.totalAmount || 0) - (grn.paidAmount || 0)
      totalOutstanding += balance
      
      if (balance > 0.01) {
        hasPending = true
        if (grn.dueDate && new Date(grn.dueDate) < today) {
          hasOverdue = true
        }
      }
    }
    
    let paymentStatus = 'PAID'
    if (hasOverdue) {
      paymentStatus = 'OVERDUE'
    } else if (hasPending) {
      paymentStatus = 'PENDING'
    }
    
    await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        currentBalance: totalOutstanding,
        paymentStatus: paymentStatus as any
      }
    })

    revalidatePath('/suppliers')
    revalidatePath('/suppliers/payments')
    revalidatePath('/grn')
    
    return { success: true, totalAllocated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get supplier payment history
 */
export async function getSupplierPaymentHistory(supplierId: number) {
  try {
    const ledgerEntries = await prisma.supplierLedger.findMany({
      where: {
        supplierId,
        referenceType: 'PAYMENT'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })
    return { success: true, ledgerEntries }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
