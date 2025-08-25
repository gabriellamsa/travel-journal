export default function Cookies() {
  return (
    <section className="relative w-full py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Cookies Policy
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            This Cookies Policy explains how the Travel Journal uses cookies and
            similar technologies.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-lg ring-1 ring-blue-100">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-0">
              1. What Are Cookies?
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Cookies are small text files stored on your device to enhance your
              browsing experience and ensure proper functionality of the
              platform.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              2. Types of Cookies We Use
            </h2>
            <ul className="space-y-3 mb-6">
              <li className="text-base text-gray-600 leading-relaxed">
                <span className="font-semibold text-blue-600">
                  Essential Cookies
                </span>
                : Required for core functionality, such as authentication and
                session management.
              </li>
              <li className="text-base text-gray-600 leading-relaxed">
                <span className="font-semibold text-blue-600">
                  Preference Cookies
                </span>
                : Store user settings, such as language or display options.
              </li>
              <li className="text-base text-gray-600 leading-relaxed">
                <span className="font-semibold text-blue-600">
                  Performance Cookies
                </span>
                : Collect anonymous data to help us improve speed, reliability,
                and usability.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              3. Use of Cookies
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              We do not use cookies for advertising or third-party tracking. All
              cookies are limited to platform functionality and user experience.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-8">
              4. Cookie Management
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              You can manage or disable cookies through your browser settings.
              However, disabling essential cookies may affect core
              functionality, such as login sessions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
