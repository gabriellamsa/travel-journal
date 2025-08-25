import Image from "next/image";

export default function About() {
  return (
    <section className="relative w-full py-16 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
            About <span className="text-blue-400">Travel Journal</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg max-w-3xl mx-auto">
            A minimal, modern platform for documenting your travel experiences.{" "}
            <br />
            Designed to be simple, elegant, and focused on what matters most:
            preserving your memories.
          </p>
        </div>

        {/* Story */}
        <div className="grid items-center gap-16 md:grid-cols-2 mb-24">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              Travel Journal Story
            </h2>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              Travel Journal was founded by me, Gabi, a passionate digital nomad
              who knows firsthand the value of preserving life's adventures.
              After years of traveling and testing countless tools, I envisioned
              a modern platform that blends simplicity, privacy, and beautiful
              design, crafted for explorers who want to keep their stories alive
              in style.
            </p>
          </div>
          <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-blue-100">
            <Image
              src="/about-story.jpg"
              alt="Traveler documenting memories"
              fill
              className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
            />
            {/* Floating element */}
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-200 opacity-60"></div>
          </div>
        </div>

        {/* Mission */}
        <div className="grid items-center gap-16 md:grid-cols-2 mb-24">
          <div className="order-2 md:order-1">
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-green-100">
              <Image
                src="/about-mission.jpg"
                alt="Mission illustration"
                fill
                className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
              />
              {/* Floating element */}
              <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-green-200 opacity-60"></div>
            </div>
          </div>
          <div className="order-1 space-y-6 md:order-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              The Mission
            </h2>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              Travel Journal mission is to provide travelers with a clean,
              intuitive platform to:
            </p>
            <ul className="space-y-3 text-sm text-gray-700 md:text-base">
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-blue-600 text-sm">📍</span>
                </div>
                <span>Plan and organize trips with ease</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <span className="text-green-600 text-sm">📸</span>
                </div>
                <span>Capture moments through photos and notes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100">
                  <span className="text-pink-600 text-sm">🌍</span>
                </div>
                <span>Share experiences with friends and family</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-blue-600 text-sm">💾</span>
                </div>
                <span>Create lasting digital memories</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Founder */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 p-12 shadow-xl ring-1 ring-blue-100 mb-24">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-16">
            <div className="group relative h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-80 md:w-80">
              <Image
                src="/about-founder.jpg"
                alt="Founder traveling"
                fill
                className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
              />
              {/* Floating element */}
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-200 opacity-60"></div>
            </div>

            <div className="mt-8 flex-1 md:mt-0">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                Meet the Founder
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
                Travel Journal was founded by me,{" "}
                <span className="font-semibold text-blue-600">Gabi</span>, a
                passionate digital nomad who knows firsthand the value of
                preserving life's adventures. After years of traveling and
                testing countless tools, I envisioned a modern platform that
                blends simplicity, privacy, and beautiful design, crafted for
                explorers who want to keep their stories alive in style.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes TJ Different */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
              What Makes <span className="text-green-400">Travel Journal</span>{" "}
              Different
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            <div className="group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl hover:scale-105 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-4 mx-auto">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Simplicity
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                A clean, intuitive interface without unnecessary complexity.
              </p>
            </div>
            <div className="group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-green-100 transition-all duration-300 hover:shadow-xl hover:scale-105 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 mb-4 mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Privacy</h3>
              <p className="mt-3 text-sm text-gray-600">
                Your data stays yours, with full control over what's shared.
              </p>
            </div>
            <div className="group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-pink-100 transition-all duration-300 hover:shadow-xl hover:scale-105 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 mb-4 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Performance
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                Fast, responsive, and optimized for all devices.
              </p>
            </div>
            <div className="group rounded-2xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl hover:scale-105 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-4 mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Modern Design
              </h3>
              <p className="mt-3 text-sm text-gray-600">
                A minimalist aesthetic that highlights your content beautifully.
              </p>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
            Travel Journal <span className="text-pink-400">Vision</span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-base leading-relaxed text-gray-600 md:text-lg">
            I'm building more than just a travel app, I'm creating a space for
            people to preserve and share their most precious journeys. Whether
            you're a weekend traveler or a full-time nomad, Travel Journal is
            designed to grow with you and adapt to your adventures.
          </p>
        </div>
      </div>
    </section>
  );
}
