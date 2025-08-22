export default function Privacy() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-gray-600 md:text-base leading-relaxed">
        This Privacy Policy describes how the Travel Journal (“we,” ” or “the
        platform”) collects, uses, and protects your personal information.
      </p>

      <div className="prose prose-gray mt-10 max-w-none">
        <h2 className="mt-8 mb-4 text-xl font-semibold">1. Data Collection</h2>
        <p className="mb-6 leading-relaxed">
          We collect the information you voluntarily provide, such as trip
          details, notes, photos, and account credentials. Additionally, we may
          automatically collect limited technical information (e.g., browser
          type, operating system, device information) to improve functionality
          and performance.
        </p>

        <h2 className="mt-10 mb-4 text-xl font-semibold">2. Use of Data</h2>
        <p className="mb-4 leading-relaxed">
          Your data is used exclusively for the operation of the platform,
          including:
        </p>
        <ul className="mb-6 space-y-3">
          <li>Enabling the creation and management of trips</li>
          <li>Displaying uploaded photos and notes</li>
          <li>Improving user experience and technical performance</li>
        </ul>
        <p className="mb-6 leading-relaxed">
          We do not sell, rent, or share your information with third parties for
          marketing purposes.
        </p>

        <h2 className="mt-10 mb-4 text-xl font-semibold">3. Data Protection</h2>
        <p className="mb-6 leading-relaxed">
          We apply reasonable technical and organizational measures to safeguard
          your information. However, no system can guarantee complete security.
          By using the platform, you acknowledge these limitations.
        </p>

        <h2 className="mt-10 mb-4 text-xl font-semibold">4. User Rights</h2>
        <p className="mb-6 leading-relaxed">
          You may request access, correction, or deletion of your personal data
          at any time. Since this is a project under continuous development,
          some privacy management features may be limited.
        </p>
      </div>
    </section>
  );
}
