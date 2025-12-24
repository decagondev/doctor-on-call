/**
 * Booking Types
 * 
 * Type definitions for booking feature following TypeScript strict mode.
 * Follows Single Responsibility Principle - only booking-related types.
 */

import type { Timestamp } from 'firebase/firestore'
import type { DoctorPublicProfile } from '@/features/profile/types/profile.types'

// Re-export for convenience
export type { DoctorPublicProfile }

/**
 * Appointment status
 */
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'

/**
 * Appointment stored in Firestore
 * Collection: appointments/{appointmentId}
 */
export interface Appointment {
  id: string
  clientId: string
  doctorId: string
  slotStart: Timestamp
  slotEnd: Timestamp
  status: AppointmentStatus
  roomName: string
  notes?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

/**
 * Appointment with doctor profile data
 * Used for displaying appointments with doctor information
 */
export interface AppointmentWithDoctor extends Appointment {
  doctor: DoctorPublicProfile
}

/**
 * Appointment with client data (for doctors)
 */
export interface AppointmentWithClient extends Appointment {
  clientName: string
  clientEmail: string
}

/**
 * Doctor with availability information
 * Used for doctor discovery
 */
export interface DoctorWithAvailability extends DoctorPublicProfile {
  hasAvailableSlots: boolean
  nextAvailableSlot?: Timestamp
}

/**
 * Booking input for creating appointments
 */
export interface BookingInput {
  doctorId: string
  slotId: string
  notes?: string
}

/**
 * Doctor search filters
 */
export interface DoctorSearchFilters {
  specialty?: string
  name?: string
  hasAvailability?: boolean
}

