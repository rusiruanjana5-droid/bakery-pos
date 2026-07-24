'use server'

import prisma from '@/db'

export async function getProductAnalytics() {
  const products = await prisma.product.findMany()
  const storeSettings = await prisma.storeSettings.findFirst()
  const lowStockThreshold = storeSettings?.lowStockThreshold || 5

  // Calculate total stock valuation (Current Stock * Cost Price)
  const totalStockValuation = products.reduce((sum: number, product: any) => {
    return sum + (product.currentStock * product.costPrice)
  }, 0)

  // Calculate low stock count (products at or below the store's low stock threshold)
  const lowStockCount = products.filter((product: any) => {
    return product.currentStock <= lowStockThreshold && product.trackStock !== false
  }).length

  return {
    totalProducts: products.length,
    totalStockValuation,
    lowStockCount
  }
}

export async function getProductProfitMargin(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) return null

  const totalCost = product.costPrice + (product.packagingCost || 0)
  const profitMargin = ((product.sellingPrice - totalCost) / product.sellingPrice) * 100

  return {
    profitMargin,
    isLoss: product.sellingPrice < totalCost,
    totalCost
  }
}

export async function getProductStockStatus(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) return null

  if (!product.trackStock) return 'In-Service'

  const storeSettings = await prisma.storeSettings.findFirst()
  const lowStockThreshold = storeSettings?.lowStockThreshold || 5

  if (product.currentStock === 0) return 'Out of Stock'
  if (product.currentStock <= lowStockThreshold) return 'Low Stock'
  return 'Healthy'
}

export async function getProductBatches(productId: number) {
  const batches = await prisma.stockBatch.findMany({
    where: { productId },
    orderBy: {
      expiryDate: 'asc'
    }
  })

  return batches.map((batch: any) => ({
    id: batch.id,
    batchNumber: batch.batchNumber,
    quantity: batch.quantity,
    expiryDate: batch.expiryDate,
    grnNumber: batch.grnId ? `GRN-${batch.grnId}` : 'N/A',
    supplierName: 'N/A',
    receivedDate: batch.createdAt
  }))
}

export async function getProductRecipe(productId: number) {
  const recipe = await (prisma as any).recipeItem.findMany({
    where: { productId },
    include: {
      ingredient: true
    }
  })

  return recipe.map((item: any) => ({
    id: item.id,
    ingredientId: item.ingredientId,
    ingredientName: item.ingredient.name,
    quantity: item.quantity,
    unit: item.unit
  }))
}

export async function saveProductRecipe(productId: number, recipeItems: Array<{ ingredientId: number; quantity: number; unit: string }>) {
  // Delete existing recipe items
  await (prisma as any).recipeItem.deleteMany({
    where: { productId }
  })

  // Create new recipe items
  if (recipeItems.length > 0) {
    await (prisma as any).recipeItem.createMany({
      data: recipeItems.map(item => ({
        productId,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit
      }))
    })
  }

  return { success: true }
}
