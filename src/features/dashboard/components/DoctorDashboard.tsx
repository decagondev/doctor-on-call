/**
 * Doctor Dashboard Component
 * 
 * Dashboard for doctors to view their appointments.
 * Follows Single Responsibility Principle - only handles doctor appointment display.
 */

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDoctorAppointments } from '@/features/booking/hooks/useBooking'
import { AppointmentList } from './AppointmentList'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

/**
 * Doctor Dashboard Component
 * Displays doctor's appointments
 */
export function DoctorDashboard() {
  const { user } = useAuth()
  const { appointments, loading, error, updateStatus } = useDoctorAppointments(
    user?.uid || null
  )
  const navigate = useNavigate()

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
        <Button onClick={() => navigate('/availability')}>
          Manage Availability
        </Button>
      </div>

      <AppointmentList
        appointments={appointments}
        variant="doctor"
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

