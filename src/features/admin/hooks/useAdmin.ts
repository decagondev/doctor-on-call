/**
 * Admin Hook
 * 
 * Custom hook for admin operations following Interface Segregation Principle.
 * Provides focused interface for admin operations.
 */

import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import type { AdminUserListItem, ApproveUserInput } from '../types/admin.types'

/**
 * Admin state interface
 * Following Interface Segregation Principle - minimal, focused interface
 */
interface AdminState {
  users: AdminUserListItem[]
  loading: boolean
  error: Error | null
}

/**
 * Admin hook return type
 */
interface UseAdminReturn extends AdminState {
  refreshUsers: () => Promise<void>
  approveUser: (input: ApproveUserInput) => Promise<void>
  getPendingDoctors: () => Promise<AdminUserListItem[]>
}

/**
 * Hook for admin operations
 */
export function useAdmin(): UseAdminReturn {
  const [state, setState] = useState<AdminState>({
    users: [],
    loading: true,
    error: null,
  })

  const loadUsers = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const users = await adminService.getAllUsers()
      setState({ users, loading: false, error: null })
    } catch (error) {
      setState({
        users: [],
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to load users'),
      })
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const refreshUsers = async (): Promise<void> => {
    await loadUsers()
  }

  const approveUser = async (input: ApproveUserInput): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      await adminService.approveUser(input)
      
      // Refresh users after approval
      await loadUsers()
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to approve user'),
      }))
      throw error
    }
  }

  const getPendingDoctors = async (): Promise<AdminUserListItem[]> => {
    try {
      return await adminService.getPendingDoctors()
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get pending doctors')
    }
  }

  return {
    ...state,
    refreshUsers,
    approveUser,
    getPendingDoctors,
  }
}

