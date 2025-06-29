import React from 'react'

interface ProductDescriptionProps {
  description: string | null
  showFull: boolean
  setShowFull: (show: boolean) => void
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  showFull,
  setShowFull,
}) => {
  if (!description) return null
  const truncated = description.split('. ').slice(0, 2).join('. ') + '.'
  const isTruncated = description.length > truncated.length
  return (
    <div>
      <p className="text-gray-600">{showFull ? description : truncated}</p>
      {isTruncated && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-market-green hover:text-market-green-dark mt-2"
        >
          {showFull ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
