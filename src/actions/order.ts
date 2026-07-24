'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'
import { printReceiptAfterOrder } from '@/app/actions/printerActions'
import { getActiveShift } from '@/actions/shift'
import { getSession } from '@/lib/session'

export async function createPOSOrder(orderData: {
  items: Array<{ productId: number; quantity: number; note?: string }>
  totalAmount: number
  paymentMethod: string
  orderType: string
  discount?: number
  discountType?: 'percentage' | 'flat'
  subtotal: number
  orderNote?: string
  extraCharges?: Array<{ label: string; amount: number }>
  cardAuthCode?: string
  cardType?: string
  qrRefNo?: string
}) {
  let createdOrder: any
  let activeShiftId: number | null = null

  // Get active shift before transaction (skip for admin users)
  try {
    const session = await getSession()
    if (session?.userId && session.role !== 'ADMIN') {
      const activeShift = await getActiveShift(session.userId)
      if (activeShift) {
        activeShiftId = activeShift.id
      }
    }
  } catch (shiftError) {
    console.error('Error getting active shift:', shiftError)
  }

  await prisma.$transaction(async (tx: any) => {
    // Check stock and deduct for each item
    for (const item of orderData.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`)
      }

      if (product.currentStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}`)
      }

      // Deduct stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          currentStock: {
            decrement: item.quantity
          }
        }
      })
    }

    // Create the order with all items
    createdOrder = await tx.order.create({
      data: {
        productId: orderData.items[0].productId, // Primary product for compatibility
        quantity: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: orderData.subtotal,
        tax: 0,
        discount: orderData.discount || 0,
        totalPrice: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        customerName: orderData.orderType,
        customerPhone: JSON.stringify({
          items: orderData.items,
          orderType: orderData.orderType,
          extraCharges: orderData.extraCharges,
          orderNote: orderData.orderNote
        }),
        cardAuthCode: orderData.cardAuthCode,
        cardType: orderData.cardType,
        qrRefNo: orderData.qrRefNo,
        shiftId: activeShiftId
      },
      include: {
        product: true
      }
    })
  })

  // Trigger receipt printing with cash drawer logic
  // This is done after the transaction commits
  try {
    await printReceiptAfterOrder(orderData, {
      id: createdOrder.id.toString(),
      createdAt: createdOrder.createdAt
    })
  } catch (printError) {
    // Log print error but don't fail the order
    console.error('Print service error:', printError)
  }

  revalidatePath('/orders')
  revalidatePath('/products')
  revalidatePath('/pos')
  revalidatePath('/')
  return { success: true, order: createdOrder }
}

export async function createOrder(formData: FormData) {
  const productId = parseInt(formData.get('productId') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const subtotal = parseFloat(formData.get('subtotal') as string || '0')
  const tax = parseFloat(formData.get('tax') as string || '0')
  const discount = parseFloat(formData.get('discount') as string || '0')
  // Enforce formula: Total = (Subtotal + Tax) - Discount
  const totalPrice = (subtotal + tax) - discount
  const paymentMethod = formData.get('paymentMethod') as string
  const customerName = formData.get('customerName') as string || null
  const customerPhone = formData.get('customerPhone') as string || null

  let createdOrder: any

  await prisma.$transaction(async (tx: any) => {
    const product = await tx.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.currentStock < quantity) {
      throw new Error('Insufficient stock')
    }

    createdOrder = await tx.order.create({
      data: {
        productId,
        quantity,
        subtotal,
        tax,
        discount,
        totalPrice,
        paymentMethod,
        customerName,
        customerPhone
      },
      include: {
        product: true
      }
    })

    await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: {
          decrement: quantity
        }
      }
    })
  })
  revalidatePath('/orders')
  revalidatePath('/products')
  revalidatePath('/pos')
  revalidatePath('/')
  return { success: true, order: createdOrder }
}

export async function updateOrder(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const productId = parseInt(formData.get('productId') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const subtotal = parseFloat(formData.get('subtotal') as string || '0')
  const tax = parseFloat(formData.get('tax') as string || '0')
  const discount = parseFloat(formData.get('discount') as string || '0')
  // Enforce formula: Total = (Subtotal + Tax) - Discount
  const totalPrice = (subtotal + tax) - discount
  const paymentMethod = formData.get('paymentMethod') as string
  const customerName = formData.get('customerName') as string || null
  const customerPhone = formData.get('customerPhone') as string || null

  const existingOrder = await prisma.order.findUnique({
    where: { id }
  })

  await prisma.$transaction(async (tx: any) => {
    // Restore the old quantity to stock first
    if (existingOrder) {
      await tx.product.update({
        where: { id: existingOrder.productId },
        data: {
          currentStock: {
            increment: existingOrder.quantity
          }
        }
      })
    }

    // Check if new product has enough stock
    const product = await tx.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.currentStock < quantity) {
      throw new Error('Insufficient stock')
    }

    // Update the order
    await tx.order.update({
      where: { id },
      data: {
        productId,
        quantity,
        subtotal,
        tax,
        discount,
        totalPrice,
        paymentMethod,
        customerName,
        customerPhone
      }
    })

    // Deduct new quantity from stock
    await tx.product.update({
      where: { id: productId },
      data: {
        currentStock: {
          decrement: quantity
        }
      }
    })
  })
  revalidatePath('/orders')
  revalidatePath('/products')
  revalidatePath('/pos')
  revalidatePath('/')
}

export async function deleteOrder(id: number) {
  try {
    console.log('Attempting to delete order with ID:', id)
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    
    if (!existingOrder) {
      return { success: false, error: 'Order not found' }
    }
    console.log('Existing order found:', existingOrder)

    await prisma.$transaction(async (tx: any) => {
      // Restore the stock first
      await tx.product.update({
        where: { id: existingOrder.productId },
        data: {
          currentStock: {
            increment: existingOrder.quantity
          }
        }
      })
      
      // Then delete the order
      await tx.order.delete({
        where: { id }
      })
    })
    revalidatePath('/orders')
    revalidatePath('/products')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting order:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return {
      success: false,
      error: `Failed to delete order: ${error.message || 'Please try again.'}`
    }
  }
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      product: true
    },
    orderBy: {
      id: 'desc'
    }
  })
}

export async function getTodayOrders() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    include: {
      product: true
    },
    orderBy: {
      id: 'desc'
    }
  })
}

export async function getSalesAnalytics(
  filter: '7days' | 'thisMonth' | 'thisYear' | 'custom' = '7days',
  startDateStr?: string,
  endDateStr?: string
) {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let chartData: Array<{ name: string; sales: number }> = []
  let totalSales = 0
  let startDate: Date
  let endDate: Date = new Date()

  // Calculate date range based on filter
  switch (filter) {
    case '7days':
      startDate = new Date(startOfDay)
      startDate.setDate(startDate.getDate() - 6)
      // Get daily sales for each day
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay
            }
          }
        })
        const total = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        chartData.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          sales: total
        })
      }
      break
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      // Get daily sales for each day of month so far
      const daysInMonthSoFar = now.getDate()
      for (let i = 1; i <= daysInMonthSoFar; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i)
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay
            }
          }
        })
        const total = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        chartData.push({
          name: i.toString(),
          sales: total
        })
      }
      break
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1)
      // Get monthly sales for each month of year so far
      const currentMonth = now.getMonth()
      for (let i = 0; i <= currentMonth; i++) {
        const monthStart = new Date(now.getFullYear(), i, 1)
        const monthEnd = new Date(now.getFullYear(), i + 1, 1)
        const orders = await prisma.order.findMany({
          where: {
            createdAt: {
              gte: monthStart,
              lt: monthEnd
            }
          }
        })
        const total = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        chartData.push({
          name: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          sales: total
        })
      }
      break
    case 'custom':
      if (startDateStr && endDateStr) {
        startDate = new Date(startDateStr)
        endDate = new Date(endDateStr)
        // Calculate days between start and end date
        const daysBetween = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        for (let i = 0; i <= daysBetween; i++) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          if (date > endDate) break
          const nextDay = new Date(date)
          nextDay.setDate(nextDay.getDate() + 1)
          const orders = await prisma.order.findMany({
            where: {
              createdAt: {
                gte: date,
                lt: nextDay
              }
            }
          })
          const total = orders.reduce((sum, order) => sum + order.totalPrice, 0)
          chartData.push({
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: total
          })
        }
      }
      break
  }

  // Calculate total sales for the period for summary cards
  const calculatePeriodTotal = async (start: Date, end: Date) => {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      }
    })
    return orders.reduce((sum, order) => sum + order.totalPrice, 0)
  }

  // Get summary data (always calculate all 4 timeframes)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1))
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const today = await calculatePeriodTotal(startOfToday, new Date())
  const week = await calculatePeriodTotal(startOfWeek, new Date())
  const month = await calculatePeriodTotal(startOfMonth, new Date())
  const year = await calculatePeriodTotal(startOfYear, new Date())

  return {
    today,
    week,
    month,
    year,
    chartData
  }
}

export async function getCustomerInsights() {
  // Get all orders with customer info
  const orders = await prisma.order.findMany({
    where: {
      customerPhone: {
        not: null
      }
    }
  })

  // Aggregate by customerPhone
  const customerMap = new Map<string, { 
    phone: string; 
    name?: string; 
    orderCount: number; 
    totalSpent: number; 
    lastOrderDate: Date; 
  }>()

  orders.forEach(order => {
    const phone = order.customerPhone!
    const existing = customerMap.get(phone)

    if (existing) {
      existing.orderCount++
      existing.totalSpent += order.totalPrice
      if (order.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = order.createdAt
      }
      if (order.customerName && !existing.name) {
        existing.name = order.customerName
      }
    } else {
      customerMap.set(phone, {
        phone,
        name: order.customerName || undefined,
        orderCount: 1,
        totalSpent: order.totalPrice,
        lastOrderDate: order.createdAt
      })
    }
  })

  // Convert to array
  const customers = Array.from(customerMap.values())

  // Sort by order count descending for top customers
  const topCustomers = [...customers]
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5)

  // Get customers who haven't ordered in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const inactiveCustomers = customers
    .filter(c => c.lastOrderDate < thirtyDaysAgo)
    .sort((a, b) => a.lastOrderDate.getTime() - b.lastOrderDate.getTime())
    .slice(0, 10)

  return {
    topCustomers,
    inactiveCustomers
  }
}
