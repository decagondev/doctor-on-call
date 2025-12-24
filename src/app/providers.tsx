/**
 * Application Providers
 * 
 * Centralized provider composition following Open-Closed Principle.
 * Easy to extend with new providers without modifying existing code.
 */

import { AuthProvider } from '@/features/auth/contexts/AuthContext'
import type { ReactNode } from 'react'

/**
 * App Providers Props
 */
interface AppProvidersProps {
  children: ReactNode
}

/**
 * App Providers Component
 * Wraps application with all necessary context providers
 */
export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return <AuthProvider>{children}</AuthProvider>
}

