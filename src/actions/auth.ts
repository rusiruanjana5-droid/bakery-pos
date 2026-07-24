'use server'

import prisma, { localPrisma } from '@/db'
import bcrypt from 'bcrypt'
import { setSession, destroySession, SessionData, sessionOptions } from '@/lib/session'
import { redirect } from 'next/navigation'
import { startShift } from './shift'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  let user
  try {
    // Try primary database first
    user = await prisma.user.findUnique({
      where: { username }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for login:', error)
    try {
      // Fallback to local SQLite database
      user = await (localPrisma as any).localUser.findUnique({
        where: { username }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      redirect('/login?error=database')
    }
  }

  if (!user) {
    redirect('/login?error=invalid')
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    redirect('/login?error=invalid')
  }

  // Set session directly in server action
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.userId = user.id
  session.username = user.username
  session.role = user.role as 'ADMIN' | 'CASHIER' | 'MANAGER' | 'KITCHEN'
  session.isLoggedIn = true
  await session.save()

  // Clear any cached shift data in session storage (client-side will handle this)
  // Redirect cashiers to shift check page (shift will be started via modal)
  if (user.role === 'CASHIER') {
    redirect('/pos?checkShift=true&forceRefresh=true')
  } else {
    redirect('/')
  }
}

export async function logout() {
  await destroySession()
  redirect('/login')
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'ADMIN' | 'CASHIER'

  let existingUser
  try {
    existingUser = await prisma.user.findUnique({
      where: { username }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for registration check:', error)
    try {
      existingUser = await (localPrisma as any).localUser.findUnique({
        where: { username }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      return { success: false, error: 'Database unreachable' }
    }
  }

  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role
      }
    })
  } catch (error) {
    console.warn('Primary database unreachable, creating user in local database:', error)
    try {
      await (localPrisma as any).localUser.create({
        data: {
          username,
          password: hashedPassword,
          role,
          status: 'ACTIVE'
        }
      })
    } catch (localError) {
      console.error('Failed to create user in local database:', localError)
      return { success: false, error: 'Failed to create user' }
    }
  }

  return { success: true }
}

export async function verifyPin(pin: string) {
  let user
  try {
    user = await prisma.user.findFirst({
      where: {
        pinCode: pin,
        status: 'ACTIVE'
      }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for PIN verification:', error)
    try {
      user = await (localPrisma as any).localUser.findFirst({
        where: {
          pinCode: pin,
          status: 'ACTIVE'
        }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      return { success: false, error: 'Database unreachable' }
    }
  }

  if (!user) {
    return { success: false, error: 'Invalid PIN' }
  }

  return { success: true, user: { id: user.id, username: user.username, role: user.role, canUnlockScreen: user.canUnlockScreen } }
}

export async function verifyPinForScreenUnlock(pin: string) {
  let user
  try {
    user = await prisma.user.findFirst({
      where: {
        pinCode: pin,
        status: 'ACTIVE'
      }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for PIN verification:', error)
    try {
      user = await (localPrisma as any).localUser.findFirst({
        where: {
          pinCode: pin,
          status: 'ACTIVE'
        }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      return { success: false, error: 'Database unreachable' }
    }
  }

  if (!user) {
    return { success: false, error: 'Invalid PIN' }
  }

  // Check if user has permission to unlock screen (Admin always has permission)
  if (user.role !== 'ADMIN' && !user.canUnlockScreen) {
    return { success: false, error: 'Unauthorized: Only users with Lock Screen access can unlock this session.' }
  }

  return { success: true, user: { id: user.id, username: user.username, role: user.role, canUnlockScreen: user.canUnlockScreen } }
}

export async function verifyManagerPin(pin: string) {
  let user
  try {
    user = await prisma.user.findFirst({
      where: {
        pinCode: pin,
        role: { in: ['ADMIN', 'MANAGER'] },
        status: 'ACTIVE'
      }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for manager PIN verification:', error)
    try {
      user = await (localPrisma as any).localUser.findFirst({
        where: {
          pinCode: pin,
          role: { in: ['ADMIN', 'MANAGER'] },
          status: 'ACTIVE'
        }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      return { success: false, error: 'Database unreachable' }
    }
  }

  if (!user) {
    return { success: false, error: 'Invalid Manager PIN' }
  }

  return { success: true, verifiedBy: user.username, role: user.role }
}

export async function switchUserByPin(pin: string) {
  let user
  try {
    user = await prisma.user.findFirst({
      where: {
        pinCode: pin,
        status: 'ACTIVE'
      }
    })
  } catch (error) {
    console.warn('Primary database unreachable, trying local database for user switch:', error)
    try {
      user = await (localPrisma as any).localUser.findFirst({
        where: {
          pinCode: pin,
          status: 'ACTIVE'
        }
      })
    } catch (localError) {
      console.error('Both primary and local databases unreachable:', localError)
      return { success: false, error: 'Database unreachable' }
    }
  }

  if (!user) {
    return { success: false, error: 'Invalid PIN' }
  }

  // Set session directly in server action
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.userId = user.id
  session.username = user.username
  session.role = user.role as 'ADMIN' | 'CASHIER' | 'MANAGER' | 'KITCHEN'
  session.isLoggedIn = true
  await session.save()

  // Start shift if switching to cashier
  if (user.role === 'CASHIER') {
    await startShift(user.id)
  }

  return { success: true, user: { id: user.id, username: user.username, role: user.role } }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)

  if (!session.isLoggedIn) {
    return null
  }

  return {
    userId: session.userId,
    username: session.username,
    role: session.role
  }
}
