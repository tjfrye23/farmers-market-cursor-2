export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold">Farmers Market</h3>
            <p className="mt-2 text-sm text-gray-600">
              Connecting local farmers with the community
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              © {new Date().getFullYear()} Farmers Market. All rights reserved.
            </p>
            <div className="space-x-4">
              <a href="#" className="hover:text-gray-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
