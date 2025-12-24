/**
 * Role Selection Dialog Component
 * 
 * Displays information about doctor approval process after signup.
 * Follows Single Responsibility Principle - only handles role dialog display.
 */

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/**
 * Role Selection Dialog Props
 * Following Interface Segregation Principle - minimal props
 */
interface RoleSelectionDialogProps {
  open: boolean
  onClose: () => void
}

/**
 * Role Selection Dialog Component
 * Shows approval message for doctors after signup
 */
export function RoleSelectionDialog({
  open,
  onClose,
}: RoleSelectionDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Created Successfully</DialogTitle>
          <DialogDescription>
            Your account has been created. As a doctor, your profile will be visible
            to patients once an administrator approves your account. You will receive
            an email notification when your account is approved.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Continue to Dashboard</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

