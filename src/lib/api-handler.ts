import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession, Session } from 'next-auth'
import { z } from 'zod'
import { authOptions } from './auth'

export type ApiHandler = (
  req: NextRequest,
  context: { params: Record<string, string> }
) => Promise<NextResponse>

export type AuthenticatedApiHandler = (
  req: NextRequest,
  context: {
    params: Record<string, string>
    session: Session
  }
) => Promise<NextResponse>

export type ValidationHandler<T extends z.ZodType> = (
  req: NextRequest,
  data: z.infer<T>,
  context: { params: Record<string, string> }
) => Promise<NextResponse>

export function withAuth(handler: AuthenticatedApiHandler): ApiHandler {
  return async (
    req: NextRequest,
    context: { params: Record<string, string> }
  ) => {
    try {
      const session = await getServerSession(authOptions)

      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const params = await context.params
      return handler(req, { params, session })
    } catch (error) {
      console.error('API Error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export function withValidation<T extends z.ZodType>(
  schema: T,
  handler: ValidationHandler<T>
): ApiHandler {
  return async (
    req: NextRequest,
    context: { params: Record<string, string> }
  ) => {
    try {
      const body = await req.json()
      const data = schema.parse(body)
      return handler(req, data, context)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        )
      }
      throw error
    }
  }
}

export function withRateLimit(
  handler: ApiHandler,
  options: { limit: number; windowMs: number }
): ApiHandler {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (
    req: NextRequest,
    context: { params: Record<string, string> }
  ) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - options.windowMs

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }

    // Get or create request record
    const record = requests.get(ip) || { count: 0, resetTime: now }

    if (record.count >= options.limit) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Update request count
    record.count++
    requests.set(ip, record)

    return handler(req, context)
  }
}
