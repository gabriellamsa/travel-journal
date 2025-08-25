import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Your Interactive{" "}
                <span className="text-blue-500">Travel Journal</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Record your adventures, add precious memories, and share
                stunning public pages for each journey. Your travels deserve to
                be remembered beautifully.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-400 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:scale-105"
              >
                Create a Free Account
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <a
                href="/demo/create-trip"
                className="inline-flex items-center justify-center rounded-xl border-2 border-blue-200 px-6 py-3 text-base font-semibold text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105"
              >
                Create Trip
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Minimalist layout
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Share with friends
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-blue-100">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                <Image
                  src="/map-preview.png"
                  alt="Interactive map preview with location pins and travel routes"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                {/* Overlay with some UI elements to make it look more interactive */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg bg-white/90 backdrop-blur-sm p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium text-gray-800">
                        Map coming soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-blue-100 opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-green-100 opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
