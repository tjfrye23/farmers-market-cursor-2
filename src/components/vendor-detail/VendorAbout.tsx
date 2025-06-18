import React from 'react'

interface VendorAboutProps {
  businessName: string
  description?: string | null
  ownerName?: string | null
}

export const VendorAbout: React.FC<VendorAboutProps> = ({
  businessName,
  description,
  ownerName,
}) => (
  <div className="mb-6">
    <h3 className="text-market-green-dark mb-2 text-lg font-semibold">
      About {businessName}
    </h3>
    <p className="text-gray-700">
      {description ||
        `${businessName} is committed to sustainable farming practices and bringing the freshest produce to your table. ${ownerName || 'The owner'} has been farming for over 10 years and takes pride in growing the highest quality crops.`}
    </p>
  </div>
)
