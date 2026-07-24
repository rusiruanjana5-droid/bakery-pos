import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { buildSalesReportBuffer } from '@/lib/salesReport'
import type { SalesFilter } from '@/lib/excelGenerator'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isLoggedIn || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const filter = (searchParams.get('filter') || '7days') as SalesFilter
    const startDate = searchParams.get('start') ?? undefined
    const endDate = searchParams.get('end') ?? undefined

    const validFilters: SalesFilter[] = ['7days', 'thisMonth', 'thisYear', 'custom']
    if (!validFilters.includes(filter)) {
      return NextResponse.json({ error: 'Invalid filter' }, { status: 400 })
    }

    if (filter === 'custom' && (!startDate || !endDate)) {
      return NextResponse.json(
        { error: 'Custom range requires start and end dates' },
        { status: 400 }
      )
    }

    const { buffer, filename } = await buildSalesReportBuffer(filter, startDate, endDate)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Export sales report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
