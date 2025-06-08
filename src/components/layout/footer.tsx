import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-market-green-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display mb-4 text-xl font-bold">
              Market Fresh
            </h3>
            <p className="mb-4">
              Bringing you the freshest, locally-grown produce directly from our
              vendors to your table.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-market-yellow-light transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-market-yellow-light transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-market-yellow-light transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display mb-4 text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-market-yellow-light transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-market-yellow-light transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-market-yellow-light transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="hover:text-market-yellow-light transition-colors"
                >
                  Our Vendors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display mb-4 text-xl font-bold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-0.5 h-5 w-5" />
                <span>123 Harvest Lane, Farmville, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <span>info@marketfresh.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display mb-4 text-xl font-bold">
              Market Hours
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <div>
                  <div>Monday - Friday</div>
                  <div>8:00 AM - 7:00 PM</div>
                </div>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <div>
                  <div>Saturday</div>
                  <div>7:00 AM - 6:00 PM</div>
                </div>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                <div>
                  <div>Sunday</div>
                  <div>8:00 AM - 2:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Market Fresh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
