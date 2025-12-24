/**
 * Booking Hook
 * 
 * Custom hook for managing bookings following Interface Segregation Principle.
 * Provides focused interface for booking operations.
 */

import { useState, useEffect, useCallback } from 'react'
import { bookingService } from '../services/bookingService'
import type {
  Appointment,
  AppointmentWithDoctor,
  AppointmentWithClient,
  BookingInput,
  DoctorSearchFilters,
  DoctorPublicProfile,
} from '../types/booking.types'

/**
 * Hook return type for booking operations
 */
interface UseBookingReturn {
  bookAppointment: (
    clientId: string,
    bookingInput: BookingInput
  ) => Promise<Appointment>
  loading: boolean
  error: Error | null
}

/**
 * Hook return type for doctor discovery
 */
interface UseDoctorDiscoveryReturn {
  doctors: DoctorPublicProfile[]
  loading: boolean
  error: Error | null
  searchDoctors: (filters?: DoctorSearchFilters) => Promise<void>
}

/**
 * Hook return type for appointments
 */
interface UseAppointmentsReturn {
  appointments: AppointmentWithDoctor[] | AppointmentWithClient[]
  loading: boolean
  error: Error | null
  refreshAppointments: () => Promise<void>
  updateStatus: (appointmentId: string, status: Appointment['status']) => Promise<void>
}

/**
 * Custom hook for booking appointments
 * @returns Booking operations interface
 */
export function useBooking(): UseBookingReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const bookAppointment = useCallback(
    async (clientId: string, bookingInput: BookingInput): Promise<Appointment> => {
      try {
        setLoading(true)
        setError(null)
        const appointment = await bookingService.bookAppointment(
          clientId,
          bookingInput
        )
        return appointment
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to book appointment')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    bookAppointment,
    loading,
    error,
  }
}

/**
 * Custom hook for doctor discovery
 * @returns Doctor discovery interface
 */
export function useDoctorDiscovery(): UseDoctorDiscoveryReturn {
  const [doctors, setDoctors] = useState<DoctorPublicProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const searchDoctors = useCallback(
    async (filters?: DoctorSearchFilters): Promise<void> => {
      try {
        setLoading(true)
        setError(null)
        const foundDoctors = await bookingService.getDoctors(filters)
        setDoctors(foundDoctors)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to search doctors')
        setError(error)
        console.error('Error searching doctors:', error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    doctors,
    loading,
    error,
    searchDoctors,
  }
}

/**
 * Custom hook for client appointments
 * @param clientId - Client's user ID
 * @returns Client appointments interface
 */
export function useClientAppointments(
  clientId: string | null
): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadAppointments = useCallback(async () => {
    if (!clientId) {
      setAppointments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedAppointments =
        await bookingService.getClientAppointments(clientId)
      setAppointments(fetchedAppointments)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load appointments')
      setError(error)
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [clientId])

  const updateStatus = useCallback(
    async (appointmentId: string, status: Appointment['status']): Promise<void> => {
      try {
        setError(null)
        await bookingService.updateAppointmentStatus(appointmentId, status)
        await loadAppointments() // Refresh after update
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update appointment')
        setError(error)
        throw error
      }
    },
    [loadAppointments]
  )

  // Load appointments on mount
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  return {
    appointments,
    loading,
    error,
    refreshAppointments: loadAppointments,
    updateStatus,
  }
}

/**
 * Custom hook for doctor appointments
 * @param doctorId - Doctor's user ID
 * @returns Doctor appointments interface
 */
export function useDoctorAppointments(
  doctorId: string | null
): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadAppointments = useCallback(async () => {
    if (!doctorId) {
      setAppointments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const fetchedAppointments =
        await bookingService.getDoctorAppointments(doctorId)
      setAppointments(fetchedAppointments)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load appointments')
      setError(error)
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  const updateStatus = useCallback(
    async (appointmentId: string, status: Appointment['status']): Promise<void> => {
      try {
        setError(null)
        await bookingService.updateAppointmentStatus(appointmentId, status)
        await loadAppointments() // Refresh after update
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update appointment')
        setError(error)
        throw error
      }
    },
    [loadAppointments]
  )

  // Load appointments on mount
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  return {
    appointments,
    loading,
    error,
    refreshAppointments: loadAppointments,
    updateStatus,
  }
}

