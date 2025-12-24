/**
 * Doctors List Component
 * 
 * Container component for displaying and filtering doctors.
 * Follows Single Responsibility Principle - manages doctor list display.
 */

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DoctorCard } from './DoctorCard'
import { useDoctorDiscovery } from '../hooks/useBooking'
import type { DoctorPublicProfile } from '@/features/profile/types/profile.types'

interface DoctorsListProps {
  onDoctorSelect?: (doctor: DoctorPublicProfile) => void
}

/**
 * Doctors List Component
 * Displays list of approved doctors with search and filter functionality
 */
export function DoctorsList({ onDoctorSelect }: DoctorsListProps = {}) {
  const { doctors, loading, error, searchDoctors } = useDoctorDiscovery()
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('')

  // Load doctors on mount
  useEffect(() => {
    searchDoctors()
  }, [searchDoctors])

  // Get unique specialties for filter
  const specialties = Array.from(
    new Set(doctors.map((doctor) => doctor.specialty))
  ).sort()

  // Handle search
  const handleSearch = () => {
    searchDoctors({
      name: searchTerm || undefined,
      specialty: specialtyFilter || undefined,
    })
  }

  // Handle doctor selection
  const handleDoctorSelect = (doctor: DoctorPublicProfile) => {
    if (onDoctorSelect) {
      onDoctorSelect(doctor)
    } else {
      // Default behavior if no handler provided
      console.log('Selected doctor:', doctor)
    }
  }

  if (loading) {
    return <div className="p-4">Loading doctors...</div>
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">Error: {error.message}</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Specialties</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {doctors.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No doctors found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.uid}
              doctor={doctor}
              onSelect={handleDoctorSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

