import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const shiftId = searchParams.get('shiftId') // Optional: filter by specific shift

    let whereClause: any = {}

    if (shiftId) {
      whereClause.shiftId = parseInt(shiftId)
    } else if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      whereClause.createdAt = {
        gte: start,
        lte: end
      }
    }

    const auditLogs = await prisma.shiftAuditLog.findMany({
      where: whereClause,
      include: {
        shift: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role: true
              }
            }
          }
        },
        fromUser: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        toUser: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Format timeline entries
    const timeline = auditLogs.map(log => ({
      id: log.id,
      timestamp: log.createdAt,
      actionType: log.actionType,
      shiftId: log.shiftId,
      shiftUser: log.shift.user.username,
      fromUser: log.fromUser?.username || null,
      toUser: log.toUser?.username || null,
      salesSnapshot: log.salesSnapshot,
      notes: log.notes
    }))

    return NextResponse.json({
      success: true,
      timeline,
      totalEntries: timeline.length
    })
  } catch (error) {
    console.error('Error fetching shift audit timeline:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit timeline' },
      { status: 500 }
    )
  }
}
