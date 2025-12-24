/**
 * Profile Page
 * 
 * Page component for profile editing following Single Responsibility Principle.
 * Displays appropriate form based on user role.
 */

import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { ClientProfileForm } from '../components/ClientProfileForm'
import { DoctorProfileForm } from '../components/DoctorProfileForm'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/button'

/**
 * Profile Content Component
 * Renders profile form based on user role
 */
function ProfileContent(): React.JSX.Element {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSuccess = (): void => {
    // Optionally show success message or redirect
    navigate('/dashboard')
  }

  return (
    <>
      <SEO
        title="Edit Profile - Doctor On Call"
        description="Edit your profile information on Doctor On Call."
        keywords="profile, edit profile, doctor on call"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="mt-2 text-muted-foreground">
                Update your profile information
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {user?.role === 'doctor' ? (
              <DoctorProfileForm onSuccess={handleSuccess} />
            ) : (
              <ClientProfileForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Profile Page Component
 * Wrapped with ProtectedRoute to ensure authentication
 */
export function ProfilePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

