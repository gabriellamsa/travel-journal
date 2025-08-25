export default function Privacy() {
  return (
    <section className="relative w-full py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            This Privacy Policy describes how the Travel Journal ("we" or "the
            platform") collects, uses, and protects your personal information.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg ring-1 ring-blue-100">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-0">
              1. Data Collection
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              We collect the information you voluntarily provide, such as trip
              details, notes, photos, and account credentials. Additionally, we
              may automatically collect limited technical information (e.g.,
              browser type, operating system, device information) to improve
              functionality and performance.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              2. Use of Data
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              Your data is used exclusively for the operation of the platform,
              including:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="text-base text-gray-600 leading-relaxed">
                Enabling the creation and management of trips
              </li>
              <li className="text-base text-gray-600 leading-relaxed">
                Displaying uploaded photos and notes
              </li>
              <li className="text-base text-gray-600 leading-relaxed">
                Improving user experience and technical performance
              </li>
            </ul>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              We do not sell, rent, or share your information with third parties
              for marketing purposes.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              3. Data Protection
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              We apply reasonable technical and organizational measures to
              safeguard your information. However, no system can guarantee
              complete security. By using the platform, you acknowledge these
              limitations.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              4. User Rights
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              You may request access, correction, or deletion of your personal
              data at any time. Since this is a project under continuous
              development, some privacy management features may be limited.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
