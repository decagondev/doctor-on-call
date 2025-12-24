/**
 * Application Providers
 * 
 * Centralized provider composition following Open-Closed Principle.
 * Easy to extend with new providers without modifying existing code.
 */

import * as React from 'react'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'

/**
 * App Providers Props
 */
interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * App Providers Component
 * Wraps application with all necessary context providers
 */
export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return <AuthProvider>{children}</AuthProvider>
}

