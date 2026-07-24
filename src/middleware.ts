import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  // Add pathname to headers for layout to detect POS page
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  // Allow access to login page
  if (pathname === '/login') {
    if (session.isLoggedIn) {
      // Redirect logged-in users to appropriate page
      if (session.role === 'CASHIER') {
        const redirectResponse = NextResponse.redirect(new URL('/pos', request.url))
        redirectResponse.headers.set('x-pathname', pathname)
        return redirectResponse
      }
      const redirectResponse = NextResponse.redirect(new URL('/', request.url))
      redirectResponse.headers.set('x-pathname', pathname)
      return redirectResponse
    }
    response.headers.set('x-pathname', pathname)
    return response
  }

  // Protect all other routes
  if (!session.isLoggedIn) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
    redirectResponse.headers.set('x-pathname', pathname)
    return redirectResponse
  }

  // Cashier role: allow access to /orders and /pos
  if (session.role === 'CASHIER') {
    if (pathname !== '/orders' && pathname !== '/pos') {
      const redirectResponse = NextResponse.redirect(new URL('/pos', request.url))
      redirectResponse.headers.set('x-pathname', pathname)
      return redirectResponse
    }
    response.headers.set('x-pathname', pathname)
    return response
  }

  // Admin role: allow full access to everything
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
