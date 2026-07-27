import prisma from '@/db'

async function testConnection() {
  console.log('Testing primary MySQL database connection...')
  try {
    await prisma.$connect()
    console.log('✓ MySQL database connected successfully')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✓ Query test passed:', result)
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`SHOW TABLES`
    console.log('✓ Tables in database:', tables)
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('✗ MySQL connection failed:', error.message)
    console.error('Error code:', error.code)
  }
}

testConnection()
