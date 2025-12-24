/**
 * Appointment List Component
 * 
 * Container component for displaying list of appointments.
 * Follows Single Responsibility Principle - manages appointment list display.
 */

import { AppointmentCard } from './AppointmentCard'
import type { AppointmentWithDoctor } from '@/features/booking/types/booking.types'
import type { AppointmentWithClient } from '@/features/booking/types/booking.types'

type AppointmentListProps =
  | {
      appointments: AppointmentWithDoctor[]
      variant: 'client'
      onStatusUpdate?: (appointmentId: string, status: string) => void
    }
  | {
      appointments: AppointmentWithClient[]
      variant: 'doctor'
      onStatusUpdate?: (appointmentId: string, status: string) => void
    }

/**
 * Appointment List Component
 * Displays list of appointments
 */
export function AppointmentList(props: AppointmentListProps) {
  const { appointments, variant, onStatusUpdate } = props

  if (appointments.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No appointments found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        if (variant === 'client') {
          return (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment as AppointmentWithDoctor}
              variant="client"
              onStatusUpdate={onStatusUpdate}
            />
          )
        } else {
          return (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment as AppointmentWithClient}
              variant="doctor"
              onStatusUpdate={onStatusUpdate}
            />
          )
        }
      })}
    </div>
  )
}

