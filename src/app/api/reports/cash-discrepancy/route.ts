import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const shiftId = searchParams.get('shiftId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!shiftId && (!startDate || !endDate)) {
      return NextResponse.json(
        { success: false, error: 'Either shiftId or date range (startDate + endDate) is required' },
        { status: 400 }
      )
    }

    let shifts
    let whereClause: any = {}

    if (shiftId) {
      // Single shift calculation
      shifts = await prisma.shift.findMany({
        where: { id: parseInt(shiftId) },
        include: {
          user: true,
          auditLogs: true
        }
      })
    } else {
      // Date range calculation - get all ENDED shifts in range
      const start = new Date(startDate!)
      const end = new Date(endDate!)
      end.setHours(23, 59, 59, 999)

      whereClause = {
        closedAt: {
          gte: start,
          lte: end
        },
        status: 'ENDED'
      }

      shifts = await prisma.shift.findMany({
        where: whereClause,
        include: {
          user: true,
          auditLogs: true
        },
        orderBy: {
          closedAt: 'asc'
        }
      })
    }

    const results = []

    for (const shift of shifts) {
      // Get all orders for this shift
      const orders = await prisma.order.findMany({
        where: { shiftId: shift.id }
      })

      // Calculate sales by payment method
      let cashSales = 0
      let cardSales = 0
      let onlineSales = 0
      let totalRevenue = 0

      orders.forEach(order => {
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
      })

      // Calculate expected cash
      const expectedCash = shift.startingCash + cashSales

      // Calculate discrepancy
      const actualCash = shift.endingCash || 0
      const discrepancy = actualCash - expectedCash

      // Get expenses/payouts if any (you may need to add an Expense model later)
      const expenses = 0 // Placeholder for future expense tracking

      // Final expected cash accounting for expenses
      const finalExpectedCash = expectedCash - expenses
      const finalDiscrepancy = actualCash - finalExpectedCash

      // Calculate shift duration
      let shiftDuration = 'N/A'
      if (shift.openedAt && shift.closedAt) {
        const durationMs = shift.closedAt.getTime() - shift.openedAt.getTime()
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60))
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
        shiftDuration = `${durationHours}h ${durationMinutes}m`
      }

      results.push({
        shiftId: shift.id,
        cashier: shift.user.username,
        cashierRole: shift.user.role,
        openedAt: shift.openedAt,
        closedAt: shift.closedAt,
        shiftDuration,
        status: shift.status,
        startingCash: shift.startingCash,
        cashSales,
        cardSales,
        onlineSales,
        totalRevenue,
        expenses,
        expectedCash: finalExpectedCash,
        actualCash,
        discrepancy: finalDiscrepancy,
        discrepancyType: finalDiscrepancy > 0 ? 'SURPLUS' : finalDiscrepancy < 0 ? 'SHORTAGE' : 'BALANCED',
        notes: shift.notes,
        totalPauseDuration: shift.totalPauseDuration,
        auditLogCount: shift.auditLogs.length
      })
    }

    // If single shift, return just that result
    if (shiftId) {
      return NextResponse.json({
        success: true,
        discrepancy: results[0]
      })
    }

    // If date range, return aggregated results
    const totalDiscrepancy = results.reduce((sum, r) => sum + r.discrepancy, 0)
    const totalCashSales = results.reduce((sum, r) => sum + r.cashSales, 0)
    const totalCardSales = results.reduce((sum, r) => sum + r.cardSales, 0)
    const totalOnlineSales = results.reduce((sum, r) => sum + r.onlineSales, 0)
    const totalRevenue = results.reduce((sum, r) => sum + r.totalRevenue, 0)

    return NextResponse.json({
      success: true,
      summary: {
        totalShifts: results.length,
        totalRevenue,
        totalCashSales,
        totalCardSales,
        totalOnlineSales,
        totalDiscrepancy,
        overallStatus: totalDiscrepancy > 0 ? 'SURPLUS' : totalDiscrepancy < 0 ? 'SHORTAGE' : 'BALANCED'
      },
      details: results
    })
  } catch (error) {
    console.error('Error calculating cash discrepancy:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate cash discrepancy' },
      { status: 500 }
    )
  }
}
