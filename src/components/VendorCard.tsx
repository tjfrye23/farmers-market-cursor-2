import Link from 'next/link'

export interface VendorCardProps {
  id: string
  ownerName: string
  vendorName: string
  location: string | null
  imageUrl: string | null
  specialty: string | null
}

const VendorCard = ({
  id,
  ownerName,
  vendorName,
  location,
  imageUrl,
  specialty,
}: VendorCardProps) => {
  // Default image if none provided
  const defaultImage = '/images/products/farmer-field.jpeg'

  return (
    <Link
      href={`/vendors/${id}`}
      className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={imageUrl || defaultImage}
          alt={vendorName}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-market-green-dark text-xl font-semibold">
          {ownerName}
        </h3>
        <p className="text-market-green mb-2">{vendorName}</p>
        <p className="mb-3 text-gray-600">{location || 'California'}</p>
        <p className="mb-4 text-gray-500">
          Specialty: {specialty || 'Fresh Produce'}
        </p>
        <div className="text-market-green hover:text-market-green-dark font-medium transition-colors">
          Meet {ownerName.split(' ')[0]} →
        </div>
      </div>
    </Link>
  )
}

export default VendorCard
