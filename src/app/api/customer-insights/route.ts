import { NextResponse } from 'next/server'
import { getCustomerInsights } from '@/actions/order'

export async function GET() {
  try {
    const insights = await getCustomerInsights()
    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error fetching customer insights:', error)
    return NextResponse.json({ error: 'Failed to fetch customer insights' }, { status: 500 })
  }
}
