/**
 * useAuth Hook
 * 
 * Custom hook for accessing authentication state and methods.
 * Follows Interface Segregation Principle - returns minimal, focused interface.
 * Wraps AuthContext for easy consumption in components.
 */

import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import type { AuthContextValue } from '../types/auth.types'

/**
 * useAuth Hook
 * Returns authentication state and methods
 * 
 * @returns AuthContextValue with user, loading, error, and auth methods
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

