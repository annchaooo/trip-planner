import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-xl font-light tracking-widest uppercase">WanderNote</div>
          <Link
            href="/login"
            className="text-sm tracking-wide text-gray-600 hover:text-black transition-colors"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6">
        <section className="py-24 md:py-32 border-b border-gray-200">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide leading-relaxed text-black mb-8">
            Plan your journey.<br />
            Travel with intention.
          </h1>
          <p className="text-gray-700 text-lg font-light max-w-md mb-12 leading-relaxed">
            A simple tool for thoughtful travelers. Plan trips, track spending, discover places.
          </p>
          <Link
            href="/register"
            className="inline-block border border-black px-8 py-3 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
          >
            Begin
          </Link>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            <div>
              <div className="text-xs tracking-widest text-gray-400 uppercase mb-4">01</div>
              <h3 className="text-lg font-light mb-3">Plan</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Create itineraries with destinations and daily activities. See your journey on a map.
              </p>
            </div>

            <div>
              <div className="text-xs tracking-widest text-gray-400 uppercase mb-4">02</div>
              <h3 className="text-lg font-light mb-3">Budget</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Set realistic budgets based on destinations. Track expenses as you travel.
              </p>
            </div>

            <div>
              <div className="text-xs tracking-widest text-gray-400 uppercase mb-4">03</div>
              <h3 className="text-lg font-light mb-3">Discover</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                Find what to see, where to eat, and how to stay safe at each destination.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-400 tracking-wide">WanderNote</p>
        </div>
      </footer>
    </div>
  );
}
