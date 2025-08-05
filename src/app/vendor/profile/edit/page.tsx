'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  MetricCard,
  MetricCardContent,
  MetricCardDescription,
  MetricCardHeader,
  MetricCardTitle,
} from '@/components/ui/metricCard'
import ImageUploader from '@/components/ui/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { z } from 'zod'
import { vendorService } from '@/services/vendorService'

const profileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  location: z.string().optional(),
  specialty: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  website: z.string().url().optional().or(z.literal('')),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

const defaultProfile: ProfileForm = {
  businessName: '',
  ownerName: '',
  location: '',
  specialty: '',
  description: '',
  imageUrl: null,
  website: '',
  facebook: '',
  instagram: '',
  twitter: '',
}

export default function VendorProfilePage() {
  const { data: session, status } = useSession({ required: true })
  const user = session?.user
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch vendor profile on mount
  useEffect(() => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    // Assume vendorProfile.id is available on user object
    const vendorProfileId = user.vendorProfile?.id
    if (!vendorProfileId) {
      setIsLoading(false)
      setError('No vendor profile found for this user.')
      return
    }
    vendorService
      .getVendorProfile(vendorProfileId)
      .then((data) => {
        setProfile({
          businessName: data.businessName || '',
          ownerName: data.user?.name || '',
          location: data.address || '',
          specialty: data.specialty || '',
          description: data.description || '',
          imageUrl: data.imageUrl ?? null,
          website: data.website || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          twitter: data.twitter || '',
        })
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [user])

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (imageUrl: string) => {
    setProfile((prev) => ({ ...prev, imageUrl }))
  }

  const handleImageRemoved = () => {
    setProfile((prev) => ({ ...prev, imageUrl: null }))
  }

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    const vendorProfileId = user?.vendorProfile?.id
    if (!vendorProfileId) {
      setError('No vendor profile found for this user.')
      setIsSaving(false)
      return
    }
    // Validate
    const result = profileSchema.safeParse(profile)
    if (!result.success) {
      toast.error(result.error.errors[0].message)
      setIsSaving(false)
      return
    }
    try {
      await vendorService.updateVendorProfile(vendorProfileId, {
        businessName: profile.businessName,
        description: profile.description,
        address: profile.location,
        specialty: profile.specialty,
        imageUrl: profile.imageUrl,
        website: profile.website,
        facebook: profile.facebook,
        instagram: profile.instagram,
        twitter: profile.twitter,
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }
  if (!user || user.role !== 'vendor') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        You must be a vendor to view this page.
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: Add Navbar */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <MetricCard className="shadow-xl">
              <MetricCardHeader className="pb-2">
                <div className="text-center">
                  <MetricCardTitle className="font-display text-market-green-dark text-3xl">
                    {profile.businessName || 'Your Farm/Business'}
                  </MetricCardTitle>
                  <MetricCardDescription className="mt-1 text-xl">
                    Owned by {profile.ownerName || 'You'}
                  </MetricCardDescription>
                </div>
                {!isEditing && (
                  <div className="mt-2 flex justify-end">
                    <Button onClick={handleEdit}>Edit Profile</Button>
                  </div>
                )}
              </MetricCardHeader>
              <MetricCardContent className="pt-2">
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                  }}
                >
                  <div className="mb-6">
                    <ImageUploader
                      existingImageUrl={profile.imageUrl ?? null}
                      onImageUploaded={handleImageUploaded}
                      onImageRemoved={handleImageRemoved}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={profile.businessName}
                        onChange={handleChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={profile.ownerName}
                        onChange={handleChange}
                        required
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={profile.specialty}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={profile.description}
                      onChange={handleChange}
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={profile.website}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={profile.facebook}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="facebook.com/yourpage or @yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={profile.instagram}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="instagram.com/yourpage or @yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={profile.twitter}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="twitter.com/yourpage or @yourpage"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-4 flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </form>
              </MetricCardContent>
            </MetricCard>
          </div>
        </div>
      </main>
      {/* TODO: Add Footer */}
    </div>
  )
}
