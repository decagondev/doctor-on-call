/**
 * Availability Service
 * 
 * Handles all availability slot operations following Single Responsibility Principle.
 * Abstracts Firebase Firestore operations for availability management.
 * Uses Dependency Inversion Principle - depends on IFirebaseService abstraction.
 */

import { firebaseService } from '@/lib/services/firebaseService'
import type { IFirebaseService } from '@/lib/services/firebaseService'
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  type Firestore,
  type QueryConstraint,
} from 'firebase/firestore'
import type {
  AvailabilitySlot,
  AvailabilitySlotInput,
  RecurringSlotConfig,
  SlotCreationResult,
} from '../types/availability.types'

/**
 * Availability Service Class
 * Single Responsibility: Handle all availability slot operations
 */
class AvailabilityService {
  private firebase: IFirebaseService

  constructor(firebase: IFirebaseService) {
    this.firebase = firebase
  }

  /**
   * Get Firestore instance
   * Private helper method
   */
  private getFirestore(): Firestore {
    return this.firebase.getFirestore()
  }

  /**
   * Get availability collection reference for a doctor
   * Subcollection: availability/{doctorId}/{slotId}
   */
  private getAvailabilityCollection(doctorId: string) {
    return collection(this.getFirestore(), 'availability', doctorId, 'slots')
  }

  /**
   * Create a single availability slot
   * @param doctorId - Doctor's user ID
   * @param slotInput - Slot start and end times
   * @returns Created slot ID
   */
  async createSlot(
    doctorId: string,
    slotInput: AvailabilitySlotInput
  ): Promise<string> {
    const firestore = this.getFirestore()
    const slotsRef = this.getAvailabilityCollection(doctorId)

    // Validate slot times
    if (slotInput.start >= slotInput.end) {
      throw new Error('Start time must be before end time')
    }

    if (slotInput.start < new Date()) {
      throw new Error('Cannot create slots in the past')
    }

    const slotData = {
      doctorId,
      start: Timestamp.fromDate(slotInput.start),
      end: Timestamp.fromDate(slotInput.end),
      booked: false,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(slotsRef, slotData)
    return docRef.id
  }

  /**
   * Create multiple availability slots (for recurring slots)
   * @param doctorId - Doctor's user ID
   * @param slots - Array of slot inputs
   * @returns Result with created slot IDs
   */
  async createSlots(
    doctorId: string,
    slots: AvailabilitySlotInput[]
  ): Promise<SlotCreationResult> {
    const firestore = this.getFirestore()
    const slotsRef = this.getAvailabilityCollection(doctorId)
    const slotIds: string[] = []
    let successCount = 0
    let errorCount = 0

    for (const slotInput of slots) {
      try {
        // Validate slot times
        if (slotInput.start >= slotInput.end) {
          errorCount++
          continue
        }

        if (slotInput.start < new Date()) {
          errorCount++
          continue
        }

        const slotData = {
          doctorId,
          start: Timestamp.fromDate(slotInput.start),
          end: Timestamp.fromDate(slotInput.end),
          booked: false,
          createdAt: Timestamp.now(),
        }

        const docRef = await addDoc(slotsRef, slotData)
        slotIds.push(docRef.id)
        successCount++
      } catch (error) {
        errorCount++
        console.error('Error creating slot:', error)
      }
    }

    return { slotIds, successCount, errorCount }
  }

  /**
   * Generate recurring slots based on configuration
   * @param doctorId - Doctor's user ID
   * @param config - Recurring slot configuration
   * @returns Result with created slot IDs
   */
  async createRecurringSlots(
    doctorId: string,
    config: RecurringSlotConfig
  ): Promise<SlotCreationResult> {
    const slots: AvailabilitySlotInput[] = []
    const currentDate = new Date(config.startDate)
    const endDate = new Date(config.endDate)

    // Parse start and end times
    const [startHour, startMinute] = config.startTime.split(':').map(Number)
    const [endHour, endMinute] = config.endTime.split(':').map(Number)

    // Generate slots for each day in the range
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      // Check if this day is in the selected days
      if (config.daysOfWeek.includes(dayOfWeek)) {
        // Generate slots for this day
        let slotStart = new Date(currentDate)
        slotStart.setHours(startHour, startMinute, 0, 0)

        const dayEnd = new Date(currentDate)
        dayEnd.setHours(endHour, endMinute, 0, 0)

        // Create slots throughout the day
        while (slotStart < dayEnd) {
          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + config.durationMinutes)

          // Don't create slots that extend past the end time
          if (slotEnd <= dayEnd) {
            slots.push({
              start: new Date(slotStart),
              end: new Date(slotEnd),
            })
          }

          // Move to next slot
          slotStart.setMinutes(slotStart.getMinutes() + config.durationMinutes)
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return this.createSlots(doctorId, slots)
  }

  /**
   * Delete an availability slot
   * @param doctorId - Doctor's user ID
   * @param slotId - Slot ID to delete
   */
  async deleteSlot(doctorId: string, slotId: string): Promise<void> {
    const firestore = this.getFirestore()
    const slotRef = doc(
      this.getFirestore(),
      'availability',
      doctorId,
      'slots',
      slotId
    )

    await deleteDoc(slotRef)
  }

  /**
   * Get all availability slots for a doctor
   * @param doctorId - Doctor's user ID
   * @param filters - Optional filters (future, past, booked, etc.)
   * @returns Array of availability slots
   */
  async getSlots(
    doctorId: string,
    filters?: {
      futureOnly?: boolean
      unbookedOnly?: boolean
    }
  ): Promise<AvailabilitySlot[]> {
    const firestore = this.getFirestore()
    const slotsRef = this.getAvailabilityCollection(doctorId)
    const constraints: QueryConstraint[] = [orderBy('start', 'asc')]

    // Apply filters
    if (filters?.unbookedOnly) {
      constraints.push(where('booked', '==', false))
    }

    const q = query(slotsRef, ...constraints)
    const snapshot = await getDocs(q)

    let slots = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AvailabilitySlot[]

    // Filter by future dates (client-side since we can't query by Timestamp comparison easily)
    if (filters?.futureOnly) {
      const now = Timestamp.now()
      slots = slots.filter((slot) => slot.start > now)
    }

    return slots
  }

  /**
   * Get available slots for a specific doctor (unbooked and future)
   * @param doctorId - Doctor's user ID
   * @returns Array of available slots
   */
  async getAvailableSlots(doctorId: string): Promise<AvailabilitySlot[]> {
    return this.getSlots(doctorId, {
      futureOnly: true,
      unbookedOnly: true,
    })
  }
}

/**
 * Singleton instance of AvailabilityService
 * Export for use in hooks and components
 */
export const availabilityService = new AvailabilityService(firebaseService)

