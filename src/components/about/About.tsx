import Image from "next/image";

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About Travel Journal
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-gray-600 md:text-base">
          A minimal, modern platform for documenting your travel experiences.{" "}
          <br />
          Designed to be simple, elegant, and focused on what matters most:
          preserving your memories.
        </p>
      </div>

      {/* Story */}
      <div className="mt-24 grid items-center gap-16 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Travel Journal Story
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            Travel Journal was founded by me, Gabi, a passionate digital nomad
            who knows firsthand the value of preserving life's adventures. After
            years of traveling and testing countless tools, I envisioned a
            modern platform that blends simplicity, privacy, and beautiful
            design, crafted for explorers who want to keep their stories alive
            in style.
          </p>
        </div>
        <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-black/10 shadow-lg">
          <Image
            src="/about-story.jpg"
            alt="Traveler documenting memories"
            fill
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Mission */}
      <div className="mt-32 grid items-center gap-16 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-black/10 shadow-lg">
            <Image
              src="/about-mission.jpg"
              alt="Mission illustration"
              fill
              className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
            />
          </div>
        </div>
        <div className="order-1 space-y-6 md:order-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            The Mission
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            Travel Journal mission is to provide travelers with a clean,
            intuitive platform to:
          </p>
          <ul className="space-y-4 text-sm text-gray-700 md:text-base">
            <li className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <span>Plan and organize trips with ease</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">📸</span>
              <span>Capture moments through photos and notes</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🌍</span>
              <span>Share experiences with friends and family</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">💾</span>
              <span>Create lasting digital memories</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Founder */}
      <section className="mt-32 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-12 shadow-lg">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-16">
          <div className="group relative h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-xl md:h-80 md:w-80">
            <Image
              src="/about-founder.jpg"
              alt="Founder traveling"
              fill
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
            />
          </div>

          <div className="mt-8 flex-1 md:mt-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Meet the Founder
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-gray-600 md:text-base">
              Travel Journal was founded by me,{" "}
              <span className="font-semibold text-gray-900">Gabi</span>, a
              passionate digital nomad who knows firsthand the value of
              preserving life's adventures. After years of traveling and testing
              countless tools, I envisioned a modern platform that blends
              simplicity, privacy, and beautiful design, crafted for explorers
              who want to keep their stories alive in style.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes TJ Different */}
      <div className="mt-32">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          What Makes Travel Journal Different
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-2xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/20">
            <h3 className="text-lg font-semibold">✨ Simplicity</h3>
            <p className="mt-3 text-sm text-gray-600">
              A clean, intuitive interface without unnecessary complexity.
            </p>
          </div>
          <div className="group rounded-2xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/20">
            <h3 className="text-lg font-semibold">🔒 Privacy</h3>
            <p className="mt-3 text-sm text-gray-600">
              Your data stays yours, with full control over what's shared.
            </p>
          </div>
          <div className="group rounded-2xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/20">
            <h3 className="text-lg font-semibold">⚡ Performance</h3>
            <p className="mt-3 text-sm text-gray-600">
              Fast, responsive, and optimized for all devices.
            </p>
          </div>
          <div className="group rounded-2xl border border-black/10 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/20">
            <h3 className="text-lg font-semibold">🎨 Modern Design</h3>
            <p className="mt-3 text-sm text-gray-600">
              A minimalist aesthetic that highlights your content beautifully.
            </p>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="mt-32 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Travel Journal Vision
        </h2>
        <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed text-gray-600 md:text-base">
          I'm building more than just a travel app, I'm creating a space for
          people to preserve and share their most precious journeys. Whether
          you're a weekend traveler or a full-time nomad, Travel Journal is
          designed to grow with you and adapt to your adventures.
        </p>
      </div>
    </section>
  );
}
