'use server'

import prisma, { getLocalPrisma } from '@/db'
import bcrypt from 'bcryptjs'
import { setSession, destroySession, SessionData, sessionOptions } from '@/lib/session'
import { redirect } from 'next/navigation'
import { startShift } from './shift'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sendShiftStartNotification } from '@/lib/notificationService'
import { getStoreSettings } from './store'

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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      redirect('/login?error=database')
    }
    try {
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

  // Send cashier login notification asynchronously (non-blocking)
  if (user.role === 'CASHIER') {
    sendLoginNotificationAsync(user.id, user.username).catch(
      (error: Error) => console.error('Login notification error (non-blocking):', error)
    )
  }

  // Redirect cashiers to shift check page (shift will be started via modal)
  if (user.role === 'CASHIER') {
    redirect('/pos?checkShift=true&forceRefresh=true')
  }

  redirect('/')
}

// Helper function to send login notification asynchronously
async function sendLoginNotificationAsync(userId: number, cashierUsername: string) {
  try {
    const storeSettings = await getStoreSettings()

    if (!storeSettings || !storeSettings.enableLoginAlerts) {
      return
    }

    await sendShiftStartNotification(
      {
        cashierName: cashierUsername,
        cashierUsername,
        shiftId: 0, // Login notification, not tied to a specific shift yet
        openingBalance: 0,
        previousClosingBalance: undefined,
        notes: 'Cashier logged in',
        timestamp: new Date(),
        storeName: storeSettings.shopName || 'Bakery POS',
      },
      storeSettings
    )
  } catch (error) {
    console.error('Async login notification error:', error)
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
    try {
      await (localPrisma as any).localUser.create({
        data: {
          cloudId: 0,
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
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

export async function switchUserByPin(pin: string, currentUserId?: number, currentShiftId?: number) {
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
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.error('Local database client not initialized')
      return { success: false, error: 'Database unreachable' }
    }
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

  if (currentUserId && currentShiftId && user.role === 'CASHIER') {
    try {
      const pauseResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/shift/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, shiftId: currentShiftId })
      })

      if (pauseResponse.ok) {
        console.log('Current shift paused successfully for mid-shift handover')
      } else {
        console.warn('Failed to pause current shift:', await pauseResponse.text())
      }
    } catch (error) {
      console.error('Error pausing current shift:', error)
    }
  }

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.userId = user.id
  session.username = user.username
  session.role = user.role as 'ADMIN' | 'CASHIER' | 'MANAGER' | 'KITCHEN'
  session.isLoggedIn = true
  await session.save()

  if (user.role === 'CASHIER') {
    try {
      const resumeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/shift/resume-or-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, openingBalance: 0, notes: '' })
      })

      if (resumeResponse.ok) {
        const result = await resumeResponse.json()
        console.log('Shift action completed:', result.action, result.message)
        return { success: true, user, shiftAction: result.action, shift: result.shift }
      }

      console.error('Failed to resume/start shift:', await resumeResponse.text())
      return { success: true, user, shiftAction: 'FAILED' }
    } catch (error) {
      console.error('Error in resume/start shift:', error)
      const shiftResult = await startShift(user.id)
      return { success: true, user, shiftAction: 'STARTED', shift: shiftResult.shift }
    }
  }

  return { success: true, user }
}
