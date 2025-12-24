/**
 * User Table Component
 * 
 * Admin component for displaying and managing users following Single Responsibility Principle.
 * Handles only user list display and approval actions.
 */

import { useState } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { Button } from '@/components/ui/button'

interface UserTableProps {
  showPendingOnly?: boolean
}

export function UserTable({ showPendingOnly = false }: UserTableProps) {
  const { users, loading, error, approveUser } = useAdmin()
  const [approving, setApproving] = useState<string | null>(null)

  const handleApprove = async (
    userId: string,
    approved: boolean
  ): Promise<void> => {
    try {
      setApproving(userId)
      await approveUser({ userId, approved })
    } catch (error) {
      console.error('Failed to approve user:', error)
      alert('Failed to update user approval status. Please try again.')
    } finally {
      setApproving(null)
    }
  }

  const displayUsers = showPendingOnly
    ? users.filter((user) => user.role === 'doctor' && !user.approved)
    : users

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading users: {error.message}
      </div>
    )
  }

  if (displayUsers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {showPendingOnly
          ? 'No pending doctors awaiting approval'
          : 'No users found'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Specialty
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map((user) => (
            <tr key={user.uid} className="border-b hover:bg-muted/50">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {user.doctorProfile?.specialty || '-'}
              </td>
              <td className="px-4 py-3">
                {user.role === 'doctor' ? (
                  user.approved ? (
                    <span className="text-green-600 font-medium">Approved</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      Pending
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                {user.role === 'doctor' && (
                  <div className="flex gap-2">
                    {!user.approved ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(user.uid, true)}
                        disabled={approving === user.uid}
                      >
                        {approving === user.uid ? 'Approving...' : 'Approve'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(user.uid, false)}
                        disabled={approving === user.uid}
                      >
                        {approving === user.uid ? 'Updating...' : 'Revoke'}
                      </Button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

