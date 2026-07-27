import prisma from '../src/db'

async function resetDatabase() {
  console.log('Starting database reset...')
  
  // Delete in order respecting foreign key constraints
  console.log('Deleting Order...')
  await prisma.order.deleteMany({})
  
  console.log('Deleting StockBatch...')
  await prisma.stockBatch.deleteMany({})
  
  console.log('Deleting SupplierLedger...')
  await prisma.supplierLedger.deleteMany({})
  
  console.log('Deleting PurchaseOrderItem...')
  await prisma.purchaseOrderItem.deleteMany({})
  
  console.log('Deleting PurchaseOrder...')
  await prisma.purchaseOrder.deleteMany({})
  
  console.log('Deleting ProductCostHistory...')
  await prisma.productCostHistory.deleteMany({})
  
  console.log('Deleting CreditNoteItem...')
  await prisma.creditNoteItem.deleteMany({})
  
  console.log('Deleting CreditNote...')
  await prisma.creditNote.deleteMany({})
  
  console.log('Deleting RecipeItem...')
  await prisma.recipeItem.deleteMany({})
  
  console.log('Deleting GRN...')
  await prisma.gRN.deleteMany({})
  
  console.log('Deleting Shift...')
  await prisma.shift.deleteMany({})
  
  console.log('Deleting Product...')
  await prisma.product.deleteMany({})
  
  console.log('Deleting Supplier...')
  await prisma.supplier.deleteMany({})
  
  console.log('Deleting SpecialOffer...')
  await prisma.specialOffer.deleteMany({})
  
  console.log('Deleting NotificationLog...')
  await prisma.notificationLog.deleteMany({})
  
  // Reset auto-increment IDs (MySQL specific)
  console.log('Resetting auto-increment IDs...')
  const tablesToReset = [
    'Order',
    'StockBatch',
    'SupplierLedger',
    'PurchaseOrderItem',
    'PurchaseOrder',
    'ProductCostHistory',
    'CreditNoteItem',
    'CreditNote',
    'RecipeItem',
    'GRN',
    'Shift',
    'Product',
    'Supplier',
    'SpecialOffer'
  ]
  
  for (const table of tablesToReset) {
    await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`)
  }
  
  console.log('Database reset completed!')
  console.log('Preserved: User accounts, StoreSettings, Categories, SubCategories')
  console.log('Cleared: All orders, GRNs, products, suppliers, shifts, and related data')
}

resetDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error resetting database:', error)
    process.exit(1)
  })
