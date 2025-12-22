import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TripDetailClient } from './TripDetailClient'

interface Destination {
  id: string
  city: string
  country: string
  start_date: string | null
  end_date: string | null
  latitude: number
  longitude: number
  order_index: number
}

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  budget: number | null
  destinations: Destination[]
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .select(`
      *,
      destinations (*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) {
    notFound()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDuration = () => {
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`
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
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <span>←</span> Back to Dashboard
          </Link>
        </div>

        {/* Trip Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
              <p className="text-gray-600 mt-2">
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">{getDuration()}</p>
              </div>
              {trip.budget && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold text-emerald-600">${trip.budget.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/trips/${trip.id}/itinerary`}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
            >
              View Itinerary
            </Link>
            <Link
              href={`/trips/${trip.id}/budget`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Manage Budget
            </Link>
            <Link
              href={`/trips/${trip.id}/notes`}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              Journey Notes
            </Link>
          </div>
        </div>

        {/* Destinations Section - Client Component */}
        <TripDetailClient trip={trip as Trip} />
      </main>
    </div>
  )
}
