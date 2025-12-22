import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✈</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WanderNote</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to WanderNote!</h1>
          <p className="text-gray-600 mt-2">Start planning your next adventure</p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🗺️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No trips yet</h2>
          <p className="text-gray-600 mb-6">Create your first trip to start planning your adventure</p>
          <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
            Create New Trip
          </button>
        </div>
      </main>
    </div>
  )
}
