'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function createSupplier(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const company = formData.get('company') as string
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null

  await prisma.supplier.create({
    data: {
      name,
      phone,
      company,
      categoryId,
      subCategoryId
    }
  })
  revalidatePath('/suppliers')
}

export async function updateSupplier(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const company = formData.get('company') as string
  const categoryId = formData.get('categoryId') ? parseInt(formData.get('categoryId') as string) : null
  const subCategoryId = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId') as string) : null

  await prisma.supplier.update({
    where: { id },
    data: {
      name,
      phone,
      company,
      categoryId,
      subCategoryId
    }
  })
  revalidatePath('/suppliers')
}

export async function deleteSupplier(id: number) {
  try {
    await prisma.supplier.delete({
      where: { id }
    })
    revalidatePath('/suppliers')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2003') {
      return {
        success: false,
        error: 'Cannot delete supplier because it has related products. Please delete or reassign the products first.'
      }
    }
    return {
      success: false,
      error: 'Failed to delete supplier. Please try again.'
    }
  }
}

export async function getSuppliers() {
  return prisma.supplier.findMany({
    include: {
      categoryRef: {
        include: {
          subCategories: true
        }
      },
      subCategoryRef: true
    }
  })
}
