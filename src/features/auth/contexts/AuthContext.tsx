/**
 * Auth Context
 * 
 * Provides authentication state and methods to the application.
 * Follows Single Responsibility Principle - only handles auth state management.
 * Uses Dependency Inversion Principle - depends on authService abstraction.
 */

import * as React from 'react'
import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import type { User, SignUpInput, SignInInput, AuthContextValue } from '../types/auth.types'

/**
 * Auth Context
 * Created with undefined default value to enforce usage within provider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Auth Provider Props
 * Following Interface Segregation Principle - minimal props
 */
interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to children
 */
export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Subscribe to auth state changes
   * Loads user document from Firestore when auth state changes
   */
  useEffect(() => {
    // Initialize loading state - setState in callback, not in effect body
    let isMounted = true

    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      if (isMounted) {
        setUser(authUser)
        setLoading(false)
        setError(null)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  /**
   * Sign up with email and password
   */
  const signUp = async (input: SignUpInput): Promise<User> => {
    try {
      setError(null)
      const newUser = await authService.signUp(input)
      setUser(newUser)
      return newUser
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed')
      setError(error)
      throw error
    }
  }

  /**
   * Sign in with email and password
   */
  const signIn = async (input: SignInInput): Promise<User> => {
    try {
      setError(null)
      const authUser = await authService.signIn(input)
      setUser(authUser)
      return authUser
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed')
      setError(error)
      throw error
    }
  }

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async (): Promise<User> => {
    try {
      setError(null)
      const authUser = await authService.signInWithGoogle()
      setUser(authUser)
      return authUser
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Google sign in failed')
      setError(error)
      throw error
    }
  }

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<void> => {
    try {
      setError(null)
      await authService.signOut()
      setUser(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out failed')
      setError(error)
      throw error
    }
  }

  const value: AuthContextValue = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

