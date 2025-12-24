/**
 * Login Page
 * 
 * Public page for user authentication.
 * Redirects authenticated users to dashboard.
 */

import * as React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm } from '../components/LoginForm'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/seo/SEO'

/**
 * Login Page Component
 * Displays login form and handles redirects for authenticated users
 */
export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  // Don't render form if user is authenticated (will redirect)
  if (user) {
    return <></>
  }

  return (
    <>
      <SEO
        title="Sign In - Doctor On Call"
        description="Sign in to your Doctor On Call account to book appointments and manage your consultations."
        keywords="login, sign in, doctor on call, medical consultation"
      />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <LoginForm
              onSuccess={() => {
                navigate('/dashboard')
              }}
            />
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

