import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import React from 'react'

interface ProductImageGalleryProps {
  images: string[]
  selectedImage: number
  setSelectedImage: (idx: number) => void
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedImage,
  setSelectedImage,
}) => (
  <div className="space-y-4">
    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={images[selectedImage]}
        alt="Product image"
        fill
        className="object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
      </Button>
    </div>
    <div className="flex space-x-2">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
            selectedImage === index
              ? 'border-green-600 ring-2 ring-green-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={`Product view ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        </button>
      ))}
    </div>
  </div>
)
