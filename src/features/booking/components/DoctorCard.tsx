/**
 * Doctor Card Component
 * 
 * Presentational component for displaying doctor information.
 * Follows Single Responsibility Principle - only displays doctor data.
 */

import type { DoctorPublicProfile } from '@/features/profile/types/profile.types'

interface DoctorCardProps {
  doctor: DoctorPublicProfile
  onSelect?: (doctor: DoctorPublicProfile) => void
}

/**
 * Doctor Card Component
 * Displays doctor information in a card format
 */
export function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(doctor)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(doctor)
        }
      }}
      aria-label={`View ${doctor.specialty} doctor profile`}
    >
      <div className="flex gap-4">
        {doctor.photoURL && (
          <img
            src={doctor.photoURL}
            alt={doctor.specialty}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{doctor.specialty}</h3>
          {doctor.rating && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm">{doctor.rating.toFixed(1)}</span>
            </div>
          )}
          {doctor.bio && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {doctor.bio}
            </p>
          )}
          {doctor.qualifications && doctor.qualifications.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {doctor.qualifications.slice(0, 3).map((qual, index) => (
                <span
                  key={index}
                  className="text-xs bg-secondary px-2 py-1 rounded"
                >
                  {qual}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

