/**
 * Profile Hook
 * 
 * Custom hook for profile management following Interface Segregation Principle.
 * Provides focused interface for profile operations.
 */

import { useState, useEffect } from 'react'
import { profileService } from '../services/profileService'
import type {
  ClientProfile,
  DoctorProfile,
  ClientProfileUpdate,
  DoctorProfileUpdate,
} from '../types/profile.types'

/**
 * Profile state interface
 * Following Interface Segregation Principle - minimal, focused interface
 */
interface ProfileState<T> {
  profile: T | null
  loading: boolean
  error: Error | null
}

/**
 * Profile hook return type for client
 */
interface UseClientProfileReturn extends ProfileState<ClientProfile> {
  updateProfile: (update: ClientProfileUpdate) => Promise<void>
  uploadPhoto: (file: File) => Promise<string>
}

/**
 * Profile hook return type for doctor
 */
interface UseDoctorProfileReturn extends ProfileState<DoctorProfile> {
  updateProfile: (update: DoctorProfileUpdate) => Promise<void>
  uploadPhoto: (file: File) => Promise<string>
}

/**
 * Hook for client profile management
 */
export function useClientProfile(userId: string): UseClientProfileReturn {
  const [state, setState] = useState<ProfileState<ClientProfile>>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const profile = await profileService.getClientProfile(userId)
        
        if (isMounted) {
          setState({ profile, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            profile: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Failed to load profile'),
          })
        }
      }
    }

    if (userId) {
      loadProfile()
    } else {
      setState({ profile: null, loading: false, error: null })
    }

    return () => {
      isMounted = false
    }
  }, [userId])

  const updateProfile = async (update: ClientProfileUpdate): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      await profileService.updateClientProfile(userId, update)
      
      // Reload profile after update
      const updatedProfile = await profileService.getClientProfile(userId)
      setState((prev) => ({ ...prev, profile: updatedProfile }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to update profile'),
      }))
      throw error
    }
  }

  const uploadPhoto = async (file: File): Promise<string> => {
    const result = await profileService.uploadPhoto(userId, file)
    return result.photoURL
  }

  return {
    ...state,
    updateProfile,
    uploadPhoto,
  }
}

/**
 * Hook for doctor profile management
 */
export function useDoctorProfile(userId: string): UseDoctorProfileReturn {
  const [state, setState] = useState<ProfileState<DoctorProfile>>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const profile = await profileService.getDoctorProfile(userId)
        
        if (isMounted) {
          setState({ profile, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            profile: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Failed to load profile'),
          })
        }
      }
    }

    if (userId) {
      loadProfile()
    } else {
      setState({ profile: null, loading: false, error: null })
    }

    return () => {
      isMounted = false
    }
  }, [userId])

  const updateProfile = async (update: DoctorProfileUpdate): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      await profileService.updateDoctorProfile(userId, update)
      
      // Reload profile after update
      const updatedProfile = await profileService.getDoctorProfile(userId)
      setState((prev) => ({ ...prev, profile: updatedProfile }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to update profile'),
      }))
      throw error
    }
  }

  const uploadPhoto = async (file: File): Promise<string> => {
    const result = await profileService.uploadPhoto(userId, file)
    return result.photoURL
  }

  return {
    ...state,
    updateProfile,
    uploadPhoto,
  }
}

