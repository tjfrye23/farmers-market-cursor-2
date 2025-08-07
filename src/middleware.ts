import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@/generated/prisma/client'

// Define protected routes and their required roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/vendor/': [UserRole.VENDOR],
  '/admin/': [UserRole.ADMIN],
}

export async function middleware(request: NextRequest) {
  // Check if the path is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const token = await getToken({ req: request })

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check if user has required role for the route
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
      request.nextUrl.pathname.startsWith(route)
    )?.[1]

    if (requiredRoles && !requiredRoles.includes(token.role)) {
      // Redirect to unauthorized page if role doesn't match
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
