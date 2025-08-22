export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xl font-bold tracking-tight">
              Travel Journal
            </div>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Minimal, modern travel journaling. Plan trips, log memories, and
              share a clean public page.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a className="hover:underline" href="/trips">
                  Trips
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/create">
                  Create
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a className="hover:underline" href="/about">
                  About
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 text-sm text-gray-600 md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} Travel Journal. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/footer/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <a href="/footer/terms" className="hover:underline">
              Terms of Use
            </a>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <a href="/footer/cookies" className="hover:underline">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
