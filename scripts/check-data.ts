import prisma from '@/db'

async function checkData() {
  console.log('Checking data in MySQL database...')
  
  try {
    // Check users
    const users = await prisma.user.findMany()
    console.log(`Users: ${users.length}`)
    if (users.length > 0) {
      console.log('Sample user:', users[0].username)
    }
    
    // Check products
    const products = await prisma.product.findMany()
    console.log(`Products: ${products.length}`)
    
    // Check categories
    const categories = await prisma.category.findMany()
    console.log(`Categories: ${categories.length}`)
    
    // Check GRNs
    const grns = await prisma.gRN.findMany()
    console.log(`GRNs: ${grns.length}`)
    
    // Check suppliers
    const suppliers = await prisma.supplier.findMany()
    console.log(`Suppliers: ${suppliers.length}`)
    
    // Check orders
    const orders = await prisma.order.findMany()
    console.log(`Orders: ${orders.length}`)
    
    await prisma.$disconnect()
  } catch (error: any) {
    console.error('Error checking data:', error.message)
  }
}

checkData()
