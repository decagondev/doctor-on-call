/**
 * Booking Validation Schemas
 * 
 * Zod schemas for booking appointment validation following security best practices.
 * All user input is validated before submission.
 */

import { z } from 'zod'

/**
 * Booking input validation schema
 * Validates doctor selection and slot booking
 */
export const bookingInputSchema = z.object({
  doctorId: z
    .string()
    .min(1, 'Doctor selection is required')
    .max(128, 'Invalid doctor ID'),
  slotId: z
    .string()
    .min(1, 'Time slot selection is required')
    .max(128, 'Invalid slot ID'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
})

/**
 * Type export for form input
 */
export type BookingInputFormData = z.infer<typeof bookingInputSchema>

