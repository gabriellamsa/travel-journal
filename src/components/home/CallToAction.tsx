export default function CallToAction() {
  return (
    <section className="relative w-full py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 p-8 shadow-2xl md:p-12">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-green-200/20 to-pink-200/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,197,253,0.2),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(134,239,172,0.2),transparent_50%)]"></div>

          <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl lg:text-4xl">
                Ready to build your{" "}
                <span className="text-blue-800">travel journal?</span>
              </h2>

              <p className="text-lg text-blue-700 leading-relaxed">
                Start a trip, add memories, and share a beautiful public page
                with friends and family.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl hover:scale-105"
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
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-700"
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
                    className="h-4 w-4 text-green-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Setup in minutes
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="group relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm p-6 ring-1 ring-white/30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-green-200/30 to-pink-200/30"></div>
                <div className="relative grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🗺️",
                      label: "Interactive Maps",
                      color: "from-blue-300 to-blue-400",
                    },
                    {
                      icon: "🖼️",
                      label: "Photo Gallery",
                      color: "from-green-300 to-green-400",
                    },
                    {
                      icon: "📝",
                      label: "Travel Notes",
                      color: "from-blue-400 to-blue-500",
                    },
                    {
                      icon: "🔗",
                      label: "Public Sharing",
                      color: "from-pink-300 to-pink-400",
                    },
                  ].map(({ icon, label, color }) => (
                    <div
                      key={label}
                      className="group/item relative rounded-xl bg-white/90 p-4 text-center shadow-lg backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <div className="text-xl mb-2">{icon}</div>
                      <div className="text-xs font-semibold text-gray-700">
                        {label}
                      </div>
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${color} opacity-0 group-hover/item:opacity-10 transition-opacity duration-300`}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-200 opacity-60"></div>
                <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-green-200 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
