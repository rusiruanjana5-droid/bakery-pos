import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const userId = searchParams.get('userId') // Optional: filter by specific cashier

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    // Build where clause
    const whereClause: any = {
      openedAt: {
        gte: start,
        lte: end
      }
    }

    if (userId) {
      whereClause.userId = parseInt(userId)
    }

    // Get all shifts in the date range
    const shifts = await prisma.shift.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        auditLogs: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        openedAt: 'asc'
      }
    })

    // Get orders for these shifts to calculate accurate sales
    const shiftIds = shifts.map(s => s.id)
    const orders = await prisma.order.findMany({
      where: {
        shiftId: {
          in: shiftIds
        }
      }
    })

    // Group orders by shift and payment method
    const ordersByShift = new Map<number, any[]>()
    orders.forEach(order => {
      if (order.shiftId) {
        if (!ordersByShift.has(order.shiftId)) {
          ordersByShift.set(order.shiftId, [])
        }
        ordersByShift.get(order.shiftId)!.push(order)
      }
    })

    // Calculate per-cashier breakdown
    const cashierBreakdown = new Map<number, any>()

    shifts.forEach(shift => {
      const userId = shift.userId
      const shiftOrders = ordersByShift.get(shift.id) || []

      let cashSales = 0
      let cardSales = 0
      let onlineSales = 0
      let totalSales = 0

      shiftOrders.forEach(order => {
        const amount = order.totalPrice || 0
        const paymentMethod = order.paymentMethod?.toLowerCase() || ''

        if (paymentMethod === 'cash') {
          cashSales += amount
        } else if (paymentMethod === 'card') {
          cardSales += amount
        } else if (paymentMethod === 'online') {
          onlineSales += amount
        }

        totalSales += amount
      })

      if (!cashierBreakdown.has(userId)) {
        cashierBreakdown.set(userId, {
          userId,
          username: shift.user.username,
          role: shift.user.role,
          totalShifts: 0,
          totalSales: 0,
          totalCashSales: 0,
          totalCardSales: 0,
          totalOnlineSales: 0,
          shifts: []
        })
      }

      const cashierData = cashierBreakdown.get(userId)!
      cashierData.totalShifts += 1
      cashierData.totalSales += totalSales
      cashierData.totalCashSales += cashSales
      cashierData.totalCardSales += cardSales
      cashierData.totalOnlineSales += onlineSales

      cashierData.shifts.push({
        shiftId: shift.id,
        openedAt: shift.openedAt,
        closedAt: shift.closedAt,
        status: shift.status,
        startingCash: shift.startingCash,
        endingCash: shift.endingCash,
        expectedCash: shift.expectedCash,
        discrepancy: shift.discrepancy,
        cashSales,
        cardSales,
        onlineSales,
        totalSales,
        pausedAt: shift.pausedAt,
        resumedAt: shift.resumedAt,
        totalPauseDuration: shift.totalPauseDuration,
        auditLogs: shift.auditLogs
      })
    })

    // Convert map to array
    const summary = Array.from(cashierBreakdown.values()).sort((a, b) =>
      a.username.localeCompare(b.username)
    )

    return NextResponse.json({
      success: true,
      summary,
      totalCashiers: summary.length,
      dateRange: {
        start: startDate,
        end: endDate
      }
    })
  } catch (error) {
    console.error('Error generating cashier shift summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate shift summary' },
      { status: 500 }
    )
  }
}
