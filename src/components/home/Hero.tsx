import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            Your interactive travel journal
          </h1>
          <p className="text-base text-gray-600 md:text-lg">
            Record trips, add memories, and share a beautiful public page for
            each journey.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/create"
              className="rounded-lg bg-gray-900 px-4 py-2.5 font-semibold text-white no-underline hover:bg-gray-800"
            >
              Create a trip
            </a>
            <a
              href="/trips"
              className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-900 no-underline hover:bg-gray-100"
            >
              Explore trips
            </a>
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src="/map-preview.png"
              alt="Map preview with location pins"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Map preview image. Mapbox integration coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
