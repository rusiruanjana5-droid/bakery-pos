import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation, payload } = body

    if (operation === 'CREATE') {
      await prisma.order.create({ data: payload })
    } else if (operation === 'UPDATE') {
      await prisma.order.update({ 
        where: { id: payload.id },
        data: payload 
      })
    } else if (operation === 'DELETE') {
      await prisma.order.delete({ where: { id: payload.id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
