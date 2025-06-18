import Image from 'next/image'
import React from 'react'

interface VendorHeroImageProps {
  imageUrl?: string | null
  alt: string
  defaultImage: string
}

export const VendorHeroImage: React.FC<VendorHeroImageProps> = ({
  imageUrl,
  alt,
  defaultImage,
}) => (
  <div className="relative h-64 w-full md:h-96">
    <Image
      src={imageUrl || defaultImage}
      alt={alt}
      fill
      className="object-cover"
      priority
      sizes="100vw"
    />
    <div className="absolute inset-0 bg-black opacity-30" />
  </div>
)
