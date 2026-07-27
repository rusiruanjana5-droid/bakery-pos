import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, openingBalance = 0, notes = '' } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check if user has a PAUSED shift today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const pausedShift = await prisma.shift.findFirst({
      where: {
        userId,
        status: 'PAUSED',
        openedAt: {
          gte: today
        }
      },
      include: {
        user: true
      }
    })

    let shift

    if (pausedShift) {
      // Resume existing paused shift
      const pauseDuration = pausedShift.pausedAt
        ? Math.floor((new Date().getTime() - new Date(pausedShift.pausedAt).getTime()) / 1000)
        : 0

      const totalPauseDuration = (pausedShift.totalPauseDuration || 0) + pauseDuration

      shift = await prisma.shift.update({
        where: { id: pausedShift.id },
        data: {
          status: 'ACTIVE',
          resumedAt: new Date(),
          totalPauseDuration
        }
      })

      // Create audit log entry for resume
      await prisma.shiftAuditLog.create({
        data: {
          shiftId: pausedShift.id,
          actionType: 'RESUMED',
          toUserId: userId,
          salesSnapshot: pausedShift.currentSalesSnapshot,
          notes: 'Shift resumed after mid-shift handover'
        }
      })

      return NextResponse.json({
        success: true,
        shift,
        action: 'RESUMED',
        message: 'Shift resumed successfully'
      })
    } else {
      // Create new shift
      // Check for last shift's closing balance
      const lastShift = await prisma.shift.findFirst({
        where: {
          userId,
          status: 'ENDED'
        },
        orderBy: {
          closedAt: 'desc'
        }
      })

      const previousClosingBalance = lastShift?.endingCash ?? undefined

      shift = await prisma.shift.create({
        data: {
          userId,
          startingCash: openingBalance,
          notes,
          status: 'ACTIVE'
        },
        include: {
          user: true
        }
      })

      // Update user's last login
      await prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() }
      })

      // Create audit log entry for new shift
      await prisma.shiftAuditLog.create({
        data: {
          shiftId: shift.id,
          actionType: 'STARTED',
          toUserId: userId,
          salesSnapshot: 0,
          notes: previousClosingBalance !== undefined
            ? `Previous closing balance: Rs.${previousClosingBalance.toFixed(2)}`
            : 'New shift started'
        }
      })

      return NextResponse.json({
        success: true,
        shift,
        action: 'STARTED',
        previousClosingBalance,
        message: 'Shift started successfully'
      })
    }
  } catch (error) {
    console.error('Error in resume-or-start shift:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process shift action' },
      { status: 500 }
    )
  }
}
