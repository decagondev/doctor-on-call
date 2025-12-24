/**
 * Doctor Profile Form Component
 * 
 * Form component for doctor profile editing following Single Responsibility Principle.
 * Handles doctor profile updates (name, photo, specialty, bio, qualifications).
 */

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import { useDoctorProfile } from '../hooks/useProfile'
import { doctorProfileSchema, type DoctorProfileInput } from '../lib/validation'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface DoctorProfileFormProps {
  onSuccess?: () => void
}

export function DoctorProfileForm({ onSuccess }: DoctorProfileFormProps) {
  const { user } = useAuth()
  const { profile, loading, updateProfile, uploadPhoto } = useDoctorProfile(
    user?.uid ?? ''
  )
  const [uploading, setUploading] = useState(false)

  const form = useForm<DoctorProfileInput>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      photoURL: profile?.publicProfile?.photoURL ?? profile?.photoURL ?? '',
      specialty: profile?.publicProfile?.specialty ?? '',
      bio: profile?.publicProfile?.bio ?? '',
      qualifications: profile?.publicProfile?.qualifications ?? [],
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-expect-error - React Hook Form type inference issue with Zod schemas and useFieldArray
    name: 'qualifications',
  })

  // Update form when profile loads
  if (profile && form.getValues('name') !== profile.name) {
    form.reset({
      name: profile.name,
      photoURL: profile.publicProfile?.photoURL ?? profile.photoURL ?? '',
      specialty: profile.publicProfile?.specialty ?? '',
      bio: profile.publicProfile?.bio ?? '',
      qualifications: profile.publicProfile?.qualifications ?? [],
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

  const onSubmit = async (values: DoctorProfileInput): Promise<void> => {
    try {
      await updateProfile({
        name: values.name,
        photoURL: values.photoURL || undefined,
        specialty: values.specialty,
        bio: values.bio,
        qualifications: values.qualifications,
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
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cardiology, Pediatrics" {...field} />
              </FormControl>
              <FormDescription>
                Your medical specialty or area of expertise
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell patients about your background, experience, and approach..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your background and expertise (10-1000 characters)
              </FormDescription>
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel>Qualifications</FormLabel>
              <FormDescription>
                Add your medical qualifications, certifications, or degrees
              </FormDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append('')}
            >
              Add Qualification
            </Button>
          </div>

          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`qualifications.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., MD, Board Certified in..."
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        ×
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

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

