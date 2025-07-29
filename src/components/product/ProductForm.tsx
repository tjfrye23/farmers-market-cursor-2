'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUploader from '@/components/ui/ImageUploader'
import { Plus, Trash2 } from 'lucide-react'

import {
  ClientProduct,
  createProductSchema,
  CreateProductSchema,
} from '@/types/product'
import { ProductFormData } from '@/data/product-data'
import { ProductCategory } from '@/generated/prisma/client'

interface ProductFormProps {
  editingProduct: ClientProduct | null
  initialValues?: CreateProductSchema
  onSuccess: (values: CreateProductSchema) => void
  onCancel: () => void
  submitButtonText?: string
  formData: ProductFormData
}

export default function ProductForm({
  initialValues,
  onSuccess,
  onCancel,
  submitButtonText = 'Save Product',
  formData,
}: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialValues?.imageUrl || null
  )

  const defaultValues: CreateProductSchema = initialValues || {
    name: '',
    description: '',
    category: ProductCategory.VEGETABLES,
    imageUrl: '',
    organic: false,
    local: false,
    variations: [
      {
        name: '',
        price: 0,
        size: 1,
        packaged: false,
        unitId: formData.units[0]?.id || 1,
      },
    ],
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
    control,
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
    mode: 'onSubmit',
  })

  // Use field array for variations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  })

  // Watch the imageUrl field to keep it in sync
  const watchedImageUrl = watch('imageUrl')

  // Update form when imageUrl changes
  useEffect(() => {
    if (imageUrl !== watchedImageUrl) {
      setValue('imageUrl', imageUrl || '')
      // Trigger validation for imageUrl field after setting the value
      if (imageUrl) {
        trigger('imageUrl')
      }
    }
  }, [imageUrl, watchedImageUrl, setValue, trigger])

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
    setValue('imageUrl', url)
    // Trigger validation immediately after setting the URL
    trigger('imageUrl')
  }

  const handleImageRemoved = () => {
    setImageUrl(null)
    setValue('imageUrl', '')
    // Trigger validation after removing the image
    trigger('imageUrl')
  }

  const addVariation = () => {
    append({
      name: '',
      price: 0,
      size: 1,
      packaged: false,
      unitId: formData.units[0]?.id || 1,
    })
  }

  const removeVariation = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = (values: CreateProductSchema) => {
    // Ensure we have the latest imageUrl
    const formData = {
      ...values,
      imageUrl: imageUrl || values.imageUrl || '',
    }
    onSuccess(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Name */}
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Fresh Organic Tomatoes"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <select
          {...register('category')}
          className={`w-full rounded-md border px-3 py-2 text-sm ${
            errors.category ? 'border-red-500' : 'border-input'
          }`}
        >
          {formData.categories.map((category) => (
            <option key={category} value={category}>
              {category
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your product..."
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Label>Product Image *</Label>
        <ImageUploader
          existingImageUrl={imageUrl}
          onImageUploaded={handleImageUploaded}
          onImageRemoved={handleImageRemoved}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="organic"
              {...register('organic')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="organic" className="text-sm font-normal">
              Organic
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="local"
              {...register('local')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="local" className="text-sm font-normal">
              Local
            </Label>
          </div>
        </div>
      </div>

      {/* Product Variations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Product Variations *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariation}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Variation
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Variation {index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor={`variation-${index}-name`}>Name</Label>
                <Input
                  id={`variation-${index}-name`}
                  {...register(`variations.${index}.name`)}
                  placeholder="e.g., 1 lb"
                  className={
                    errors.variations?.[index]?.name ? 'border-red-500' : ''
                  }
                />
                {errors.variations?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.variations[index].name?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`variation-${index}-price`}>Price ($)</Label>
                <Input
                  id={`variation-${index}-price`}
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`variations.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                  className={
                    errors.variations?.[index]?.price ? 'border-red-500' : ''
                  }
                />
                {errors.variations?.[index]?.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.variations[index].price?.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor={`variation-${index}-unit`}>Unit</Label>
                <select
                  {...register(`variations.${index}.unitId`, {
                    valueAsNumber: true,
                  })}
                  className={`w-full rounded-md border px-3 py-2 text-sm ${
                    errors.variations?.[index]?.unitId
                      ? 'border-red-500'
                      : 'border-input'
                  }`}
                >
                  {formData.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.displayName}
                    </option>
                  ))}
                </select>
                {errors.variations?.[index]?.unitId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.variations[index].unitId?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <input
                type="checkbox"
                id={`variation-${index}-packaged`}
                {...register(`variations.${index}.packaged`)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label
                htmlFor={`variation-${index}-packaged`}
                className="text-sm font-normal"
              >
                Pre-packaged
              </Label>
            </div>
          </div>
        ))}

        {errors.variations && typeof errors.variations === 'object' && (
          <p className="mt-1 text-sm text-red-500">
            {errors.variations.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  )
}
