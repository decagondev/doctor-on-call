/**
 * Time Validation Utilities
 * 
 * Utilities for validating appointment join times.
 * Follows Single Responsibility Principle - only handles time validation logic.
 */

import type { Timestamp } from 'firebase/firestore'
import type { TimeValidationResult } from '../types/video.types'

/**
 * Time window for joining consultation (in milliseconds)
 * Users can join ±5 minutes from appointment start time
 */
const JOIN_TIME_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Check if user can join appointment based on time
 * 
 * Pseudocode:
 * 1. Get current time
 * 2. Get appointment start time
 * 3. Calculate time difference
 * 4. Check if within ±5 minutes window
 * 5. Return validation result
 * 
 * @param slotStart - Appointment start time (Firestore Timestamp)
 * @returns TimeValidationResult with canJoin flag and reason
 */
export function canJoinAppointment(slotStart: Timestamp): TimeValidationResult {
  const now = new Date()
  const startTime = slotStart.toDate()
  const timeUntilStart = startTime.getTime() - now.getTime()
  const timeDifference = Math.abs(timeUntilStart)

  // Check if within time window
  if (timeDifference <= JOIN_TIME_WINDOW_MS) {
    return {
      canJoin: true,
      timeUntilStart,
    }
  }

  // Before time window
  if (timeUntilStart > JOIN_TIME_WINDOW_MS) {
    const minutesUntilStart = Math.ceil(timeUntilStart / (60 * 1000))
    return {
      canJoin: false,
      reason: `Consultation starts in ${minutesUntilStart} minutes. Please wait.`,
      timeUntilStart,
    }
  }

  // After time window (appointment has passed)
  return {
    canJoin: false,
    reason: 'This consultation has already ended.',
    timeUntilStart,
  }
}

/**
 * Format time until start for display
 * @param timeUntilStart - Time in milliseconds
 * @returns Formatted string (e.g., "5 minutes", "1 hour")
 */
export function formatTimeUntilStart(timeUntilStart: number): string {
  const minutes = Math.ceil(timeUntilStart / (60 * 1000))
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
}

