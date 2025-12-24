/**
 * Dashboard Page
 * 
 * Protected page that displays user-specific dashboard content.
 * Accessible to all authenticated users.
 * Shows different dashboards based on user role (client/doctor).
 */

import * as React from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { ClientDashboard } from '@/features/dashboard/components/ClientDashboard'
import { DoctorDashboard } from '@/features/dashboard/components/DoctorDashboard'
import { SEO } from '@/components/seo/SEO'

/**
 * Dashboard Content Component
 * Displays user-specific dashboard based on role
 */
function DashboardContent(): React.JSX.Element {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SEO
        title="Dashboard - Doctor On Call"
        description="Manage your appointments and profile on Doctor On Call."
        keywords="dashboard, appointments, profile, doctor on call"
      />
      <div className="container mx-auto px-4 py-8">
        {user.role === 'client' && <ClientDashboard />}
        {user.role === 'doctor' && <DoctorDashboard />}
        {user.role === 'admin' && (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Admin dashboard features coming soon.
            </p>
          </div>
        )}
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

