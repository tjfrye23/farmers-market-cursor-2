import PageHeader from '@/components/PageHeader'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader
          title="About Us"
          description="Our story, mission, and commitment to the community"
          image="https://images.unsplash.com/photo-1495570689269-d883b1224443?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
        />
        <div className="container mx-auto px-4 py-12">
          <section className="mb-16">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-display mb-4 text-2xl font-bold">
                  Our Story
                </h2>
                <p className="mb-4 text-gray-700">
                  Market Fresh was founded in 2015 with a simple mission: to
                  make ordering from local farmers and vendors at our local
                  farmers markets easier.
                </p>
                <p className="mb-4 text-gray-700">
                  As farmers market frequenters, we understand that it can be
                  cumbersome to browse multiple websites to place orders from
                  different vendors. We created this platform to provide one
                  location to place an order from all of our vendors at the
                  local market.
                </p>
                <p className="text-gray-700">
                  We are constantly expanding the vendors we support and are
                  always looking to improve our platform for both our customers
                  and our vendors.
                </p>
              </div>
              <div className="overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/images/group-sitting.jpeg"
                  alt="Farmers at the market"
                  width={800}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/*
          <section className="mb-16">
            <h2 className="section-title text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-market-green-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="text-market-green h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Sustainability
                </h3>
                <p className="text-gray-600">
                  We prioritize environmentally friendly farming practices that
                  protect our soil, water, and biodiversity for future
                  generations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-market-green-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-market-green h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Community
                </h3>
                <p className="text-gray-600">
                  We believe in building strong connections between farmers,
                  consumers, and everyone who contributes to our local food
                  system.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-market-green-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-market-green h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Quality
                </h3>
                <p className="text-gray-600">
                  We maintain high standards for all products, ensuring that
                  customers receive the best nature has to offer.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-market-green-light/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-market-green h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  Education
                </h3>
                <p className="text-gray-600">
                  We're committed to sharing knowledge about sustainable food
                  systems and helping consumers make informed choices.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1626906722163-bd4c03cb3b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Farmers working together"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-display text-2xl font-bold mb-4">Our Commitment</h2>
                <p className="text-gray-700 mb-4">
                  At Market Fresh, we're committed to creating a transparent
                  food system where consumers know exactly where their food
                  comes from and how it was grown. We require all of our
                  producers to follow sustainable practices and prioritize
                  environmental stewardship.
                </p>
                <p className="text-gray-700 mb-4">
                  We believe that everyone deserves access to healthy,
                  affordable food. That's why we accept SNAP benefits and have
                  implemented programs to make our products more accessible to
                  low-income families in our community.
                </p>
                <p className="text-gray-700">
                  By choosing Market Fresh, you&apos;re not just purchasing
                  food—you&apos;re supporting a vibrant local economy, environmental
                  sustainability, and a healthier community for all.
                </p>
              </div>
            </div>
          </section>
          */}

          <section className="bg-market-green-light/10 mb-16 rounded-lg p-8">
            <h2 className="font-display mb-8 text-center text-2xl font-bold">
              Join Our Community
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-center text-lg">
              We&apos;re always looking for ways to grow and strengthen our
              community of farmers, artisans, and food lovers. Get involved with
              Market Fresh today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="default">
                <Link href="/vendor/onboarding">Become a Vendor</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
