import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: number
  username: string
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN'
  isLoggedIn: boolean
}

export const sessionOptions = {
  cookieName: 'bakery-pos-session',
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    return session
  } catch (error) {
    // Return default empty session if cookies() is called outside request scope
    return {
      userId: 0,
      username: '',
      role: 'CASHIER' as const,
      isLoggedIn: false
    }
  }
}

export async function setSession(data: SessionData) {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    session.userId = data.userId
    session.username = data.username
    session.role = data.role
    session.isLoggedIn = data.isLoggedIn
    await session.save()
  } catch (error) {
    console.error('Error setting session:', error)
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    session.destroy()
  } catch (error) {
    console.error('Error destroying session:', error)
  }
}
