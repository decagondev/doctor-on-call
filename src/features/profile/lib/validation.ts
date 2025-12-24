/**
 * Profile Validation Schemas
 * 
 * Zod schemas for profile form validation following security best practices.
 * All schemas validate input types, sizes, and required fields.
 */

import { z } from 'zod'

/**
 * Client profile update schema
 * Validates name and optional photo URL
 */
export const clientProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  photoURL: z.string().url('Invalid photo URL').optional().or(z.literal('')),
})

/**
 * Doctor profile update schema
 * Validates all doctor-specific fields
 */
export const doctorProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  photoURL: z.string().url('Invalid photo URL').optional().or(z.literal('')),
  specialty: z
    .string()
    .min(1, 'Specialty is required')
    .max(100, 'Specialty must be less than 100 characters'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(1000, 'Bio must be less than 1000 characters'),
  qualifications: z
    .array(z.string().min(1).max(200)),
})

/**
 * Photo file validation schema
 * Validates file type and size
 */
export const photoFileSchema = z
  .instanceof(File, { message: 'Invalid file' })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  })
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    {
      message: 'File must be a JPEG, PNG, or WebP image',
    }
  )

/**
 * Type exports for form inputs
 */
export type ClientProfileInput = z.infer<typeof clientProfileSchema>
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>

