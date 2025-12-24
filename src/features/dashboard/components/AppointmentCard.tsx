/**
 * Appointment Card Component
 * 
 * Presentational component for displaying appointment information.
 * Follows Single Responsibility Principle - only displays appointment data.
 */

import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { AppointmentWithDoctor } from '@/features/booking/types/booking.types'
import type { AppointmentWithClient } from '@/features/booking/types/booking.types'

type AppointmentCardProps =
  | {
      appointment: AppointmentWithDoctor
      variant: 'client'
      onStatusUpdate?: (appointmentId: string, status: string) => void
    }
  | {
      appointment: AppointmentWithClient
      variant: 'doctor'
      onStatusUpdate?: (appointmentId: string, status: string) => void
    }

/**
 * Appointment Card Component
 * Displays appointment information in a card format
 */
export function AppointmentCard(props: AppointmentCardProps) {
  const { appointment, variant, onStatusUpdate } = props
  const navigate = useNavigate()

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          {variant === 'client' && (
            <h3 className="font-semibold text-lg">
              {appointment.doctor.specialty}
            </h3>
          )}
          {variant === 'doctor' && (
            <h3 className="font-semibold text-lg">
              {appointment.clientName}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            {format(appointment.slotStart.toDate(), 'PPP p')} -{' '}
            {format(appointment.slotEnd.toDate(), 'p')}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>

      {variant === 'client' && appointment.doctor.bio && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {appointment.doctor.bio}
        </p>
      )}

      {appointment.notes && (
        <div>
          <p className="text-sm font-medium">Notes:</p>
          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
        </div>
      )}

      <div className="flex gap-2">
        {appointment.status === 'pending' && variant === 'doctor' && (
          <>
            <Button
              size="sm"
              onClick={() =>
                onStatusUpdate?.(appointment.id, 'confirmed')
              }
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                onStatusUpdate?.(appointment.id, 'cancelled')
              }
            >
              Cancel
            </Button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigate(`/consultation/${appointment.id}`)
            }}
          >
            Join Consultation
          </Button>
        )}
      </div>
    </div>
  )
}

