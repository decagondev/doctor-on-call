/**
 * Login Form Component
 * 
 * Handles user sign in with email and password.
 * Follows Single Responsibility Principle - only handles login form logic.
 * Uses shadcn/ui components and Zod validation.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signInSchema, type SignInFormData } from '../lib/validation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

/**
 * Login Form Props
 * Following Interface Segregation Principle - minimal props
 */
interface LoginFormProps {
  onSuccess?: () => void
}

/**
 * Login Form Component
 * Displays email/password login form with validation
 */
export function LoginForm({ onSuccess }: LoginFormProps): JSX.Element {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * Handle form submission
   * Signs in user and redirects on success
   */
  const onSubmit = async (data: SignInFormData): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn(data)
      onSuccess?.()
      navigate('/dashboard')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}

