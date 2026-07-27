// Removed Prisma import - now using API routes for database operations

// Helper function to construct absolute URLs for fetch calls
const getAbsoluteUrl = (path: string): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL (browser handles base URL)
    return path
  }
  
  // Server-side: construct absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  return `${baseUrl}${path}`
}

export interface SyncStatus {
  isOnline: boolean
  isDbConnected: boolean
  lastSyncAt: Date | null
  pendingCount: number
  failedCount: number
  syncStatus: 'IDLE' | 'SYNCING' | 'ERROR'
}

interface SyncQueueItem {
  id: string
  operation: string
  tableName: string
  recordId: string | null
  payload: any
  status: 'PENDING' | 'SYNCED' | 'FAILED'
  attempts: number
  lastError?: string
  createdAt: string
}

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null
  private isOnline: boolean = true
  private isDbConnected: boolean = false
  private listeners: Set<(status: SyncStatus) => void> = new Set()
  private isSyncing: boolean = false
  private readonly STORAGE_KEY = 'sync_queue'

  constructor() {
    this.initializeNetworkMonitoring()
  }

  private initializeNetworkMonitoring() {
    // Initial check
    this.checkConnectivity()

    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.checkConnectivity()
        this.notifyListeners()
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
        this.isDbConnected = false
        this.notifyListeners()
      })
    }

    // Periodic connectivity check (every 30 seconds)
    this.syncInterval = setInterval(() => {
      this.checkConnectivity()
    }, 30000)
  }

  private async checkConnectivity() {
    // First check browser's online status
    const browserOnline = typeof window !== 'undefined' ? navigator.onLine : true
    
    if (!browserOnline) {
      this.isOnline = false
      this.isDbConnected = false
      this.notifyListeners()
      return
    }

    // Browser says we're online, verify with actual network ping
    try {
      // Try to fetch a lightweight endpoint (Cloudflare or similar)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      await fetch('https://cloudflare.com/cdn-cgi/trace', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache'
      })
      
      clearTimeout(timeoutId)
      this.isOnline = true
    } catch (error) {
      // Network ping failed, but browser says online - might be restricted network
      this.isOnline = false
      this.isDbConnected = false
      this.notifyListeners()
      return
    }

    // Internet is available, now check cloud database connectivity
    try {
      const response = await fetch(getAbsoluteUrl('/api/sync/connectivity'), {
        method: 'GET',
        cache: 'no-cache'
      })
      const result = await response.json()
      this.isDbConnected = result.connected
      
      // If we just came online with DB access, trigger sync
      if (this.isOnline && this.isDbConnected) {
        this.syncPendingData()
      }
    } catch (error) {
      // Internet available but DB not reachable
      this.isDbConnected = false
      console.warn('Cloud database not reachable:', error)
    }
    
    this.notifyListeners()
  }

  public onStatusChange(callback: (status: SyncStatus) => void) {
    this.listeners.add(callback)
    // Immediately call with current status
    callback(this.getCurrentStatus())
  }

  public offStatusChange(callback: (status: SyncStatus) => void) {
    this.listeners.delete(callback)
  }

  private notifyListeners() {
    const status = this.getCurrentStatus()
    this.listeners.forEach(callback => callback(status))
  }

  private getQueue(): SyncQueueItem[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      return []
    }
  }

  private saveQueue(queue: SyncQueueItem[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  public getCurrentStatus(): SyncStatus {
    const queue = this.getQueue()
    const pendingCount = queue.filter(item => item.status === 'PENDING').length
    const failedCount = queue.filter(item => item.status === 'FAILED').length
    
    return {
      isOnline: this.isOnline,
      isDbConnected: this.isDbConnected,
      lastSyncAt: null,
      pendingCount,
      failedCount,
      syncStatus: this.isSyncing ? 'SYNCING' : (this.isOnline ? 'IDLE' : 'ERROR')
    }
  }

  public async syncPendingData() {
    if (!this.isOnline || this.isSyncing) return
    if (!this.isDbConnected) return

    this.isSyncing = true
    this.notifyListeners()

    try {
      const queue = this.getQueue()
      const pendingItems = queue.filter(item => item.status === 'PENDING')
      
      if (pendingItems.length === 0) {
        this.isSyncing = false
        this.notifyListeners()
        return
      }

      // Process each pending item
      for (const item of pendingItems) {
        try {
          await this.processQueueItem(item)
          
          // Mark as synced
          const updatedQueue = this.getQueue()
          const itemIndex = updatedQueue.findIndex(i => i.id === item.id)
          if (itemIndex !== -1) {
            updatedQueue[itemIndex].status = 'SYNCED'
            this.saveQueue(updatedQueue)
          }
        } catch (error) {
          // Mark as failed with retry limit
          const updatedQueue = this.getQueue()
          const itemIndex = updatedQueue.findIndex(i => i.id === item.id)
          if (itemIndex !== -1) {
            updatedQueue[itemIndex].status = 'FAILED'
            updatedQueue[itemIndex].attempts += 1
            updatedQueue[itemIndex].lastError = error instanceof Error ? error.message : 'Unknown error'
            
            // Remove if too many failed attempts
           if (updatedQueue[itemIndex].attempts >= 3) {
              updatedQueue.splice(itemIndex, 1)
            }
            this.saveQueue(updatedQueue)
          }
        }
      }

      // Clean up synced items
      const finalQueue = this.getQueue().filter(item => item.status !== 'SYNCED')
      this.saveQueue(finalQueue)

    } catch (error) {
      // Silent error handling - don't spam console
    } finally {
      this.isSyncing = false
      this.notifyListeners()
    }
  }

  private async processQueueItem(item: SyncQueueItem): Promise<void> {
    const payload = JSON.parse(item.payload)
    
    switch (item.tableName) {
      case 'Order':
        await this.syncOrder(item.operation, payload)
        break
      case 'Product':
        await this.syncProduct(item.operation, payload)
        break
      case 'GRN':
        await this.syncGRN(item.operation, payload)
        break
      default:
        console.warn(`Unknown table type in sync queue: ${item.tableName}`)
    }
  }

  private async syncOrder(operation: string, payload: any): Promise<void> {
    // Implement order sync logic based on operation (CREATE, UPDATE, DELETE)
    const response = await fetch(getAbsoluteUrl('/api/sync/order'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, payload })
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync order')
    }
  }

  private async syncProduct(operation: string, payload: any): Promise<void> {
    // Implement product sync logic
    const response = await fetch(getAbsoluteUrl('/api/sync/product'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, payload })
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync product')
    }
  }

  private async syncGRN(operation: string, payload: any): Promise<void> {
    // Implement GRN sync logic
    const response = await fetch(getAbsoluteUrl('/api/sync/grn'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, payload })
    })
    
    if (!response.ok) {
      throw new Error('Failed to sync GRN')
    }
  }

  public async queueOperation(operation: string, tableName: string, recordId: string | null, payload: any) {
    if (typeof window === 'undefined') return

    try {
      const queue = this.getQueue()
      const newItem: SyncQueueItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation,
        tableName,
        recordId,
        payload: JSON.stringify(payload),
        status: 'PENDING',
        attempts: 0,
        createdAt: new Date().toISOString()
      }
      
      queue.push(newItem)
      this.saveQueue(queue)
      
      // If online, try to sync immediately
      if (this.isOnline && this.isDbConnected) {
        this.syncPendingData()
      }
      
      this.notifyListeners()
    } catch (error) {
      console.error('Failed to queue operation:', error)
    }
  }

  public destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    this.listeners.clear()
  }
}

// Singleton instance
let syncServiceInstance: SyncService | null = null

export const getSyncService = () => {
  if (!syncServiceInstance) {
    syncServiceInstance = new SyncService()
  }
  return syncServiceInstance
}
