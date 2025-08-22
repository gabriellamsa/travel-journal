type Highlight = {
  title: string;
  description: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    title: "Create trips fast",
    description: "Add title, dates, destination and you're good to go.",
  },
  {
    title: "Attach memories",
    description: "Upload photos and notes to each stop of your journey.",
  },
  {
    title: "Share publicly",
    description: "Publish a clean page for friends and family.",
  },
];

export default function Highlights() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <div className="grid gap-5 md:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
