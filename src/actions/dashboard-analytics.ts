'use server'

import prisma from '@/db'

export async function getDashboardAnalytics(startDate?: Date, endDate?: Date) {
  const where: any = {}
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    }
  }

  const orders = await prisma.order.findMany({ where })
  const products = await prisma.product.findMany()
  const grns = await prisma.gRN.findMany({ where })

  // Calculate Total Revenue
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)

  // Calculate Cost of Goods Sold (COGS)
  let totalCOGS = 0
  for (const order of orders) {
    const product = products.find((p: any) => p.id === order.productId)
    if (product) {
      totalCOGS += product.costPrice * order.quantity
    }
  }

  // Calculate delivery platform commissions
  // @ts-ignore - commission field needs Prisma regeneration
  const totalDeliveryCommissions = orders.reduce((sum: number, order: any) => sum + (order.commission || 0), 0)

  // Calculate Gross Profit (revenue - COGS - delivery commissions)
  const grossProfit = totalRevenue - totalCOGS - totalDeliveryCommissions

  // Calculate Daily Wastage/Loss (from expired/damaged stock)
  // This assumes we have a way to track wastage - for now using rejectedQty from GRNs
  const totalWastage = grns.reduce((sum: number, grn: any) => {
    const product = products.find((p: any) => p.id === grn.productId)
    if (product && grn.rejectedQty) {
      return sum + (product.costPrice * grn.rejectedQty)
    }
    return sum
  }, 0)

  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    totalWastage,
    totalOrders: orders.length
  }
}

export async function getExpiringBatches(daysThreshold: number = 3) {
  const today = new Date()
  const thresholdDate = new Date()
  thresholdDate.setDate(today.getDate() + daysThreshold)

  const expiringBatches = await (prisma as any).stockBatch.findMany({
    where: {
      expiryDate: {
        lte: thresholdDate
      },
      currentQuantity: {
        gt: 0
      }
    },
    include: {
      product: true
    },
    orderBy: { expiryDate: 'asc' }
  })

  return expiringBatches.map((batch: any) => ({
    productName: batch.product.name,
    batchNumber: batch.batchNumber,
    quantity: batch.currentQuantity,
    uom: batch.uom,
    expiryDate: batch.expiryDate,
    daysUntilExpiry: Math.ceil((batch.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }))
}

export async function getUpcomingSupplierPayments(daysFrom: number = 3, daysTo: number = 7) {
  const today = new Date()
  const fromDate = new Date()
  fromDate.setDate(today.getDate() + daysFrom)
  
  const toDate = new Date()
  toDate.setDate(today.getDate() + daysTo)

  const ledgerEntries = await (prisma as any).supplierLedger.findMany({
    where: {
      isPaid: false,
      dueDate: {
        gte: fromDate,
        lte: toDate
      }
    },
    include: {
      supplier: true
    },
    orderBy: { dueDate: 'asc' }
  })

  return ledgerEntries.map((entry: any) => ({
    supplierName: entry.supplier.name,
    amount: entry.debit,
    dueDate: entry.dueDate,
    daysUntilDue: Math.ceil((entry.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }))
}

export async function getTopSellingProducts(startDate?: Date, endDate?: Date, limit: number = 5) {
  const where: any = {}
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    }
  }

  const orders = await prisma.order.findMany({ where })
  const products = await prisma.product.findMany()

  const productSales: any = {}
  
  orders.forEach((order: any) => {
    const productId = order.productId
    if (!productSales[productId]) {
      const product = products.find((p: any) => p.id === productId)
      productSales[productId] = {
        productId,
        productName: product?.name || 'Unknown',
        totalQuantity: 0,
        totalRevenue: 0
      }
    }
    productSales[productId].totalQuantity += order.quantity
    productSales[productId].totalRevenue += order.totalPrice
  })

  return Object.values(productSales)
    .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit)
}

export async function getKitchenWorkload() {
  // Since Order model doesn't have status field, we'll get recent orders
  // In a real system, you'd have a status field or separate order tracking
  const recentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Last 2 hours
      }
    },
    include: {
      product: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const workload: any = {}
  
  recentOrders.forEach((order: any) => {
    const productName = order.product.name
    if (!workload[productName]) {
      workload[productName] = {
        productName,
        totalQuantity: 0,
        orderIds: []
      }
    }
    workload[productName].totalQuantity += order.quantity
    workload[productName].orderIds.push(order.id)
  })

  return Object.values(workload).sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
}

export async function getCashDrawerSummary() {
  // This is a placeholder - in a real system, you'd have a CashDrawer model
  // For now, we'll return mock data
  return {
    shiftStatus: 'Active',
    cashInDrawer: 0,
    shiftStartTime: new Date(),
    totalCashSales: 0,
    totalCardSales: 0
  }
}

export async function getSalesComparison(currentPeriodStart: Date, currentPeriodEnd: Date, previousPeriodStart: Date, previousPeriodEnd: Date) {
  const currentOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: currentPeriodStart,
        lte: currentPeriodEnd
      }
    }
  })

  const previousOrders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd
      }
    }
  })

  const currentRevenue = currentOrders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)
  const previousRevenue = previousOrders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)

  const currentOrderCount = currentOrders.length
  const previousOrderCount = previousOrders.length

  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
  const orderCountGrowth = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0

  return {
    currentRevenue,
    previousRevenue,
    currentOrderCount,
    previousOrderCount,
    revenueGrowth,
    orderCountGrowth
  }
}
