/**
 * Protected Route Component
 * 
 * Route guard that protects routes based on authentication and role requirements.
 * Follows Single Responsibility Principle - only handles route protection logic.
 * Uses Open-Closed Principle - can extend with new role checks without modification.
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth.types'

/**
 * Protected Route Props
 * Following Interface Segregation Principle - minimal, focused props
 */
interface ProtectedRouteProps {
  children: JSX.Element
  requireAuth?: boolean
  allowedRoles?: UserRole[]
  redirectTo?: string
}

/**
 * Protected Route Component
 * 
 * Protects routes based on authentication and role requirements.
 * 
 * @param children - The component to render if access is granted
 * @param requireAuth - Whether authentication is required (default: true)
 * @param allowedRoles - Array of roles allowed to access the route
 * @param redirectTo - Path to redirect to if access is denied (default: '/login')
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps): JSX.Element {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If user is authenticated but role restrictions apply
  if (user && allowedRoles && allowedRoles.length > 0) {
    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page or home
      return <Navigate to="/" replace />
    }
  }

  // If user is authenticated and role check passes (or no role check)
  return children
}

