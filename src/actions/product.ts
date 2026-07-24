'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null
  const costPrice = parseFloat(formData.get('costPrice') as string)
  const sellingPrice = parseFloat(formData.get('sellingPrice') as string)
  const rawSupplierId = formData.get('supplierId') as string
  const supplierId = rawSupplierId && !isNaN(Number(rawSupplierId)) ? Number(rawSupplierId) : null
  const imageUrl = formData.get('imageUrl') as string | null

  const data: any = {
    name,
    category,
    categoryId,
    subCategoryId,
    costPrice,
    sellingPrice,
    currentStock: 0,
    imageUrl: imageUrl || null
  }
  
  if (supplierId !== null) {
    data.supplierId = supplierId
  }

  await prisma.product.create({
    data
  })
  revalidatePath('/products')
  revalidatePath('/')
}

export async function updateProduct(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null
  const costPrice = parseFloat(formData.get('costPrice') as string)
  const sellingPrice = parseFloat(formData.get('sellingPrice') as string)
  const rawSupplierId = formData.get('supplierId') as string
  const supplierId = rawSupplierId && !isNaN(Number(rawSupplierId)) ? Number(rawSupplierId) : null
  const imageUrl = formData.get('imageUrl') as string | null

  const data: any = {
    name,
    category,
    categoryId,
    subCategoryId,
    costPrice,
    sellingPrice,
    imageUrl: imageUrl || null
  }
  
  if (supplierId !== null) {
    data.supplierId = supplierId
  }

  await prisma.product.update({
    where: { id },
    data
  })
  revalidatePath('/products')
  revalidatePath('/')
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/products')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2003') {
      return {
        success: false,
        error: 'Cannot delete product because it has related GRNs or orders. Please delete the related records first.'
      }
    }
    return {
      success: false,
      error: 'Failed to delete product. Please try again.'
    }
  }
}

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      supplier: true,
      categoryRef: {
        include: {
          subCategories: true
        }
      },
      subCategoryRef: true
    }
  })
}
