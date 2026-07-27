// @ts-ignore - Prisma client needs regeneration after schema update
import prisma from '@/db'
import { getStoreSettings } from '@/actions/store'
// @ts-ignore - Prisma client needs regeneration after schema update
import { OrderSource, DeliveryPlatform } from '@prisma/client'

interface QueuedOrder {
  id: string
  platform: DeliveryPlatform
  orderData: any
  timestamp: Date
  status: 'pending' | 'processing' | 'failed'
  retryCount: number
}

/**
 * Offline Order Queue Service
 * Manages orders received when the POS is offline and syncs them when connection is restored
 */
class OfflineOrderQueue {
  private queue: QueuedOrder[] = []
  private isProcessing = false
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.loadQueueFromStorage()
    this.startAutoSync()
  }

  /**
   * Add an order to the offline queue
   */
  async enqueueOrder(platform: DeliveryPlatform, orderData: any): Promise<void> {
    const queuedOrder: QueuedOrder = {
      id: this.generateId(),
      platform,
      orderData,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0
    }

    this.queue.push(queuedOrder)
    await this.saveQueueToStorage()
    console.log(`Order queued for ${platform}:`, queuedOrder.id)
  }

  /**
   * Process all pending orders in the queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true
    console.log('Processing offline order queue...')

    const pendingOrders = this.queue.filter(o => o.status === 'pending')

    for (const order of pendingOrders) {
      try {
        order.status = 'processing'
        await this.saveQueueToStorage()

        await this.processOrder(order)
        
        // Remove successfully processed order
        this.queue = this.queue.filter(o => o.id !== order.id)
        await this.saveQueueToStorage()
        
        console.log(`Successfully processed queued order: ${order.id}`)
      } catch (error) {
        console.error(`Failed to process order ${order.id}:`, error)
        
        order.status = 'failed'
        order.retryCount++
        
        // Retry up to 3 times
        if (order.retryCount < 3) {
          order.status = 'pending'
        }
        
        await this.saveQueueToStorage()
      }
    }

    this.isProcessing = false
  }

  /**
   * Process a single order from the queue
   */
  private async processOrder(queuedOrder: QueuedOrder): Promise<void> {
    const { platform, orderData } = queuedOrder

    // Create local order records
    for (const item of orderData.items || []) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            { name: item.name },
            platform === DeliveryPlatform.UBER_EATS 
              ? { externalUberEatsId: item.id }
              : { externalPickMeId: item.id }
          ]
        }
      })

      if (product) {
        await prisma.order.create({
          data: {
            productId: product.id,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
            totalPrice: orderData.total,
            paymentMethod: 'DELIVERY_PLATFORM',
            customerName: orderData.customer?.name,
            customerPhone: orderData.customer?.phone,
            orderSource: platform === DeliveryPlatform.UBER_EATS 
              ? OrderSource.UBER_EATS 
              : OrderSource.PICKME,
            deliveryOrderId: orderData.id,
            deliveryPlatform: platform,
            commission: orderData.commission || 0
          }
        })

        // Deduct stock
        await this.deductStock(product.id, item.quantity)
      }
    }

    // Trigger notification
    this.broadcastNewOrder(platform, orderData)
  }

  /**
   * Deduct stock for a product
   */
  private async deductStock(productId: number, quantity: number): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (product) {
      const newStock = Math.max(0, (product.currentStock || 0) - quantity)
      await prisma.product.update({
        where: { id: productId },
        data: { currentStock: newStock }
      })

      if (newStock === 0) {
        await this.syncStockStatus(productId, 'OUT_OF_STOCK')
      }
    }
  }

  /**
   * Sync stock status to external platforms
   */
  private async syncStockStatus(productId: number, status: string): Promise<void> {
    const storeSettings = await getStoreSettings()
    
    if (storeSettings?.uberEatsEnabled) {
      console.log(`Syncing stock status to Uber Eats: Product ${productId} -> ${status}`)
      // TODO: Call Uber Eats API
    }
    
    if (storeSettings?.pickMeEnabled) {
      console.log(`Syncing stock status to PickMe: Product ${productId} -> ${status}`)
      // TODO: Call PickMe API
    }
  }

  /**
   * Broadcast new order notification
   */
  private broadcastNewOrder(platform: DeliveryPlatform, orderData: any): void {
    console.log(`Broadcasting ${platform} order to POS clients`, orderData)
    // TODO: Implement WebSocket broadcast
  }

  /**
   * Start automatic sync interval
   */
  private startAutoSync(): void {
    // Check for internet connectivity and sync every 30 seconds
    this.syncInterval = setInterval(async () => {
      if (navigator.onLine) {
        await this.processQueue()
      }
    }, 30000)
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueueFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('deliveryOrderQueue')
      if (stored) {
        try {
          this.queue = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to load queue from storage:', error)
        }
      }
    }
  }

  /**
   * Save queue to localStorage
   */
  private async saveQueueToStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deliveryOrderQueue', JSON.stringify(this.queue))
    }
  }

  /**
   * Generate unique ID for queued orders
   */
  private generateId(): string {
    return `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { pending: number; failed: number; total: number } {
    return {
      pending: this.queue.filter(o => o.status === 'pending').length,
      failed: this.queue.filter(o => o.status === 'failed').length,
      total: this.queue.length
    }
  }
}

// Export singleton instance
export const offlineOrderQueue = new OfflineOrderQueue()
