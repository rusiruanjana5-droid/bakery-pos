'use server'

import prisma from '@/db'

export async function getSupplierAnalytics() {
  const suppliers = await prisma.supplier.findMany()
  
  // Calculate total outstanding balance
  const totalOutstandingBalance = suppliers.reduce((sum: number, supplier: any) => {
    return sum + (supplier.currentBalance || 0)
  }, 0)

  // Calculate overdue payments count
  const today = new Date()
  const overduePayments = await (prisma as any).supplierLedger.findMany({
    where: {
      isPaid: false,
      dueDate: {
        lt: today
      }
    }
  })

  return {
    totalSuppliers: suppliers.length,
    totalOutstandingBalance,
    overduePaymentsCount: overduePayments.length
  }
}

export async function getSupplierPaymentStatus(supplierId: number) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    include: {
      ledgerEntries: {
        where: {
          isPaid: false
        },
        orderBy: {
          dueDate: 'asc'
        }
      }
    }
  })

  if (!supplier) return null

  const today = new Date()
  const hasOverdue = supplier.ledgerEntries.some((entry: any) => 
    entry.dueDate < today && !entry.isPaid
  )
  const hasPending = supplier.ledgerEntries.some((entry: any) => 
    entry.dueDate >= today && !entry.isPaid
  )

  if (hasOverdue) return 'Overdue'
  if (hasPending) return 'Pending'
  if (supplier.currentBalance === 0) return 'Paid'
  return 'Pending'
}

export async function getSupplierGRNHistory(supplierId: number) {
  const grns = await prisma.gRN.findMany({
    where: { supplierId },
    include: {
      product: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return grns.map((grn: any) => ({
    date: grn.createdAt,
    grnNumber: `GRN-${grn.id}`,
    itemName: grn.product.name,
    quantity: grn.quantity,
    unitCost: grn.unitCost,
    totalAmount: grn.quantity * grn.unitCost
  }))
}

export async function getSupplierPaymentLedger(supplierId: number) {
  const ledger = await (prisma as any).supplierLedger.findMany({
    where: { supplierId },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return ledger.map((entry: any) => ({
    date: entry.createdAt,
    receiptNumber: entry.receiptNumber || `PAY-${entry.id}`,
    paidAmount: entry.credit || 0,
    paymentMethod: entry.paymentMethod || 'N/A',
    remainingBalance: entry.remainingBalance || 0,
    isPaid: entry.isPaid,
    dueDate: entry.dueDate
  }))
}

export async function recordSupplierPayment(supplierId: number, amount: number, paymentMethod: string) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId }
  })

  if (!supplier) {
    return { success: false, error: 'Supplier not found' }
  }

  if (amount > (supplier.currentBalance || 0)) {
    return { success: false, error: 'Payment amount exceeds outstanding balance' }
  }

  await prisma.$transaction(async (tx: any) => {
    // Create ledger entry for payment
    await tx.supplierLedger.create({
      data: {
        supplierId,
        credit: amount, // Credit reduces the balance
        debit: 0,
        paymentMethod,
        isPaid: true,
        balance: (supplier.currentBalance || 0) - amount,
        referenceNumber: `PAY-${Date.now()}`,
        referenceType: 'PAYMENT'
      }
    })

    // Update supplier balance
    await tx.supplier.update({
      where: { id: supplierId },
      data: {
        currentBalance: (supplier.currentBalance || 0) - amount
      }
    })
  })

  return { success: true }
}
