/**
 * Availability Validation Schemas
 * 
 * Zod schemas for availability slot validation following security best practices.
 * All user input is validated before submission.
 */

import { z } from 'zod'

/**
 * Availability slot input validation schema
 * Validates start and end times for slot creation
 */
export const availabilitySlotSchema = z
  .object({
    start: z.date({
      message: 'Start time is required and must be a valid date',
    }),
    end: z.date({
      message: 'End time is required and must be a valid date',
    }),
  })
  .refine(
    (data) => data.start < data.end,
    {
      message: 'Start time must be before end time',
      path: ['end'],
    }
  )
  .refine(
    (data) => {
      const now = new Date()
      return data.start > now
    },
    {
      message: 'Cannot create slots in the past',
      path: ['start'],
    }
  )
  .refine(
    (data) => {
      const durationMs = data.end.getTime() - data.start.getTime()
      const durationHours = durationMs / (1000 * 60 * 60)
      return durationHours > 0 && durationHours <= 4
    },
    {
      message: 'Slot duration must be between 0 and 4 hours',
      path: ['end'],
    }
  )

/**
 * Recurring slot configuration validation schema
 * Validates recurring slot parameters
 */
export const recurringSlotConfigSchema = z.object({
  startDate: z.date({
    message: 'Start date is required and must be a valid date',
  }),
  endDate: z.date({
    message: 'End date is required and must be a valid date',
  }),
  startTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Start time must be in HH:mm format (24-hour)',
    }),
  endTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'End time must be in HH:mm format (24-hour)',
    }),
  daysOfWeek: z
    .array(z.number().int().min(0).max(6))
    .min(1, 'At least one day of week must be selected')
    .max(7, 'Cannot select more than 7 days'),
  durationMinutes: z
    .number()
    .int()
    .min(15, 'Duration must be at least 15 minutes')
    .max(240, 'Duration cannot exceed 4 hours (240 minutes)'),
})
.refine(
  (data) => data.startDate <= data.endDate,
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
)
.refine(
  (data) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return data.startDate >= now
  },
  {
    message: 'Start date cannot be in the past',
    path: ['startDate'],
  }
)
.refine(
  (data) => {
    // Parse time strings to validate time range
    const [startHour, startMin] = data.startTime.split(':').map(Number)
    const [endHour, endMin] = data.endTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return endMinutes > startMinutes
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
)

/**
 * Type exports for form inputs
 */
export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>
export type RecurringSlotConfigInput = z.infer<typeof recurringSlotConfigSchema>

