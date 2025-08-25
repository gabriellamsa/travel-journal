export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xl font-bold tracking-tight text-gray-900">
              Travel Journal
            </div>
            <p className="mt-3 max-w-md text-sm text-gray-600 leading-relaxed">
              Minimal, modern travel journaling. Plan trips, log memories, and
              share a clean public page.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a
                  className="hover:text-blue-600 transition-colors duration-200"
                  href="/demo/create-trip"
                >
                  Create Trip
                </a>
              </li>
              <li>
                <a
                  className="hover:text-blue-600 transition-colors duration-200"
                  href="/dashboard"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a
                  className="hover:text-blue-600 transition-colors duration-200"
                  href="/about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="hover:text-blue-600 transition-colors duration-200"
                  href="/footer/contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-blue-100 pt-6 text-sm text-gray-600 md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} Travel Journal. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/footer/privacy"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span className="h-1 w-1 rounded-full bg-blue-200" />
            <a
              href="/footer/terms"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Terms of Use
            </a>
            <span className="h-1 w-1 rounded-full bg-blue-200" />
            <a
              href="/footer/cookies"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
