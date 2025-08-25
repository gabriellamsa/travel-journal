type Highlight = {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    title: "Beautiful Maps",
    description:
      "Interactive maps with custom pins and routes. Visualize your journey like never before.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
        />
      </svg>
    ),
    gradient: "from-blue-300 to-blue-400",
  },
  {
    title: "Timeline View",
    description:
      "Chronological journey timeline with photos and memories. Relive your adventures in order.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    gradient: "from-green-300 to-green-400",
  },
  {
    title: "Public Sharing",
    description:
      "Create stunning public pages to share with friends and family. Let them experience your journey.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
        />
      </svg>
    ),
    gradient: "from-pink-300 to-pink-400",
  },
];

export default function Highlights() {
  return (
    <section className="relative w-full py-12 lg:py-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Everything you need to{" "}
            <span className="text-blue-500">showcase your travels</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            From interactive maps to beautiful timelines, we provide all the
            tools to make your travel stories unforgettable.
          </p>
        </div>

        {/* Highlights grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Icon with gradient background */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>

              {/* Decorative element */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.gradient} opacity-5 rounded-bl-full transition-opacity duration-300 group-hover:opacity-10`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
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
            <span className="text-sm font-medium">
              Ready to explore these features?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
