/**
 * Availability Types
 * 
 * Type definitions for availability feature following TypeScript strict mode.
 * Follows Single Responsibility Principle - only availability-related types.
 */

import type { Timestamp } from 'firebase/firestore'

/**
 * Availability slot stored in Firestore
 * Subcollection: availability/{doctorId}/{slotId}
 */
export interface AvailabilitySlot {
  id: string
  doctorId: string
  start: Timestamp
  end: Timestamp
  booked: boolean
  createdAt?: Timestamp
}

/**
 * Availability slot input for creating new slots
 */
export interface AvailabilitySlotInput {
  start: Date
  end: Date
}

/**
 * Recurring slot configuration
 */
export interface RecurringSlotConfig {
  startDate: Date
  endDate: Date
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
  durationMinutes: number // Duration of each slot
}

/**
 * Slot creation result
 */
export interface SlotCreationResult {
  slotIds: string[]
  successCount: number
  errorCount: number
}

