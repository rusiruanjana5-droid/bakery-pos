// @ts-ignore - Prisma client needs regeneration after schema update
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/db'
import { getStoreSettings } from '@/actions/store'
// @ts-ignore - Prisma client needs regeneration after schema update
import { OrderSource, DeliveryPlatform } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Verify webhook signature (TODO: Implement signature verification)
    // const signature = request.headers.get('x-uber-eats-signature')
    
    // Get store settings to verify integration is enabled
    const storeSettings = await getStoreSettings()
    if (!storeSettings?.uberEatsEnabled) {
      return NextResponse.json(
        { success: false, error: 'Uber Eats integration not enabled' },
        { status: 403 }
      )
    }

    // Handle different webhook events
    switch (event) {
      case 'order.created':
        await handleOrderCreated(data, storeSettings)
        break
      case 'order.updated':
        await handleOrderUpdated(data, storeSettings)
        break
      case 'order.canceled':
        await handleOrderCanceled(data, storeSettings)
        break
      default:
        console.log(`Unhandled Uber Eats event: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Uber Eats webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleOrderCreated(orderData: any, storeSettings: any) {
  // Map Uber Eats order to local order format
  // TODO: Implement actual order mapping based on Uber Eats API schema
  
  // For each item in the order, create a local order record
  for (const item of orderData.items || []) {
    // Find product by external ID or name
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { name: item.name },
          { externalUberEatsId: item.id }
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
          orderSource: OrderSource.UBER_EATS,
          deliveryOrderId: orderData.id,
          deliveryPlatform: DeliveryPlatform.UBER_EATS,
          commission: orderData.commission || 0
        }
      })

      // Deduct stock
      await deductStock(product.id, item.quantity)
    }
  }

  // Trigger real-time notification via WebSocket
  // TODO: Implement WebSocket broadcast
  broadcastNewOrder('UBER_EATS', orderData)
}

async function handleOrderUpdated(orderData: any, storeSettings: any) {
  // Handle order updates (e.g., status changes)
  console.log('Uber Eats order updated:', orderData.id)
}

async function handleOrderCanceled(orderData: any, storeSettings: any) {
  // Restore stock for canceled orders
  const orders = await prisma.order.findMany({
    where: { deliveryOrderId: orderData.id }
  })

  for (const order of orders) {
    await restoreStock(order.productId, order.quantity)
  }
}

async function deductStock(productId: number, quantity: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (product) {
    const newStock = Math.max(0, (product.currentStock || 0) - quantity)
    await prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock }
    })

    // If stock hits 0, sync to external platforms
    if (newStock === 0) {
      await syncStockStatus(productId, 'OUT_OF_STOCK')
    }
  }
}

async function restoreStock(productId: number, quantity: number) {
  await prisma.product.update({
    where: { id: productId },
    data: {
      currentStock: {
        increment: quantity
      }
    }
  })
}

async function syncStockStatus(productId: number, status: string) {
  // Sync stock status to Uber Eats and PickMe
  const storeSettings = await getStoreSettings()
  
  if (storeSettings?.uberEatsEnabled) {
    // TODO: Call Uber Eats API to set item as unavailable
    console.log(`Syncing stock status to Uber Eats: Product ${productId} -> ${status}`)
  }
  
  if (storeSettings?.pickMeEnabled) {
    // TODO: Call PickMe API to set item as unavailable
    console.log(`Syncing stock status to PickMe: Product ${productId} -> ${status}`)
  }
}

function broadcastNewOrder(source: string, orderData: any) {
  // TODO: Implement WebSocket broadcast to POS clients
  console.log(`Broadcasting new ${source} order to POS clients`, orderData)
}
