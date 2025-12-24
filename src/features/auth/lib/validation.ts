/**
 * Authentication Validation Schemas
 * 
 * Zod schemas for form validation following security best practices.
 * All user input is validated before submission.
 */

import { z } from 'zod'

/**
 * Sign up validation schema
 * Validates email, password strength, name, and role
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(256, 'Email must be less than 256 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  role: z.enum(['client', 'doctor', 'admin'], {
    errorMap: () => ({ message: 'Invalid role selected' }),
  }),
})

/**
 * Sign in validation schema
 * Validates email and password
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(256, 'Email must be less than 256 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password must be less than 100 characters'),
})

/**
 * Type inference from schemas
 */
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>

