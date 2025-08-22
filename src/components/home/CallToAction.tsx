export default function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-28">
      <div className="grid items-stretch gap-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:grid-cols-2 md:p-12">
        <div className="order-2 flex flex-col justify-center md:order-1">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to build your travel journal?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-base">
            Start a trip, add memories, and share a beautiful public page.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/create"
              className="rounded-lg bg-gray-900 px-4 py-2.5 font-semibold text-white no-underline hover:bg-gray-800"
            >
              Create a trip
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(500px_circle_at_0%_100%,#e0f2fe,transparent_40%),radial-gradient(500px_circle_at_100%_0%,#ede9fe,transparent_40%)]" />
            <div className="grid grid-cols-2 gap-3">
              {[
                ["🗺️", "Map pins"],
                ["🖼️", "Photos"],
                ["📝", "Notes"],
                ["🔗", "Share"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/70 p-4 text-center shadow-sm backdrop-blur transition-transform duration-300 will-change-transform group-hover:scale-[1.02]"
                >
                  <div className="text-2xl">{icon}</div>
                  <div className="mt-1 text-xs font-semibold text-gray-700">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
