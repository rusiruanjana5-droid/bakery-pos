import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, shiftId } = body

    if (!userId || !shiftId) {
      return NextResponse.json(
        { success: false, error: 'userId and shiftId are required' },
        { status: 400 }
      )
    }

    // Get current shift with sales data
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        user: true
      }
    })

    if (!shift) {
      return NextResponse.json(
        { success: false, error: 'Shift not found' },
        { status: 404 }
      )
    }

    if (shift.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Shift does not belong to this user' },
        { status: 403 }
      )
    }

    if (shift.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Shift is not active' },
        { status: 400 }
      )
    }

    // Calculate current sales snapshot
    const currentSalesSnapshot = shift.totalRevenue

    // Update shift to PAUSED status
    const pausedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        status: 'PAUSED',
        pausedAt: new Date(),
        currentSalesSnapshot
      }
    })

    // Create audit log entry
    await prisma.shiftAuditLog.create({
      data: {
        shiftId,
        actionType: 'PAUSED',
        fromUserId: userId,
        salesSnapshot: currentSalesSnapshot,
        notes: 'Shift paused for mid-shift handover'
      }
    })

    return NextResponse.json({
      success: true,
      shift: pausedShift,
      message: 'Shift paused successfully'
    })
  } catch (error) {
    console.error('Error pausing shift:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to pause shift' },
      { status: 500 }
    )
  }
}
