/**
 * Client Profile Form Component
 * 
 * Form component for client profile editing following Single Responsibility Principle.
 * Handles only client profile updates (name, photo).
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useClientProfile } from '../hooks/useProfile'
import { clientProfileSchema, type ClientProfileInput } from '../lib/validation'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ClientProfileFormProps {
  onSuccess?: () => void
}

export function ClientProfileForm({ onSuccess }: ClientProfileFormProps) {
  const { user } = useAuth()
  const { profile, loading, updateProfile, uploadPhoto } = useClientProfile(
    user?.uid ?? ''
  )
  const [uploading, setUploading] = useState(false)

  const form = useForm<ClientProfileInput>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      photoURL: profile?.photoURL ?? '',
    },
  })

  // Update form when profile loads
  if (profile && form.getValues('name') !== profile.name) {
    form.reset({
      name: profile.name,
      photoURL: profile.photoURL ?? '',
    })
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const photoURL = await uploadPhoto(file)
      form.setValue('photoURL', photoURL)
    } catch (error) {
      console.error('Failed to upload photo:', error)
      form.setError('photoURL', {
        type: 'manual',
        message: 'Failed to upload photo. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: ClientProfileInput): Promise<void> => {
    try {
      await updateProfile({
        name: values.name,
        photoURL: values.photoURL || undefined,
      })
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update profile:', error)
      form.setError('root', {
        type: 'manual',
        message: 'Failed to update profile. Please try again.',
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photoURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Photo</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || uploading}
        >
          {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  )
}

