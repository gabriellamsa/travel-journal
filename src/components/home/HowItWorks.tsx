import Image from "next/image";

type Step = {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Create a trip",
    description: "Add destination, dates, and a short description.",
    features: ["Places", "Activities", "Add notes"],
    image: "/create-trip.jpg",
    icon: "📝",
  },
  {
    id: 2,
    title: "Add memories",
    description: "Upload photos, write notes, and pin places on the map.",
    features: ["Photos", "Notes", "Map pins"],
    image: "/upload-photos.jpg",
    icon: "📷",
  },
  {
    id: 3,
    title: "Share",
    description: "Publish a clean public page with timeline and map.",
    features: ["Public page", "Timeline view"],
    image: "/share-public.jpg",
    icon: "🔗",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-18 pb-24 border-t border-gray-200">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          A simple flow to capture your journeys beautifully.
        </p>
      </div>

      <ol className="space-y-16">
        {STEPS.map((step) => (
          <li
            key={step.id}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
          >
            <div className={step.id === 2 ? "order-1 md:order-2" : "order-1"}>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-base">
                  {step.icon}
                </span>
                Step {step.id}
              </div>
              <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-gray-600 md:text-base">
                {step.description}
              </p>
              <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-700">
                {step.features.map((f, i) => (
                  <li key={f} className="inline-flex items-center">
                    {i > 0 && (
                      <span className="mx-2 inline-block h-1 w-1 rounded-full bg-gray-300" />
                    )}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={step.id === 2 ? "order-2 md:order-1" : "order-2"}>
              <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md transition-shadow hover:shadow-lg">
                <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
