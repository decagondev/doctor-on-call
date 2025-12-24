/**
 * Availability Page
 * 
 * Page for doctors to manage their availability slots.
 * Protected route - only accessible to approved doctors.
 */

import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AvailabilityCalendar } from '../components/AvailabilityCalendar'
import { SEO } from '@/components/seo/SEO'

/**
 * Availability Page Component
 * Allows doctors to manage their availability slots
 */
function AvailabilityPageContent() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SEO
        title="Manage Availability | Doctor On Call"
        description="Manage your availability slots for consultations"
      />
      <AvailabilityCalendar doctorId={user.uid} />
    </div>
  )
}

/**
 * Availability Page with Route Protection
 * Only accessible to approved doctors
 */
export function AvailabilityPage() {
  return (
    <ProtectedRoute requiredRole="doctor">
      <AvailabilityPageContent />
    </ProtectedRoute>
  )
}

