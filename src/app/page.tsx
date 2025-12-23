import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <circle cx="16" cy="16" r="14" stroke="#1e40af" strokeWidth="1.5" />
              <path d="M10 20 L16 10 L22 20" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 16 L16 11 L19 16" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold text-[#1e40af]">WanderNote</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-stone-600 font-medium hover:text-[#1e40af] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-[#1e40af] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-px bg-[#4d7c0f]"></div>
              <span className="text-[#4d7c0f] text-xl">✦</span>
              <div className="w-12 h-px bg-[#4d7c0f]"></div>
            </div>

            <p className="font-meta text-[#1e40af] mb-4">Travel Journal</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-6 leading-tight">
              Stories Worth Telling,<br />
              <span className="text-[#1e40af]">Journeys Worth Remembering</span>
            </h1>
            <p className="text-lg text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create personalized travel journals, capture your adventures with photos and essays, and preserve the memories that matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-[#1e40af] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1e3a8a] transition-all"
              >
                Begin Your Journey
              </Link>
              <Link
                href="#features"
                className="bg-white text-stone-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-stone-100 transition-all border border-stone-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="rule-line max-w-xs mx-auto mb-8" />
            <p className="font-meta text-[#4d7c0f] mb-3">Features</p>
            <h2 className="font-display text-3xl md:text-4xl text-stone-900 mb-4">
              Everything You Need to Document Your Adventures
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Powerful features designed to make your travel documentation seamless and beautiful.
            </p>
            <div className="rule-line max-w-xs mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="editorial-card p-8">
              <div className="w-14 h-14 bg-[#1e40af]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#1e40af]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-3">
                Journey Notes
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Write essays, capture highlights, and document your experiences with rich text entries and beautiful photography.
              </p>
            </div>

            {/* Card 2 */}
            <div className="editorial-card p-8">
              <div className="w-14 h-14 bg-[#4d7c0f]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#4d7c0f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-3">
                Budget Tracking
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Set trip budgets, track expenses by category, and stay on top of your travel spending in real-time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="editorial-card p-8">
              <div className="w-14 h-14 bg-[#1e40af]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#1e40af]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-stone-900 mb-3">
                Trip Planning
              </h3>
              <p className="text-stone-500 leading-relaxed">
                Organize your trips with destinations, dates, and itineraries. Plan themed adventures for solo or group travel.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#1e40af] py-16 mt-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="font-display text-4xl md:text-5xl mb-2">50+</div>
                <div className="text-blue-200 font-meta">Destinations</div>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl mb-2">10K+</div>
                <div className="text-blue-200 font-meta">Happy Travelers</div>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl mb-2">4.9</div>
                <div className="text-blue-200 font-meta">User Rating</div>
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl mb-2">24/7</div>
                <div className="text-blue-200 font-meta">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-[#4d7c0f] rounded-2xl p-10 md:p-16 text-center">
            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-white/30"></div>
              <span className="text-white/60 text-lg">✦</span>
              <div className="w-8 h-px bg-white/30"></div>
            </div>

            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of travelers who document their journeys with WanderNote.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-[#4d7c0f] px-10 py-4 rounded-lg font-bold text-lg hover:bg-stone-100 transition-all"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                <circle cx="16" cy="16" r="14" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M10 20 L16 10 L22 20" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 16 L16 11 L19 16" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold">WanderNote</span>
            </div>
            <div className="flex gap-8 text-stone-400">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <p className="text-stone-500 text-sm">
              © 2024 WanderNote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
