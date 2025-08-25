import Image from "next/image";

type Step = {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: string;
  gradient: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Create a trip",
    description:
      "Add destination, dates, and a short description to get started with your journey.",
    features: ["Places", "Activities", "Add notes"],
    image: "/create-trip.jpg",
    icon: "📝",
    gradient: "from-blue-300 to-blue-400",
  },
  {
    id: 2,
    title: "Add memories",
    description:
      "Upload photos, write notes, and pin places on the map to capture every moment.",
    features: ["Photos", "Notes", "Map pins"],
    image: "/upload-photos.jpg",
    icon: "📷",
    gradient: "from-green-300 to-green-400",
  },
  {
    id: 3,
    title: "Share your journey",
    description:
      "Publish a clean public page with timeline and map to share with friends and family.",
    features: ["Public page", "Timeline view", "Beautiful design"],
    image: "/share-public.jpg",
    icon: "🔗",
    gradient: "from-pink-300 to-pink-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full py-8 lg:py-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            How it <span className="text-blue-500">works</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            A simple three-step process to capture and share your journeys
            beautifully.
          </p>
        </div>

        <ol className="space-y-12">
          {STEPS.map((step) => (
            <li key={step.id} className="group relative">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div
                  className={step.id === 2 ? "order-1 lg:order-2" : "order-1"}
                >
                  {/* Step number background - posicionado em relação ao texto */}
                  <div className="relative pl-20">
                    <div className="absolute left-0 top-0 hidden lg:block">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r ${step.gradient} text-xl font-bold text-white shadow-lg`}
                      >
                        {step.id}
                      </div>
                    </div>

                    <div className="mb-6 flex items-center gap-3">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${step.gradient} text-white shadow-lg lg:hidden`}
                      >
                        <span className="text-lg">{step.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Step {step.id}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 lg:text-2xl">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="pl-20">
                    <p className="text-base text-gray-600 leading-relaxed mb-6">
                      {step.description}
                    </p>

                    <ul className="flex flex-wrap items-center gap-3">
                      {step.features.map((feature, index) => (
                        <li key={feature}>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={step.id === 2 ? "order-2 lg:order-1" : "order-2"}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-blue-100 transition-all duration-300 hover:shadow-2xl">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Floating icon */}
                    <div
                      className={`absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${step.gradient} text-white shadow-lg`}
                    >
                      <span className="text-xs">{step.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/demo/create-trip"
            className="inline-flex items-center gap-3 rounded-full bg-blue-400 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:scale-105"
          >
            <svg
              className="h-4 w-4"
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
            <span>Try it now</span>
          </a>
        </div>
      </div>
    </section>
  );
}
