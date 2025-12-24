/**
 * Availability Calendar Component
 * 
 * Calendar component for doctors to manage their availability slots.
 * Follows Single Responsibility Principle - only handles availability display and creation.
 */

import { useState } from 'react'
import { format, setHours, setMinutes, addDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAvailability } from '../hooks/useAvailability'
import type { AvailabilitySlotInput, RecurringSlotConfig } from '../types/availability.types'

interface AvailabilityCalendarProps {
  doctorId: string
}

/**
 * Availability Calendar Component
 * Displays calendar with existing slots and allows creation of new slots
 */
export function AvailabilityCalendar({ doctorId }: AvailabilityCalendarProps) {
  const { slots, loading, error, createSlot, createRecurringSlots, deleteSlot } =
    useAvailability(doctorId)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [duration, setDuration] = useState('30')
  const [isRecurringDialogOpen, setIsRecurringDialogOpen] = useState(false)
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false)

  /**
   * Apply time to a date
   */
  const applyTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number)
    return setHours(setMinutes(date, minutes), hours)
  }

  /**
   * Handle single slot creation
   */
  const handleCreateSingleSlot = async () => {
    if (!selectedDate) return

    try {
      const start = applyTime(selectedDate, startTime)
      const end = applyTime(selectedDate, endTime)

      if (start >= end) {
        alert('Start time must be before end time')
        return
      }

      await createSlot({ start, end })
      setIsSingleDialogOpen(false)
      setSelectedDate(undefined)
    } catch (error) {
      console.error('Error creating slot:', error)
      alert('Failed to create slot. Please try again.')
    }
  }

  /**
   * Handle recurring slots creation
   */
  const handleCreateRecurringSlots = async () => {
    if (!selectedDate) return

    try {
      const startDate = selectedDate
      const endDate = addDays(startDate, 30) // 30 days from start
      const daysOfWeek = [1, 2, 3, 4, 5] // Monday to Friday

      const config: RecurringSlotConfig = {
        startDate,
        endDate,
        startTime,
        endTime,
        daysOfWeek,
        durationMinutes: parseInt(duration, 10),
      }

      const result = await createRecurringSlots(config)
      alert(
        `Created ${result.successCount} slots. ${result.errorCount} failed.`
      )
      setIsRecurringDialogOpen(false)
      setSelectedDate(undefined)
    } catch (error) {
      console.error('Error creating recurring slots:', error)
      alert('Failed to create recurring slots. Please try again.')
    }
  }

  /**
   * Get slots for a specific date
   */
  const getSlotsForDate = (date: Date): typeof slots => {
    return slots.filter((slot) => {
      const slotDate = slot.start.toDate()
      return (
        slotDate.getDate() === date.getDate() &&
        slotDate.getMonth() === date.getMonth() &&
        slotDate.getFullYear() === date.getFullYear()
      )
    })
  }

  /**
   * Check if a date has slots
   */
  const hasSlots = (date: Date): boolean => {
    return getSlotsForDate(date).length > 0
  }

  /**
   * Format slot time range
   */
  const formatSlotTime = (slot: typeof slots[0]): string => {
    const start = slot.start.toDate()
    const end = slot.end.toDate()
    return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
  }

  if (loading) {
    return <div className="p-4">Loading availability...</div>
  }

  if (error) {
    return <div className="p-4 text-destructive">Error: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Availability</h2>
        <div className="flex gap-2">
          <Dialog open={isSingleDialogOpen} onOpenChange={setIsSingleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Single Slot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Availability Slot</DialogTitle>
                <DialogDescription>
                  Select a date and time for your availability
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateSingleSlot}
                  disabled={!selectedDate}
                >
                  Create Slot
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRecurringDialogOpen}
            onOpenChange={setIsRecurringDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>Add Recurring Slots</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Recurring Availability</DialogTitle>
                <DialogDescription>
                  Create slots that repeat weekly for the next 30 days
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Start Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recur-start-time">Start Time</Label>
                    <Input
                      id="recur-start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recur-end-time">End Time</Label>
                    <Input
                      id="recur-end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="duration">Slot Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="15"
                    max="120"
                    step="15"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Slots will be created Monday-Friday for 30 days from the start
                  date
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateRecurringSlots}
                  disabled={!selectedDate}
                >
                  Create Recurring Slots
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        modifiers={{
          hasSlots: (date) => hasSlots(date),
        }}
        modifiersClassNames={{
          hasSlots: 'bg-green-100 dark:bg-green-900',
        }}
        disabled={(date) => date < new Date()}
      />

      {selectedDate && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">
            Slots for {format(selectedDate, 'PPP')}
          </h3>
          {getSlotsForDate(selectedDate).length === 0 ? (
            <p className="text-muted-foreground">No slots for this date</p>
          ) : (
            <div className="space-y-2">
              {getSlotsForDate(selectedDate).map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span>
                    {formatSlotTime(slot)} {slot.booked && '(Booked)'}
                  </span>
                  {!slot.booked && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSlot(slot.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

