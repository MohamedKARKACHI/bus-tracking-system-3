import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional()

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

/**
 * Registration request schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: phoneSchema,
  role: z.enum(['admin', 'driver', 'client']).optional()
})

/**
 * Generic validation middleware
 */
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (handler: (request: NextRequest, data: T) => Promise<NextResponse>) => {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const body = await request.json()
        const validatedData = schema.parse(body)
        return handler(request, validatedData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              details: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  
  return sanitized
}
