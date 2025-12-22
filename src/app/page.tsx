import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">WanderNote</div>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Log in
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip
            <span className="text-blue-600"> with Smart Budgeting</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            WanderNote helps you organize your travel plans, track expenses, and
            discover amazing destinations. All in one beautiful app.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Plan Your Journey
            </h3>
            <p className="text-gray-600">
              Create detailed itineraries with destinations, activities, and
              interactive maps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Budgeting
            </h3>
            <p className="text-gray-600">
              Get location-based budget recommendations and track your expenses
              in real-time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Discover More
            </h3>
            <p className="text-gray-600">
              Find the best attractions, local food, and safety tips for your
              destinations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>&copy; 2024 WanderNote. Plan your adventure.</p>
      </footer>
    </div>
  );
}
