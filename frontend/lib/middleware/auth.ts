import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

/**
 * Middleware to verify JWT token from Authorization header
 * Returns 401 if token is missing or invalid
 */
export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const user = verifyToken(token)

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Attach user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return handler(authenticatedRequest)
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

/**
 * Middleware to check if user has required role(s)
 * Must be used after requireAuth
 */
export function requireRole(...allowedRoles: Array<'admin' | 'driver' | 'client'>) {
  return (handler: (request: AuthenticatedRequest) => Promise<NextResponse>) => {
    return async (request: AuthenticatedRequest): Promise<NextResponse> => {
      const user = request.user

      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(request)
    }
  }
}

/**
 * Combine auth and role checking in one middleware
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: { roles?: Array<'admin' | 'driver' | 'client'> }
) {
  if (options?.roles) {
    return requireAuth(requireRole(...options.roles)(handler))
  }
  return requireAuth(handler)
}
