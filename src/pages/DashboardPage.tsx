/**
 * Dashboard Page
 * 
 * Protected page that displays user-specific dashboard content.
 * Accessible to all authenticated users.
 */

import * as React from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/seo/SEO'

/**
 * Dashboard Content Component
 * Displays user-specific dashboard information
 */
function DashboardContent(): React.JSX.Element {
  const { user, signOut } = useAuth()

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <>
      <SEO
        title="Dashboard - Doctor On Call"
        description="Manage your appointments and profile on Doctor On Call."
        keywords="dashboard, appointments, profile, doctor on call"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, {user?.name ?? 'User'}!
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user?.role}
              </p>
              {user?.role === 'doctor' && (
                <p>
                  <span className="font-medium">Approval Status:</span>{' '}
                  {user.approved ? (
                    <span className="text-green-600">Approved</span>
                  ) : (
                    <span className="text-yellow-600">Pending Approval</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <p className="text-muted-foreground">
              Dashboard features will be available in upcoming epics.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Dashboard Page Component
 * Wrapped with ProtectedRoute to ensure authentication
 */
export function DashboardPage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

