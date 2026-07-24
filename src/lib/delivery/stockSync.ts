// @ts-ignore - Prisma client needs regeneration after schema update
import prisma from '@/db'

/**
 * Stock Synchronization Service
 * Syncs local stock status to external delivery platforms (Uber Eats, PickMe)
 */
class StockSyncService {
  /**
   * Sync a single product's stock status to all enabled platforms
   */
  async syncProductStock(productId: number, stock: number): Promise<void> {
    const storeSettings = await prisma.storeSettings.findFirst()
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product || !storeSettings) {
      return
    }

    const isOutOfStock = stock <= 0

    // Sync to Uber Eats if enabled
    if (storeSettings.uberEatsEnabled && product.externalUberEatsId) {
      await this.syncToUberEats(product.externalUberEatsId, isOutOfStock)
    }

    // Sync to PickMe if enabled
    if (storeSettings.pickMeEnabled && product.externalPickMeId) {
      await this.syncToPickMe(product.externalPickMeId, isOutOfStock)
    }
  }

  /**
   * Sync stock status to Uber Eats
   */
  private async syncToUberEats(externalId: string, isOutOfStock: boolean): Promise<void> {
    const storeSettings = await prisma.storeSettings.findFirst()
    
    if (!storeSettings?.uberEatsEnabled || !storeSettings.uberEatsApiKey) {
      return
    }

    try {
      // TODO: Implement actual Uber Eats API call
      console.log(`Uber Eats stock sync: Item ${externalId} -> ${isOutOfStock ? 'OUT_OF_STOCK' : 'AVAILABLE'}`)
    } catch (error) {
      console.error('Failed to sync stock to Uber Eats:', error)
    }
  }

  /**
   * Sync stock status to PickMe
   */
  private async syncToPickMe(externalId: string, isOutOfStock: boolean): Promise<void> {
    const storeSettings = await prisma.storeSettings.findFirst()
    
    if (!storeSettings?.pickMeEnabled || !storeSettings.pickMeApiKey) {
      return
    }

    try {
      // TODO: Implement actual PickMe API call
      console.log(`PickMe stock sync: Item ${externalId} -> ${isOutOfStock ? 'unavailable' : 'available'}`)
    } catch (error) {
      console.error('Failed to sync stock to PickMe:', error)
    }
  }

  /**
   * Bulk sync all products to enabled platforms
   */
  async syncAllProducts(): Promise<{ uberEats: number; pickMe: number; errors: number }> {
    const storeSettings = await prisma.storeSettings.findFirst()
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { externalUberEatsId: { not: null } },
          { externalPickMeId: { not: null } }
        ]
      }
    })

    let uberEatsCount = 0
    let pickMeCount = 0
    let errorCount = 0

    for (const product of products) {
      const isOutOfStock = (product.currentStock || 0) <= 0

      try {
        if (storeSettings?.uberEatsEnabled && product.externalUberEatsId) {
          await this.syncToUberEats(product.externalUberEatsId, isOutOfStock)
          uberEatsCount++
        }

        if (storeSettings?.pickMeEnabled && product.externalPickMeId) {
          await this.syncToPickMe(product.externalPickMeId, isOutOfStock)
          pickMeCount++
        }
      } catch (error) {
        console.error(`Failed to sync product ${product.id}:`, error)
        errorCount++
      }
    }

    return { uberEats: uberEatsCount, pickMe: pickMeCount, errors: errorCount }
  }
}

// Export singleton instance
export const stockSyncService = new StockSyncService()
