/**
 * WebSocket Service for Real-time Delivery Order Notifications
 * Broadcasts new delivery orders to connected POS clients
 */

type OrderNotification = {
  type: 'NEW_ORDER' | 'ORDER_UPDATED' | 'ORDER_CANCELED'
  platform: 'UBER_EATS' | 'PICKME'
  orderId: string
  orderData: any
  timestamp: Date
}

type WebSocketClient = {
  id: string
  ws: any
  connectedAt: Date
}

class WebSocketService {
  private clients: Map<string, WebSocketClient> = new Map()

  addClient(clientId: string, ws: any): void {
    const client: WebSocketClient = {
      id: clientId,
      ws,
      connectedAt: new Date()
    }
    this.clients.set(clientId, client)
    console.log(`WebSocket client connected: ${clientId}`)
  }

  removeClient(clientId: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.ws.close()
      this.clients.delete(clientId)
      console.log(`WebSocket client disconnected: ${clientId}`)
    }
  }

  broadcast(notification: OrderNotification): void {
    const message = JSON.stringify(notification)
    
    this.clients.forEach((client, clientId) => {
      try {
        if (client.ws.readyState === 1) {
          client.ws.send(message)
        } else {
          this.removeClient(clientId)
        }
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error)
        this.removeClient(clientId)
      }
    })

    console.log(`Broadcasted notification to ${this.clients.size} clients`)
  }

  broadcastNewOrder(platform: 'UBER_EATS' | 'PICKME', orderData: any): void {
    const notification: OrderNotification = {
      type: 'NEW_ORDER',
      platform,
      orderId: orderData.id,
      orderData,
      timestamp: new Date()
    }
    this.broadcast(notification)
  }

  getClientCount(): number {
    return this.clients.size
  }
}

export const websocketService = new WebSocketService()
