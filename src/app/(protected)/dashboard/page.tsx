import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TripCard } from '@/components/trips/TripCard'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  budget: number | null
  destinations: { count: number }[]
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's trips
  const { data: trips } = await supabase
    .from('trips')
    .select(`
      *,
      destinations(count)
    `)
    .eq('user_id', user.id)
    .order('start_date', { ascending: true })

  const hasTrips = trips && trips.length > 0

  return (
    <EditorialLayout userEmail={user.email}>
      <div className="content-well px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <header className="mb-12">
          {/* Top Rule */}
          <div className="rule-line mb-8" />

          {/* Page Title */}
          <div className="text-center">
            <p className="font-meta text-[#1e40af] mb-2">Travel Journal</p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900">
              My Journeys
            </h1>
            <p className="text-stone-500 mt-3 max-w-md mx-auto">
              Plan your adventures and capture the stories that matter.
            </p>
          </div>

          {/* Bottom Rule */}
          <div className="rule-line mt-8" />
        </header>

        {hasTrips ? (
          <section>
            {/* Stats Bar with Action */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <p className="font-display text-2xl text-stone-900">{trips.length}</p>
                <p className="font-meta text-stone-400">Journeys</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="text-center">
                <p className="font-display text-2xl text-stone-900">
                  {trips.filter((t: Trip) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const start = new Date(t.start_date)
                    const end = new Date(t.end_date)
                    return start <= today && end >= today
                  }).length}
                </p>
                <p className="font-meta text-stone-400">Active</p>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="text-center">
                <p className="font-display text-2xl text-stone-900">
                  {trips.reduce((sum: number, t: Trip) => sum + (t.destinations?.[0]?.count ?? 0), 0)}
                </p>
                <p className="font-meta text-stone-400">Destinations</p>
              </div>
              </div>

              <Link
                href="/trips/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Plan Your Trip
              </Link>
            </div>

            {/* Trips Grid */}
            <div className="stories-grid">
              {(trips as Trip[]).map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#e7e5e4" strokeWidth="1.5" />
                <path d="M28 50 L40 30 L52 50" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34 42 L40 32 L46 42" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="font-display text-2xl text-stone-900 mb-3">
              Begin Your Journey
            </h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Every great adventure starts with a single step. Create your first trip to begin.
            </p>

            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Plan Your First Trip
            </Link>
          </div>
        )}
      </div>
    </EditorialLayout>
  )
}
