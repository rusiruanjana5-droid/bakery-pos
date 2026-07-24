import prisma from '@/db'

async function testPOS() {
  console.log('=== Starting POS System Test ===\n')

  // 1. Create Supplier
  console.log('1. Creating Supplier...')
  const supplier = await prisma.supplier.create({
    data: {
      name: 'John Doe',
      phone: '1234567890',
      company: 'Doe Bakery Supplies'
    }
  })
  console.log('✅ Supplier created:', supplier)

  // 2. Create Product
  console.log('\n2. Creating Product...')
  const product = await prisma.product.create({
    data: {
      name: 'Croissant',
      category: 'Pastry',
      costPrice: 1.5,
      sellingPrice: 3.0,
      currentStock: 0,
      supplierId: supplier.id
    }
  })
  console.log('✅ Product created:', product)

  // 3. Create GRN (Stock In)
  console.log('\n3. Creating GRN (Stock In)...')
  const grn = await prisma.$transaction(async (tx: any) => {
    const g = await tx.gRN.create({
      data: {
        productId: product.id,
        quantity: 50,
        unitCost: 1.5,
        supplierId: supplier.id
      }
    })
    await tx.product.update({
      where: { id: product.id },
      data: { currentStock: { increment: 50 } }
    })
    return g
  })
  console.log('✅ GRN created:', grn)
  const updatedProductAfterGRN = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('📦 Product stock after GRN:', updatedProductAfterGRN?.currentStock)

  // 4. Create Order (Stock Out)
  console.log('\n4. Creating Order (Stock Out)...')
  const order = await prisma.$transaction(async (tx: any) => {
    const p = await tx.product.findUnique({ where: { id: product.id } })
    if (!p) throw new Error('Product not found')
    if (p.currentStock < 10) throw new Error('Insufficient stock')
    
    const o = await tx.order.create({
      data: {
        productId: product.id,
        quantity: 10,
        totalPrice: 30.0,
        paymentMethod: 'Cash'
      }
    })
    await tx.product.update({
      where: { id: product.id },
      data: { currentStock: { decrement: 10 } }
    })
    return o
  })
  console.log('✅ Order created:', order)
  const updatedProductAfterOrder = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('📦 Product stock after Order:', updatedProductAfterOrder?.currentStock)

  console.log('\n=== All tests completed successfully! ===')
}

testPOS()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
