'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'
import { ChequeStatus } from '@prisma/client'

/**
 * Get all cheques with GRN details
 */
export async function getAllCheques() {
  try {
    const cheques = await prisma.gRN.findMany({
      where: {
        paymentType: 'Cheque / Bank Transfer',
        chequeNumber: {
          not: null
        }
      },
      include: {
        supplier: true,
        product: true
      },
      orderBy: {
        chequeDate: 'asc'
      }
    })
    return { success: true, cheques }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get cheques maturing within next N days
 */
export async function getMaturingCheques(days: number = 3) {
  try {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    const cheques = await prisma.gRN.findMany({
      where: {
        paymentType: 'Cheque / Bank Transfer',
        chequeNumber: {
          not: null
        },
        chequeDate: {
          gte: today,
          lte: futureDate
        },
        chequeStatus: {
          in: [ChequeStatus.PENDING]
        }
      },
      include: {
        supplier: true,
        product: true
      },
      orderBy: {
        chequeDate: 'asc'
      }
    })
    return { success: true, cheques }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Update cheque status
 */
export async function updateChequeStatus(grnId: number, status: ChequeStatus) {
  try {
    const grn = await prisma.gRN.update({
      where: { id: grnId },
      data: { chequeStatus: status },
      include: {
        supplier: true
      }
    })

    // If cheque is realized, update payment status
    if (status === ChequeStatus.REALIZED) {
      const paidAmount = grn.paidAmount || 0
      const totalAmount = grn.totalAmount || 0
      const newPaid = paidAmount + totalAmount
      
      await prisma.gRN.update({
        where: { id: grnId },
        data: {
          paidAmount: newPaid,
          balanceAmount: 0,
          paymentStatus: 'PAID'
        }
      })
      
      // Create ledger entry
      await prisma.supplierLedger.create({
        data: {
          supplierId: grn.supplierId,
          grnId,
          referenceType: 'CHEQUE_REALIZED',
          referenceNumber: grn.chequeNumber,
          credit: totalAmount,
          balance: 0,
          paymentMethod: 'Cheque / Bank Transfer',
          isPaid: true,
          paidDate: new Date(),
          notes: `Cheque ${grn.chequeNumber} realized`
        }
      })
    }

    revalidatePath('/finance/cheques')
    revalidatePath('/grn')
    revalidatePath('/suppliers')
    
    return { success: true, grn }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get cheque statistics
 */
export async function getChequeStats() {
  try {
    const today = new Date()
    const threeDaysLater = new Date()
    threeDaysLater.setDate(today.getDate() + 3)

    const [total, pending, realized, returned, maturing] = await Promise.all([
      prisma.gRN.count({
        where: {
          paymentType: 'Cheque / Bank Transfer',
          chequeNumber: { not: null }
        }
      }),
      prisma.gRN.count({
        where: {
          paymentType: 'Cheque / Bank Transfer',
          chequeNumber: { not: null },
          chequeStatus: ChequeStatus.PENDING
        }
      }),
      prisma.gRN.count({
        where: {
          paymentType: 'Cheque / Bank Transfer',
          chequeNumber: { not: null },
          chequeStatus: ChequeStatus.REALIZED
        }
      }),
      prisma.gRN.count({
        where: {
          paymentType: 'Cheque / Bank Transfer',
          chequeNumber: { not: null },
          chequeStatus: ChequeStatus.RETURNED
        }
      }),
      prisma.gRN.count({
        where: {
          paymentType: 'Cheque / Bank Transfer',
          chequeNumber: { not: null },
          chequeStatus: ChequeStatus.PENDING,
          chequeDate: {
            gte: today,
            lte: threeDaysLater
          }
        }
      })
    ])

    return {
      success: true,
      stats: {
        total,
        pending,
        realized,
        returned,
        maturing
      }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
