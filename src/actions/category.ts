'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const color = formData.get('color') as string
  const imageUrl = formData.get('imageUrl') as string
  const taxRateStr = formData.get('taxRate') as string
  const taxRate = taxRateStr ? parseFloat(taxRateStr) : 0
  const activeHoursStart = formData.get('activeHoursStart') as string
  const activeHoursEnd = formData.get('activeHoursEnd') as string
  const displayOrderStr = formData.get('displayOrder') as string
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : 0
  const parentIdStr = formData.get('parentId') as string
  const parentId = parentIdStr ? parseInt(parentIdStr) : null

  // Get max display order if not provided
  const maxOrder = displayOrder || await prisma.category.findFirst({
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true }
  }).then(cat => cat ? cat.displayOrder + 1 : 0)

  const data: any = {
    name,
    description: description || null,
    color: color || null,
    imageUrl: imageUrl || null,
    taxRate,
    activeHoursStart: activeHoursStart || null,
    activeHoursEnd: activeHoursEnd || null,
    displayOrder: maxOrder
  }

  if (parentId !== null) {
    data.parentId = parentId
  }

  await prisma.category.create({
    data
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function updateCategory(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isActive = formData.get('isActive') === 'true'
  const color = formData.get('color') as string
  const imageUrl = formData.get('imageUrl') as string
  const taxRateStr = formData.get('taxRate') as string
  const taxRate = taxRateStr ? parseFloat(taxRateStr) : null
  const activeHoursStart = formData.get('activeHoursStart') as string
  const activeHoursEnd = formData.get('activeHoursEnd') as string
  const displayOrderStr = formData.get('displayOrder') as string
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : null
  const parentIdStr = formData.get('parentId') as string
  const parentId = parentIdStr ? parseInt(parentIdStr) : null

  const data: any = {
    name,
    description: description || null,
    isActive
  }

  if (color !== undefined) data.color = color || null
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null
  if (taxRate !== null) data.taxRate = taxRate
  if (activeHoursStart !== undefined) data.activeHoursStart = activeHoursStart || null
  if (activeHoursEnd !== undefined) data.activeHoursEnd = activeHoursEnd || null
  if (displayOrder !== null) data.displayOrder = displayOrder
  if (parentId !== undefined) data.parentId = parentId

  await prisma.category.update({
    where: { id },
    data
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id }
    })
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/pos')
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: 'Cannot delete category because it has related subcategories or products. Please delete them first.'
    }
  }
}

export async function toggleCategoryStatus(id: number, isActive: boolean) {
  await prisma.category.update({
    where: { id },
    data: { isActive }
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function reorderCategories(categoryIds: number[]) {
  const updates = categoryIds.map((id, index) =>
    prisma.category.update({
      where: { id },
      data: { displayOrder: index }
    })
  )
  await prisma.$transaction(updates)
  revalidatePath('/admin/categories')
  revalidatePath('/pos')
}

export async function bulkUpdateCategories(ids: number[], action: 'enable' | 'disable' | 'delete') {
  if (action === 'delete') {
    try {
      await prisma.category.deleteMany({
        where: { id: { in: ids } }
      })
      revalidatePath('/admin/categories')
      revalidatePath('/products')
      revalidatePath('/pos')
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: 'Cannot delete some categories because they have related subcategories or products.'
      }
    }
  } else {
    await prisma.category.updateMany({
      where: { id: { in: ids } },
      data: { isActive: action === 'enable' }
    })
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/pos')
    return { success: true }
  }
}

export async function getCategoryAnalytics(categoryId: number) {
  const [productCount, totalRevenue] = await Promise.all([
    prisma.product.count({
      where: { categoryId, currentStock: { gt: 0 } }
    }),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        product: {
          categoryId
        }
      }
    })
  ])

  return {
    activeProducts: productCount,
    totalRevenue: totalRevenue._sum.totalPrice || 0
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
      parentId: null // Only top-level categories
    },
    include: {
      children: {
        where: {
          isActive: true
        },
        include: {
          children: {
            where: {
              isActive: true
            },
            include: {
              children: {
                where: {
                  isActive: true
                }
              }
            }
          }
        },
        orderBy: {
          displayOrder: 'asc'
        }
      },
      subCategories: {
        where: {
          isActive: true
        },
        orderBy: {
          displayOrder: 'asc'
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  })
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: {
      parentId: null // Only top-level categories
    },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true
            }
          }
        }
      },
      subCategories: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  })
}

export async function getCategoryTree() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' }
  })
  return categories
}

export async function createSubCategory(formData: FormData) {
  const name = formData.get('name') as string
  const categoryId = parseInt(formData.get('categoryId') as string)
  const color = formData.get('color') as string
  const imageUrl = formData.get('imageUrl') as string
  const displayOrderStr = formData.get('displayOrder') as string
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : 0

  // Get max display order for this category if not provided
  const maxOrder = displayOrder || await prisma.subCategory.findFirst({
    where: { categoryId },
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true }
  }).then(sub => sub ? sub.displayOrder + 1 : 0)

  await prisma.subCategory.create({
    data: {
      name,
      categoryId,
      color: color || null,
      imageUrl: imageUrl || null,
      displayOrder: maxOrder
    }
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function updateSubCategory(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const categoryId = parseInt(formData.get('categoryId') as string)
  const isActive = formData.get('isActive') === 'true'
  const color = formData.get('color') as string
  const imageUrl = formData.get('imageUrl') as string
  const displayOrderStr = formData.get('displayOrder') as string
  const displayOrder = displayOrderStr ? parseInt(displayOrderStr) : null

  const data: any = {
    name,
    categoryId,
    isActive
  }

  if (color !== undefined) data.color = color || null
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null
  if (displayOrder !== null) data.displayOrder = displayOrder

  await prisma.subCategory.update({
    where: { id },
    data
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function deleteSubCategory(id: number) {
  try {
    await prisma.subCategory.delete({
      where: { id }
    })
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    revalidatePath('/pos')
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: 'Cannot delete subcategory because it has related products. Please update the products first.'
    }
  }
}

export async function toggleSubCategoryStatus(id: number, isActive: boolean) {
  await prisma.subCategory.update({
    where: { id },
    data: { isActive }
  })
  revalidatePath('/admin/categories')
  revalidatePath('/products')
  revalidatePath('/pos')
}

export async function reorderSubCategories(categoryId: number, subCategoryIds: number[]) {
  const updates = subCategoryIds.map((id, index) =>
    prisma.subCategory.update({
      where: { id },
      data: { displayOrder: index }
    })
  )
  await prisma.$transaction(updates)
  revalidatePath('/admin/categories')
  revalidatePath('/pos')
}

export async function getSubCategories(categoryId: number) {
  return prisma.subCategory.findMany({
    where: {
      categoryId,
      isActive: true
    },
    orderBy: {
      displayOrder: 'asc'
    }
  })
}
