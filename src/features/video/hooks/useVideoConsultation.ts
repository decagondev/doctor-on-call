/**
 * useVideoConsultation Hook
 * 
 * Custom hook for video consultation functionality.
 * Follows Single Responsibility Principle - only handles video consultation logic.
 * Uses Interface Segregation Principle - returns minimal, focused interface.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '@/features/booking/services/bookingService'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { canJoinAppointment } from '../utils/timeValidation'
import type { Appointment } from '@/features/booking/types/booking.types'
import type { TimeValidationResult } from '../types/video.types'

/**
 * Video consultation hook return type
 */
export interface UseVideoConsultationReturn {
  appointment: Appointment | null
  loading: boolean
  error: Error | null
  timeValidation: TimeValidationResult | null
  userInfo: {
    displayName: string
    email: string
  } | null
  canJoin: boolean
}

/**
 * useVideoConsultation Hook
 * 
 * Fetches appointment data and validates join time.
 * Returns appointment, user info, and time validation result.
 * 
 * @returns UseVideoConsultationReturn with appointment data and validation
 */
export function useVideoConsultation(): UseVideoConsultationReturn {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [timeValidation, setTimeValidation] = useState<TimeValidationResult | null>(null)

  useEffect(() => {
    if (!appointmentId) {
      setError(new Error('Appointment ID is required'))
      setLoading(false)
      return
    }

    if (!user) {
      setError(new Error('User must be authenticated'))
      setLoading(false)
      return
    }

    /**
     * Fetch appointment and validate access
     */
    const fetchAppointment = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        // Get appointments for current user (client or doctor)
        const isClient = user.role === 'client'
        const appointments = isClient
          ? await bookingService.getClientAppointments(user.uid)
          : await bookingService.getDoctorAppointments(user.uid)

        // Find the specific appointment
        const foundAppointment = appointments.find((apt) => apt.id === appointmentId)

        if (!foundAppointment) {
          setError(new Error('Appointment not found or you do not have access'))
          setLoading(false)
          return
        }

        // Verify user is participant
        const isParticipant =
          foundAppointment.clientId === user.uid || foundAppointment.doctorId === user.uid

        if (!isParticipant) {
          setError(new Error('You do not have access to this appointment'))
          setLoading(false)
          return
        }

        // Verify appointment is confirmed
        if (foundAppointment.status !== 'confirmed') {
          setError(new Error('This appointment is not confirmed'))
          setLoading(false)
          return
        }

        setAppointment(foundAppointment)

        // Validate join time
        const validation = canJoinAppointment(foundAppointment.slotStart)
        setTimeValidation(validation)

        setLoading(false)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load appointment')
        setError(error)
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [appointmentId, user])

  // Get user info for Jitsi
  const userInfo = user
    ? {
        displayName: user.name || user.email || 'User',
        email: user.email || '',
      }
    : null

  // Can join if appointment exists, user is authenticated, and time validation passes
  const canJoin =
    appointment !== null &&
    userInfo !== null &&
    timeValidation !== null &&
    timeValidation.canJoin

  return {
    appointment,
    loading,
    error,
    timeValidation,
    userInfo,
    canJoin,
  }
}

