/**
 * Admin Page
 * 
 * Page component for admin dashboard following Single Responsibility Principle.
 * Displays user management interface.
 */

import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { UserTable } from '../components/UserTable'
import { SEO } from '@/components/seo/SEO'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

/**
 * Admin Content Component
 * Renders admin dashboard
 */
function AdminContent(): React.JSX.Element {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Verify admin role (should also be checked in ProtectedRoute)
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to access this page.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Admin Dashboard - Doctor On Call"
        description="Manage users and platform settings on Doctor On Call."
        keywords="admin, dashboard, user management, doctor on call"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Manage users and platform settings
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Pending Doctor Approvals</h2>
              <UserTable showPendingOnly={true} />
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">All Users</h2>
              <UserTable showPendingOnly={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Admin Page Component
 * Wrapped with ProtectedRoute to ensure authentication and admin role
 */
export function AdminPage(): React.JSX.Element {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  )
}

