import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup for client delivery...')
  
  try {
    // Delete in order respecting foreign key relationships
    
    // 1. Delete Orders (sales history)
    console.log('📦 Deleting orders...')
    const deletedOrders = await prisma.order.deleteMany({})
    console.log(`   ✓ Deleted ${deletedOrders.count} orders`)
    
    // 2. Delete Shifts
    console.log('🔄 Deleting shifts...')
    const deletedShifts = await prisma.shift.deleteMany({})
    console.log(`   ✓ Deleted ${deletedShifts.count} shifts`)
    
    // 3. Delete Credit Notes
    console.log('📝 Deleting credit notes...')
    const deletedCreditNotes = await prisma.creditNote.deleteMany({})
    console.log(`   ✓ Deleted ${deletedCreditNotes.count} credit notes`)
    
    // 4. Delete Purchase Orders
    console.log('🛒 Deleting purchase orders...')
    const deletedPurchaseOrders = await prisma.purchaseOrder.deleteMany({})
    console.log(`   ✓ Deleted ${deletedPurchaseOrders.count} purchase orders`)
    
    // 5. Delete GRN records
    console.log('📥 Deleting GRN records...')
    const deletedGRNs = await prisma.gRN.deleteMany({})
    console.log(`   ✓ Deleted ${deletedGRNs.count} GRN records`)
    
    // 6. Delete Supplier Ledger entries
    console.log('💰 Deleting supplier ledger entries...')
    const deletedLedgerEntries = await prisma.supplierLedger.deleteMany({})
    console.log(`   ✓ Deleted ${deletedLedgerEntries.count} ledger entries`)
    
    // 7. Delete Special Offers
    console.log('🎁 Deleting special offers...')
    const deletedOffers = await prisma.specialOffer.deleteMany({})
    console.log(`   ✓ Deleted ${deletedOffers.count} special offers`)
    
    // 8. Delete Stock Batches
    console.log('📦 Deleting stock batches...')
    const deletedStockBatches = await prisma.stockBatch.deleteMany({})
    console.log(`   ✓ Deleted ${deletedStockBatches.count} stock batches`)
    
    // 9. Delete Product Cost History
    console.log('📊 Deleting product cost history...')
    const deletedCostHistory = await prisma.productCostHistory.deleteMany({})
    console.log(`   ✓ Deleted ${deletedCostHistory.count} cost history records`)
    
    // 10. Delete Recipe Items
    console.log('🍳 Deleting recipe items...')
    const deletedRecipeItems = await prisma.recipeItem.deleteMany({})
    console.log(`   ✓ Deleted ${deletedRecipeItems.count} recipe items`)
    
    // 11. Delete Products
    console.log('🏷️  Deleting products...')
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`   ✓ Deleted ${deletedProducts.count} products`)
    
    // 12. Delete SubCategories
    console.log('📂 Deleting subcategories...')
    const deletedSubCategories = await prisma.subCategory.deleteMany({})
    console.log(`   ✓ Deleted ${deletedSubCategories.count} subcategories`)
    
    // 13. Delete Categories
    console.log('📁 Deleting categories...')
    const deletedCategories = await prisma.category.deleteMany({})
    console.log(`   ✓ Deleted ${deletedCategories.count} categories`)
    
    // 14. Delete Suppliers
    console.log('🏭 Deleting suppliers...')
    const deletedSuppliers = await prisma.supplier.deleteMany({})
    console.log(`   ✓ Deleted ${deletedSuppliers.count} suppliers`)
    
    // 15. Delete Notification Logs
    console.log('🔔 Deleting notification logs...')
    const deletedNotificationLogs = await prisma.notificationLog.deleteMany({})
    console.log(`   ✓ Deleted ${deletedNotificationLogs.count} notification logs`)
    
    // 16. Delete non-Admin users (keep only Admin users)
    console.log('👤 Deleting non-Admin users...')
    const deletedNonAdminUsers = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    })
    console.log(`   ✓ Deleted ${deletedNonAdminUsers.count} non-Admin users`)
    
    // Verify Admin user still exists
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    })
    console.log(`✅ Preserved ${adminUsers.length} Admin user(s)`)
    
    // Verify StoreSettings still exists
    const storeSettings = await prisma.storeSettings.findFirst()
    if (storeSettings) {
      console.log(`✅ Preserved StoreSettings: ${storeSettings.shopName}`)
    } else {
      console.log('⚠️  Warning: No StoreSettings found')
    }
    
    console.log('\n✨ Database cleanup completed successfully!')
    console.log('📋 Summary:')
    console.log('   - All operational data deleted')
    console.log('   - Admin user(s) preserved')
    console.log('   - System configuration preserved')
    console.log('   - Database schemas intact')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupDatabase()
  .then(() => {
    console.log('✅ Cleanup script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error)
    process.exit(1)
  })
