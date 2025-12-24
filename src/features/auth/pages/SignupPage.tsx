/**
 * Signup Page
 * 
 * Public page for user registration.
 * Redirects authenticated users to dashboard.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SignupForm } from '../components/SignupForm'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/seo/SEO'

/**
 * Signup Page Component
 * Displays signup form and handles redirects for authenticated users
 */
export function SignupPage(): JSX.Element {
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
        title="Sign Up - Doctor On Call"
        description="Create a new Doctor On Call account to book appointments with verified doctors or register as a healthcare provider."
        keywords="sign up, register, doctor on call, medical consultation, healthcare provider"
      />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="mt-2 text-muted-foreground">
              Sign up to start booking consultations
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <SignupForm
              onSuccess={() => {
                // Navigation handled in SignupForm component
              }}
            />
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

