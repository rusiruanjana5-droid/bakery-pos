import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({ 
      success: true,
      connected: true 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      connected: false,
      error: 'Database not reachable'
    }, { status: 500 })
  }
}
