'use server'

import prisma from '@/db'
import { sendShiftStartNotification } from '@/lib/notificationService'
import { getStoreSettings } from './store'
import { revalidatePath } from 'next/cache'

export async function getActiveShift(userId: number) {
  try {
    const shift = await prisma.shift.findFirst({
      where: {
        userId,
        status: 'OPEN'
      },
      include: {
        user: {
          select: {
            username: true,
            role: true
          }
        }
      }
    })

    return shift
  } catch (error) {
    console.error('Error getting active shift:', error)
    return null
  }
}

export async function startShift(userId: number, startingCash: number = 0, notes?: string) {
  try {
    // Check if user already has an OPEN shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId,
        status: 'OPEN'
      }
    })

    if (activeShift) {
      return { success: false, error: 'User already has an active shift' }
    }

    // Validate starting cash
    if (startingCash < 0) {
      return { success: false, error: 'Starting cash cannot be negative' }
    }

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Get last shift's closing balance for discrepancy tracking
    const lastShift = await prisma.shift.findFirst({
      where: {
        userId,
        status: 'CLOSED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const previousClosingBalance = lastShift?.endingCash ?? undefined

    // Create new shift with status OPEN
    const shift = await prisma.shift.create({
      data: {
        userId,
        startingCash,
        notes,
        status: 'OPEN'
      }
    })

    // Update user's last login
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    })

    // Revalidate POS path to refresh shift state
    revalidatePath('/pos')

    // Send notification asynchronously (non-blocking)
    // Fire and forget - don't await to avoid blocking the cashier
    sendNotificationAsync(shift.id, userId, startingCash, previousClosingBalance, notes, user.username).catch(
      (error) => console.error('Notification error (non-blocking):', error)
    )

    return { success: true, shift }
  } catch (error) {
    console.error('Error starting shift:', error)
    return { success: false, error: 'Failed to start shift' }
  }
}

// Helper function to send notification asynchronously
async function sendNotificationAsync(
  shiftId: number,
  userId: number,
  openingBalance: number,
  previousClosingBalance: number | undefined,
  notes: string | undefined,
  cashierUsername: string
) {
  try {
    const storeSettings = await getStoreSettings()
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || !storeSettings) {
      return
    }

    await sendShiftStartNotification(
      {
        cashierName: user.username,
        cashierUsername: user.username,
        shiftId,
        openingBalance,
        previousClosingBalance,
        notes,
        timestamp: new Date(),
        storeName: storeSettings.shopName || 'Bakery POS',
      },
      storeSettings
    )
  } catch (error) {
    console.error('Async notification error:', error)
  }
}

// Helper function to send shift end notification asynchronously
async function sendShiftEndNotificationAsync(
  shiftId: number,
  userId: number,
  cashierUsername: string,
  openingBalance: number,
  totalCashSales: number,
  closingCash: number,
  expectedCash: number,
  discrepancy: number,
  notes: string | undefined,
  shiftStartTime: Date,
  shiftEndTime: Date
) {
  try {
    const storeSettings = await getStoreSettings()

    if (!storeSettings) {
      return
    }

    // Calculate shift duration
    const durationMs = shiftEndTime.getTime() - shiftStartTime.getTime()
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    const shiftDuration = `${durationHours}h ${durationMinutes}m`

    // Import and call the shift end notification function
    const { sendShiftEndNotification } = await import('@/lib/notificationService')
    
    await sendShiftEndNotification(
      {
        cashierName: cashierUsername,
        cashierUsername,
        shiftId,
        openingBalance,
        totalCashSales,
        closingCash,
        expectedCash,
        discrepancy,
        notes,
        shiftDuration,
        shiftStartTime,
        shiftEndTime,
        timestamp: new Date(),
        storeName: storeSettings.shopName || 'Bakery POS',
      },
      storeSettings
    )
  } catch (error) {
    console.error('Async shift end notification error:', error)
  }
}

export async function endShift(shiftId: number, actualCash: number, notes?: string) {
  try {
    console.log('endShift called with:', { shiftId, actualCash, notes })
    
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        user: true
      }
    })

    if (!shift) {
      console.error('Shift not found:', shiftId)
      return { success: false, error: `Shift with ID ${shiftId} not found` }
    }

    if (shift.status !== 'OPEN') {
      console.error('Shift is not open:', shift.status)
      return { success: false, error: `Shift is not open (current status: ${shift.status})` }
    }

    // Fetch all cash sales made during the shift timeframe
    const orders = await prisma.order.findMany({
      where: {
        shiftId: shiftId,
        paymentMethod: 'CASH'
      }
    })

    // Calculate total cash sales
    const totalCashSales = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

    // Calculate expected cash
    const expectedCash = shift.startingCash + totalCashSales

    // Calculate discrepancy
    const discrepancy = actualCash - expectedCash

    console.log('Shift closure data:', {
      shiftId,
      startingCash: shift.startingCash,
      totalCashSales,
      expectedCash,
      actualCash,
      discrepancy
    })

    // Close the shift
    const closedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        closedAt: new Date(),
        endingCash: actualCash,
        expectedCash,
        discrepancy,
        notes,
        status: 'CLOSED'
      }
    })

    console.log('Shift closed successfully:', closedShift.id)

    // Revalidate POS path to refresh shift state
    revalidatePath('/pos')

    // Send notification asynchronously (non-blocking)
    sendShiftEndNotificationAsync(
      shiftId,
      shift.userId,
      shift.user.username,
      shift.startingCash,
      totalCashSales,
      actualCash,
      expectedCash,
      discrepancy,
      notes,
      shift.createdAt || new Date(),
      closedShift.closedAt || new Date()
    ).catch((error: any) => console.error('Shift end notification error (non-blocking):', error))

    return { success: true, shift: closedShift }
  } catch (error: any) {
    console.error('Error ending shift:', error)
    return { success: false, error: `Failed to end shift: ${error?.message || 'Unknown error'}` }
  }
}

export async function getLastShift(userId: number) {
  try {
    const shift = await prisma.shift.findFirst({
      where: {
        userId,
        status: 'CLOSED'
      },
      orderBy: {
        closedAt: 'desc'
      }
    })

    return shift
  } catch (error) {
    console.error('Error getting last shift:', error)
    return null
  }
}

export async function getShiftSummary(shiftId: number) {
  try {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        user: {
          select: {
            username: true,
            role: true
          }
        }
      }
    })

    if (!shift) {
      return null
    }

    // Calculate real-time sales from orders
    const orders = await prisma.order.findMany({
      where: {
        shiftId: shiftId
      }
    })

    // Calculate totals by payment method
    let cashSales = 0
    let cardSales = 0
    let onlineSales = 0
    let totalRevenue = 0

    for (const order of orders) {
      const amount = order.totalPrice || 0
      const paymentMethod = order.paymentMethod?.toLowerCase() || ''

      if (paymentMethod === 'cash') {
        cashSales += amount
      } else if (paymentMethod === 'card') {
        cardSales += amount
      } else if (paymentMethod === 'online') {
        onlineSales += amount
      }

      totalRevenue += amount
    }

    // Fallback: if no orders with shiftId, query by time range for backward compatibility
    if (orders.length === 0) {
      const fallbackOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: shift.openedAt
          },
          shiftId: null
        }
      })

      for (const order of fallbackOrders) {
        const amount = order.totalPrice || 0
        const paymentMethod = order.paymentMethod?.toLowerCase() || ''

        if (paymentMethod === 'cash') {
          cashSales += amount
        } else if (paymentMethod === 'card') {
          cardSales += amount
        } else if (paymentMethod === 'online') {
          onlineSales += amount
        }

        totalRevenue += amount
      }
    }

    // Calculate expected cash in drawer
    const expectedCash = (shift.startingCash || 0) + cashSales

    // Return shift with calculated totals
    return {
      ...shift,
      cashSales,
      cardSales,
      onlineSales,
      totalRevenue,
      expectedCash
    }
  } catch (error) {
    console.error('Error getting shift summary:', error)
    return null
  }
}

// Legacy function for backward compatibility - deprecated
export async function updateShiftSales(shiftId: number, paymentMethod: string, amount: number) {
  try {
    const updateData: any = {
      totalRevenue: { increment: amount }
    }

    if (paymentMethod.toLowerCase() === 'cash') {
      updateData.cashSales = { increment: amount }
    } else if (paymentMethod.toLowerCase() === 'card') {
      updateData.cardSales = { increment: amount }
    } else if (paymentMethod.toLowerCase() === 'online') {
      updateData.onlineSales = { increment: amount }
    }

    await prisma.shift.update({
      where: { id: shiftId },
      data: updateData
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating shift sales:', error)
    return { success: false, error: 'Failed to update shift sales' }
  }
}

// Legacy function for backward compatibility - deprecated
export async function closeShift(shiftId: number, cashInHand: number, notes?: string) {
  return endShift(shiftId, cashInHand, notes)
}
