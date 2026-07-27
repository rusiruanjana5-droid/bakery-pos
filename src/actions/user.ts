'use server'

import prisma from '@/db'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      pinCode: true,
      canUnlockScreen: true,
      lastLoginAt: true,
      createdAt: true,
      password: false
    },
    orderBy: {
      id: 'asc'
    }
  })
}

export async function createUser(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN'
  const pinCode = formData.get('pinCode') as string | null
  const canUnlockScreen = formData.get('canUnlockScreen') === 'true'

  const existingUser = await prisma.user.findUnique({
    where: { username }
  })

  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Admin users get canUnlockScreen by default
  const defaultCanUnlockScreen = role === 'ADMIN' ? true : canUnlockScreen

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
      status: 'ACTIVE',
      pinCode: pinCode || null,
      canUnlockScreen: defaultCanUnlockScreen
    }
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id }
  })
  revalidatePath('/admin/users')
  return { success: true }
}

export async function resetUserPassword(userId: number, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword
    }
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUser(id: number, data: {
  username?: string
  role?: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN'
  status?: 'ACTIVE' | 'INACTIVE'
  pinCode?: string | null
  canUnlockScreen?: boolean
}) {
  const updateData: any = {}
  
  if (data.username) updateData.username = data.username
  if (data.role) {
    updateData.role = data.role
    // If role is being changed to ADMIN, grant unlock permission
    if (data.role === 'ADMIN' && data.canUnlockScreen === undefined) {
      updateData.canUnlockScreen = true
    }
  }
  if (data.status) updateData.status = data.status
  if (data.pinCode !== undefined) updateData.pinCode = data.pinCode || null
  if (data.canUnlockScreen !== undefined) updateData.canUnlockScreen = data.canUnlockScreen

  await prisma.user.update({
    where: { id },
    data: updateData
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateLastLogin(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date()
    }
  })
  return { success: true }
}
