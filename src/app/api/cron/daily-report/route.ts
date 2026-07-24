import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'
import { getLast24HoursRange } from '@/lib/reportUtils'
import { buildSalesReportForRange } from '@/lib/salesReport'
import { sendDailyReportToAdmin } from '@/lib/emailService'

function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) return true

  const querySecret = request.nextUrl.searchParams.get('secret')
  return querySecret === secret
}

export async function GET(request: NextRequest) {
  return handleDailyReport(request)
}

export async function POST(request: NextRequest) {
  return handleDailyReport(request)
}

async function handleDailyReport(request: NextRequest) {
  try {
    if (!verifyCronSecret(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storeSettings = await prisma.storeSettings.findFirst()
    const adminEmail =
      storeSettings?.reportEmail || process.env.REPORT_EMAIL || process.env.EMAIL_SERVER_USER

    if (!adminEmail) {
      return NextResponse.json(
        {
          error:
            'No report recipient configured. Set reportEmail in Store Settings or REPORT_EMAIL env var.',
        },
        { status: 400 }
      )
    }

    const dateRange = getLast24HoursRange()
    const { buffer, filename } = await buildSalesReportForRange(dateRange)

    await sendDailyReportToAdmin(adminEmail, buffer, {
      shopName: storeSettings?.shopName ?? 'Bakery POS',
      filename,
      dateRangeLabel: dateRange.label,
    })

    return NextResponse.json({
      success: true,
      message: `Daily report sent to ${adminEmail}`,
      period: dateRange.label,
      filename,
    })
  } catch (error) {
    console.error('Daily report cron error:', error)
    const message = error instanceof Error ? error.message : 'Failed to send daily report'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
