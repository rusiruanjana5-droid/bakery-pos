'use server'

import prisma from '@/db'

export async function getTopSuppliers(startDate?: Date, endDate?: Date) {
  const where: any = {}
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    }
  }

  const grns = await prisma.gRN.findMany({
    where,
    include: {
      supplier: true
    }
  })

  const supplierStats: any = {}
  
  grns.forEach((grn: any) => {
    const supplierId = grn.supplierId
    const supplierName = grn.supplier.name
    const totalAmount = grn.quantity * grn.unitCost + (grn.landedCost || 0)
    const totalQuantity = grn.quantity + (grn.freeQuantity || 0)

    if (!supplierStats[supplierId]) {
      supplierStats[supplierId] = {
        supplierId,
        supplierName,
        totalPurchaseValue: 0,
        totalQuantity: 0,
        grnCount: 0
      }
    }

    supplierStats[supplierId].totalPurchaseValue += totalAmount
    supplierStats[supplierId].totalQuantity += totalQuantity
    supplierStats[supplierId].grnCount += 1
  })

  return Object.values(supplierStats).sort((a: any, b: any) => b.totalPurchaseValue - a.totalPurchaseValue)
}

export async function getPurchaseVsSalesRatio(startDate?: Date, endDate?: Date) {
  const where: any = {}
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    }
  }

  // Get total purchase cost from GRNs
  const grns = await prisma.gRN.findMany({ where })
  const totalPurchaseCost = grns.reduce((sum: number, grn: any) => {
    return sum + (grn.quantity * grn.unitCost + (grn.landedCost || 0))
  }, 0)

  // Get total sales revenue from Orders
  const orders = await prisma.order.findMany({ where })
  const totalSalesRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)

  return {
    totalPurchaseCost,
    totalSalesRevenue,
    ratio: totalSalesRevenue > 0 ? (totalPurchaseCost / totalSalesRevenue) * 100 : 0
  }
}

export async function getProductPriceTrends(productId: number, startDate?: Date, endDate?: Date) {
  const where: any = { productId }
  if (startDate && endDate) {
    where.receivedDate = {
      gte: startDate,
      lte: endDate
    }
  }

  const costHistory = await (prisma as any).productCostHistory.findMany({
    where,
    orderBy: { receivedDate: 'asc' }
  })

  return costHistory.map((entry: any) => ({
    date: entry.receivedDate,
    unitCost: entry.unitCost,
    trueUnitCost: entry.trueUnitCost,
    variancePercentage: entry.variancePercentage
  }))
}

export async function getCreditAgingReport() {
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const sixtyDaysFromNow = new Date()
  sixtyDaysFromNow.setDate(today.getDate() + 60)

  const ledgerEntries = await (prisma as any).supplierLedger.findMany({
    where: {
      isPaid: false,
      dueDate: { not: null }
    },
    include: {
      supplier: true
    }
  })

  const agingBuckets: any = {
    current: [], // 0-30 days
    thirtyToSixty: [], // 31-60 days
    overSixty: [], // 60+ days
    overdue: [] // Past due date
  }

  ledgerEntries.forEach((entry: any) => {
    if (!entry.dueDate) return

    const daysUntilDue = Math.ceil((entry.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const daysOverdue = Math.ceil((today.getTime() - entry.dueDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysOverdue > 0) {
      agingBuckets.overdue.push({
        supplier: entry.supplier.name,
        amount: entry.debit,
        dueDate: entry.dueDate,
        daysOverdue
      })
    } else if (daysUntilDue <= 30) {
      agingBuckets.current.push({
        supplier: entry.supplier.name,
        amount: entry.debit,
        dueDate: entry.dueDate
      })
    } else if (daysUntilDue <= 60) {
      agingBuckets.thirtyToSixty.push({
        supplier: entry.supplier.name,
        amount: entry.debit,
        dueDate: entry.dueDate
      })
    } else {
      agingBuckets.overSixty.push({
        supplier: entry.supplier.name,
        amount: entry.debit,
        dueDate: entry.dueDate
      })
    }
  })

  return agingBuckets
}

export async function getExpiringBatches(daysThreshold: number = 30) {
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

export async function getProductPriceVariance(productId: number, threshold: number = 10) {
  const latestCost = await (prisma as any).productCostHistory.findFirst({
    where: { productId },
    orderBy: { receivedDate: 'desc' }
  })

  if (!latestCost || !latestCost.variancePercentage) {
    return null
  }

  const absVariance = Math.abs(latestCost.variancePercentage)
  const isSignificant = absVariance >= threshold

  return {
    productId,
    unitCost: latestCost.unitCost,
    trueUnitCost: latestCost.trueUnitCost,
    variancePercentage: latestCost.variancePercentage,
    isSignificant,
    previousCost: latestCost.unitCost / (1 + latestCost.variancePercentage / 100),
    receivedDate: latestCost.receivedDate
  }
}

export async function getGRNAnalytics(startDate?: Date, endDate?: Date) {
  const where: any = {}
  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate
    }
  }

  const grns = await prisma.gRN.findMany({
    where,
    include: {
      supplier: true,
      product: true
    }
  })

  const totalGRNs = grns.length
  const totalValue = grns.reduce((sum: number, grn: any) => sum + (grn.quantity * grn.unitCost + (grn.landedCost || 0)), 0)
  const totalQuantity = grns.reduce((sum: number, grn: any) => sum + grn.quantity, 0)
  const totalFreeQuantity = grns.reduce((sum: number, grn: any) => sum + (grn.freeQuantity || 0), 0)
  const totalRejectedQty = grns.reduce((sum: number, grn: any) => sum + (grn.rejectedQty || 0), 0)
  const totalLandedCost = grns.reduce((sum: number, grn: any) => sum + (grn.landedCost || 0), 0)

  const qcStatusCounts: any = {}
  grns.forEach((grn: any) => {
    const status = grn.qcStatus || 'Unknown'
    qcStatusCounts[status] = (qcStatusCounts[status] || 0) + 1
  })

  return {
    totalGRNs,
    totalValue,
    totalQuantity,
    totalFreeQuantity,
    totalRejectedQty,
    totalLandedCost,
    qcStatusCounts,
    rejectionRate: totalGRNs > 0 ? (totalRejectedQty / totalQuantity) * 100 : 0
  }
}
