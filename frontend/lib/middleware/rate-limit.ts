import { NextRequest, NextResponse } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  windowMs?: number // Time window in milliseconds
  max?: number // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string
  skipSuccessfulRequests?: boolean
}

const defaultOptions: Required<Omit<RateLimitOptions, 'keyGenerator'>> = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  skipSuccessfulRequests: false
}

/**
 * Rate limiting middleware
 * Tracks requests by IP address and limits excessive requests
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const opts = { ...defaultOptions, ...options }

  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest): Promise<NextResponse> => {
      // Generate key (default: IP address)
      const key = options.keyGenerator
        ? options.keyGenerator(request)
        : request.ip || request.headers.get('x-forwarded-for') || 'unknown'

      const now = Date.now()
      const record = store[key]

      // Initialize or reset if window expired
      if (!record || record.resetTime < now) {
        store[key] = {
          count: 1,
          resetTime: now + opts.windowMs
        }
        return handler(request)
      }

      // Increment counter
      record.count++

      // Check if limit exceeded
      if (record.count > opts.max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000)
        
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            retryAfter
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': opts.max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
            }
          }
        )
      }

      // Execute handler
      const response = await handler(request)

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', opts.max.toString())
      response.headers.set('X-RateLimit-Remaining', (opts.max - record.count).toString())
      response.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString())

      return response
    }
  }
}

/**
 * Stricter rate limit for login attempts
 */
export function loginRateLimit() {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5'), // 5 attempts
    keyGenerator: (request: NextRequest) => {
      // Rate limit by IP + email for login attempts
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      return `login:${ip}`
    }
  })
}
