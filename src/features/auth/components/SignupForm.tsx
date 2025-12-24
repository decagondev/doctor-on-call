/**
 * Signup Form Component
 * 
 * Handles user registration with email, password, name, and role selection.
 * Follows Single Responsibility Principle - only handles signup form logic.
 * Uses shadcn/ui components and Zod validation.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signUpSchema, type SignUpFormData } from '../lib/validation'
import { RoleSelectionDialog } from './RoleSelectionDialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

/**
 * Signup Form Props
 * Following Interface Segregation Principle - minimal props
 */
interface SignupFormProps {
  onSuccess?: () => void
}

/**
 * Signup Form Component
 * Displays registration form with role selection
 */
export function SignupForm({ onSuccess }: SignupFormProps): JSX.Element {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState<boolean>(false)

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'client', // Default role
    },
  })

  /**
   * Handle form submission
   * Signs up user and shows role dialog if needed
   */
  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      await signUp(data)
      onSuccess?.()
      
      // If doctor role, show approval message
      if (data.role === 'doctor') {
        setShowRoleDialog(true)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign up. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle role dialog close
   * Navigates to dashboard after role selection
   */
  const handleRoleDialogClose = (): void => {
    setShowRoleDialog(false)
    navigate('/dashboard')
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters with uppercase, lowercase, and number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                    {...field}
                  >
                    <option value="client">Patient / Client</option>
                    <option value="doctor">Doctor / Consultant</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Doctors require admin approval before their profile is visible
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      {showRoleDialog && (
        <RoleSelectionDialog
          open={showRoleDialog}
          onClose={handleRoleDialogClose}
        />
      )}
    </>
  )
}

