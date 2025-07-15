import { getVendorsPaginated } from '@/data/vendors'
import PageHeader from '@/components/PageHeader'
import VendorCard from '@/components/VendorCard'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface VendorsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const page = Number((await searchParams).page) || 1
  const pageSize = 12
  const search = (await searchParams).search || ''

  const { vendors, total } = await getVendorsPaginated(page, pageSize, search)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader
          title="Meet Our Vendors"
          description="The passionate people behind our fresh, local products"
          image="/images/products/farmer-field.jpeg"
        />
        <div className="container mx-auto px-4 py-8">
          <section className="mb-16">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-display text-market-green-dark mb-4 text-3xl font-bold">
                The Heart of Our Market
              </h2>
              <p className="text-lg text-gray-700">
                Our vendors are the backbone of Market Fresh. Each one brings
                unique skills, knowledge, and passion to their craft, resulting
                in the exceptional quality and variety you&apos;ll find at our
                market. Get to know the people who grow your food!
              </p>
            </div>
            {vendors.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-lg text-gray-500">
                Sorry, we have no vendors to show at the moment.
              </div>
            ) : (
              <>
                {/* Search Form */}
                <form
                  className="mb-6 flex justify-center"
                  action=""
                  method="get"
                >
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Search vendors..."
                    className="w-64 rounded-l border px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="bg-market-green rounded-r px-4 py-2 text-white"
                  >
                    Search
                  </button>
                </form>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {vendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      id={vendor.id}
                      ownerName={vendor.businessName}
                      vendorName={vendor.businessName}
                      location={vendor.address ?? null}
                      imageUrl={vendor.headerImageUrl}
                      specialty={vendor.description}
                    />
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <a
                        key={i}
                        href={`?search=${encodeURIComponent(search)}&page=${i + 1}`}
                        className={`rounded border px-3 py-1 text-sm transition-colors ${
                          i + 1 === page
                            ? 'bg-market-green border-market-green text-white'
                            : 'text-market-green border-market-green hover:bg-market-green bg-white hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
          <section className="bg-market-brown-light/20 mb-16 rounded-lg p-8">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-display text-market-green-dark mb-4 text-2xl font-bold">
                  Become a Market Fresh Farmer
                </h2>
                <p className="mb-4 text-gray-700">
                  Are you a local farmer or artisanal food producer? We&apos;re
                  always looking to expand our community of vendors. Join us at
                  Market Fresh and connect directly with customers who value
                  quality, sustainability, and community.
                </p>
                <ul className="mb-6 list-disc pl-5 text-gray-700">
                  <li>
                    Access to an established customer base passionate about
                    local food
                  </li>
                  <li>Fair pricing that respects your work and expertise</li>
                  <li>Marketing support to help tell your story</li>
                  <li>A community of like-minded producers and customers</li>
                </ul>
                <Button
                  className="bg-market-green hover:bg-market-green-dark"
                  asChild
                >
                  <a href="/vendor/onboarding">Apply to Become a Vendor</a>
                </Button>
              </div>
              <div className="overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/products/farmer-field.jpeg"
                  alt="Farmer in field"
                  width={800}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* TODO: Add Footer if needed */}
    </div>
  )
}
