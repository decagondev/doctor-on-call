/**
 * Availability Hook
 * 
 * Custom hook for managing availability slots following Interface Segregation Principle.
 * Provides focused interface for availability operations.
 */

import { useState, useEffect, useCallback } from 'react'
import { availabilityService } from '../services/availabilityService'
import type {
  AvailabilitySlot,
  AvailabilitySlotInput,
  RecurringSlotConfig,
  SlotCreationResult,
} from '../types/availability.types'

/**
 * Hook return type
 * Following Interface Segregation Principle - minimal, focused interface
 */
interface UseAvailabilityReturn {
  slots: AvailabilitySlot[]
  loading: boolean
  error: Error | null
  createSlot: (slotInput: AvailabilitySlotInput) => Promise<string>
  createRecurringSlots: (
    config: RecurringSlotConfig
  ) => Promise<SlotCreationResult>
  deleteSlot: (slotId: string) => Promise<void>
  refreshSlots: () => Promise<void>
}

/**
 * Custom hook for managing doctor availability slots
 * @param doctorId - Doctor's user ID
 * @returns Availability management interface
 */
export function useAvailability(doctorId: string | null): UseAvailabilityReturn {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Load slots from Firestore
   */
  const loadSlots = useCallback(async () => {
    if (!doctorId) {
      setSlots([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedSlots = await availabilityService.getSlots(doctorId, {
        futureOnly: true,
      })
      setSlots(fetchedSlots)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load slots')
      setError(error)
      console.error('Error loading slots:', error)
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  /**
   * Create a single slot
   */
  const createSlot = useCallback(
    async (slotInput: AvailabilitySlotInput): Promise<string> => {
      if (!doctorId) {
        throw new Error('Doctor ID is required')
      }

      try {
        setError(null)
        const slotId = await availabilityService.createSlot(doctorId, slotInput)
        await loadSlots() // Refresh slots after creation
        return slotId
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create slot')
        setError(error)
        throw error
      }
    },
    [doctorId, loadSlots]
  )

  /**
   * Create recurring slots
   */
  const createRecurringSlots = useCallback(
    async (config: RecurringSlotConfig): Promise<SlotCreationResult> => {
      if (!doctorId) {
        throw new Error('Doctor ID is required')
      }

      try {
        setError(null)
        const result = await availabilityService.createRecurringSlots(
          doctorId,
          config
        )
        await loadSlots() // Refresh slots after creation
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create recurring slots')
        setError(error)
        throw error
      }
    },
    [doctorId, loadSlots]
  )

  /**
   * Delete a slot
   */
  const deleteSlot = useCallback(
    async (slotId: string): Promise<void> => {
      if (!doctorId) {
        throw new Error('Doctor ID is required')
      }

      try {
        setError(null)
        await availabilityService.deleteSlot(doctorId, slotId)
        await loadSlots() // Refresh slots after deletion
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete slot')
        setError(error)
        throw error
      }
    },
    [doctorId, loadSlots]
  )

  // Load slots on mount and when doctorId changes
  useEffect(() => {
    loadSlots()
  }, [loadSlots])

  return {
    slots,
    loading,
    error,
    createSlot,
    createRecurringSlots,
    deleteSlot,
    refreshSlots: loadSlots,
  }
}

