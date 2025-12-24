/**
 * Client Dashboard Component
 * 
 * Dashboard for clients to view their appointments.
 * Follows Single Responsibility Principle - only handles client appointment display.
 */

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useClientAppointments } from '@/features/booking/hooks/useBooking'
import { AppointmentList } from './AppointmentList'
import { BookingWizard } from '@/features/booking/components/BookingWizard'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Client Dashboard Component
 * Displays client's appointments and allows booking new ones
 */
export function ClientDashboard() {
  const { user } = useAuth()
  const { appointments, loading, error, updateStatus } = useClientAppointments(
    user?.uid || null
  )
  const [showBookingWizard, setShowBookingWizard] = useState(false)

  if (loading) {
    return <div className="p-4">Loading appointments...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">Error: {error.message}</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button onClick={() => setShowBookingWizard(!showBookingWizard)}>
          {showBookingWizard ? 'Cancel' : 'Book New Appointment'}
        </Button>
      </div>

      {showBookingWizard && (
        <div className="border rounded-lg p-6">
          <BookingWizard
            onComplete={() => {
              setShowBookingWizard(false)
              // Refresh appointments will happen automatically via hook
            }}
          />
        </div>
      )}

      <AppointmentList
        appointments={appointments}
        variant="client"
        onStatusUpdate={async (appointmentId, status) => {
          await updateStatus(
            appointmentId,
            status as 'pending' | 'confirmed' | 'completed' | 'cancelled'
          )
        }}
      />
    </div>
  )
}

