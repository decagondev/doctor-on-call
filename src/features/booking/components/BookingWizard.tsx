/**
 * Booking Wizard Component
 * 
 * Multi-step wizard for booking appointments.
 * Follows Single Responsibility Principle - only handles booking flow.
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DoctorsList } from './DoctorsList'
import { useBooking } from '../hooks/useBooking'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { availabilityService } from '@/features/availability/services/availabilityService'
import type { DoctorPublicProfile } from '@/features/profile/types/profile.types'
import type { AvailabilitySlot } from '@/features/availability/types/availability.types'
import type { BookingInput } from '../types/booking.types'

/**
 * DoctorsList wrapper that handles selection
 */
function DoctorsListWithSelection({
  onDoctorSelect,
}: {
  onDoctorSelect: (doctor: DoctorPublicProfile) => void
}) {
  return <DoctorsList onDoctorSelect={onDoctorSelect} />
}

type WizardStep = 'select-doctor' | 'select-slot' | 'confirm'

interface BookingWizardProps {
  onComplete?: () => void
}

/**
 * Booking Wizard Component
 * Guides user through booking process: select doctor → select slot → confirm
 */
export function BookingWizard({ onComplete }: BookingWizardProps) {
  const { user } = useAuth()
  const { bookAppointment, loading, error } = useBooking()
  const [step, setStep] = useState<WizardStep>('select-doctor')
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorPublicProfile | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  )
  const [notes, setNotes] = useState('')

  // Load available slots when doctor is selected
  const handleDoctorSelect = async (doctor: DoctorPublicProfile) => {
    setSelectedDoctor(doctor)
    try {
      const slots = await availabilityService.getAvailableSlots(doctor.uid)
      setAvailableSlots(slots)
      setStep('select-slot')
    } catch (error) {
      console.error('Error loading slots:', error)
      alert('Failed to load available slots')
    }
  }

  // Handle slot selection
  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot)
    setStep('confirm')
  }

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!user || !selectedDoctor || !selectedSlot) return

    try {
      const bookingInput: BookingInput = {
        doctorId: selectedDoctor.uid,
        slotId: selectedSlot.id,
        notes: notes || undefined,
      }

      await bookAppointment(user.uid, bookingInput)
      alert('Appointment booked successfully!')
      onComplete?.()
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to book appointment. Please try again.'
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'select-doctor'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          1
        </div>
        <div className="w-16 h-1 bg-secondary" />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'select-slot'
              ? 'bg-primary text-primary-foreground'
              : step === 'confirm'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          2
        </div>
        <div className="w-16 h-1 bg-secondary" />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'confirm'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          3
        </div>
      </div>

      {/* Step content */}
      {step === 'select-doctor' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select a Doctor</h2>
          <DoctorsListWithSelection onDoctorSelect={handleDoctorSelect} />
        </div>
      )}

      {step === 'select-slot' && selectedDoctor && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Select a Time Slot</h2>
            <Button variant="outline" onClick={() => setStep('select-doctor')}>
              Back
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">
            Doctor: {selectedDoctor.specialty}
          </p>
          {availableSlots.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No available slots for this doctor
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                  onClick={() => handleSlotSelect(slot)}
                  className="justify-start"
                >
                  {format(slot.start.toDate(), 'PPP p')} -{' '}
                  {format(slot.end.toDate(), 'p')}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'confirm' && selectedDoctor && selectedSlot && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Confirm Booking</h2>
            <Button variant="outline" onClick={() => setStep('select-slot')}>
              Back
            </Button>
          </div>
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <h3 className="font-semibold">Doctor</h3>
              <p>{selectedDoctor.specialty}</p>
            </div>
            <div>
              <h3 className="font-semibold">Date & Time</h3>
              <p>
                {format(selectedSlot.start.toDate(), 'PPP p')} -{' '}
                {format(selectedSlot.end.toDate(), 'p')}
              </p>
            </div>
            <div>
              <label className="font-semibold block mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Add any notes for the doctor..."
              />
            </div>
            {error && (
              <div className="text-destructive text-sm">{error.message}</div>
            )}
            <Button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

