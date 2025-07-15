import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="mb-6 text-4xl font-bold">Welcome to Farmers Market</h1>
        <p className="mb-8 text-xl text-gray-600">
          Discover fresh, local produce and connect with farmers in your
          community
        </p>
        <div className="space-x-4">
          <Link
            href="/shop"
            className="rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700"
          >
            Browse Products
          </Link>
          <Link
            href="/vendors"
            className="rounded-md border border-green-600 px-6 py-3 text-green-600 hover:bg-green-50"
          >
            Meet Our Vendors
          </Link>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Fresh Local Produce</h2>
          <p className="text-gray-600">
            Get access to the freshest fruits, vegetables, and artisanal
            products from local farmers.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Support Local Farmers</h2>
          <p className="text-gray-600">
            Connect directly with farmers in your community and support
            sustainable agriculture.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Market Days</h2>
          <p className="text-gray-600">
            Join us at our regular market days to experience the vibrant
            community of local food producers.
          </p>
        </div>
      </section>
    </div>
  )
}
