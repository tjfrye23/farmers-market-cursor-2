'use client'
import React, { useState } from 'react'

interface ProductDescriptionProps {
  description: string | null
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false)

  if (!description) return null
  const truncated = description.split('. ').slice(0, 2).join('. ') + '.'
  const isTruncated = description.length > truncated.length
  return (
    <div>
      <p className="text-gray-600">
        {showFullDescription ? description : truncated}
      </p>
      {isTruncated && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-market-green hover:text-market-green-dark mt-2"
        >
          {showFullDescription ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
