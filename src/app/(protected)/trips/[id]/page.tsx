import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TripDetailClient } from './TripDetailClient'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .select(
      `
      *,
      destinations (*)
    `
    )
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) {
    notFound()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
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
    <EditorialLayout userEmail={user.email}>
      {/* ✅ 讓整頁跟著瀏覽器變寬：移除 content-well 限制 */}
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-10 lg:py-14">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#1e40af] hover:text-[#1e3a8a] font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Journeys
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="rule-line mb-8" />

          <div className="text-center">
            <p className="font-meta text-[#4d7c0f] mb-2">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              {trip.name}
            </h1>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="text-center">
              <p className="font-display text-2xl text-stone-900">{getDuration()}</p>
              <p className="font-meta text-stone-400">Duration</p>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <p className="font-display text-2xl text-stone-900">
                {(trip.destinations || []).length}
              </p>
              <p className="font-meta text-stone-400">Destinations</p>
            </div>

            {/* ✅ budget=0 也要能顯示 */}
            {trip.budget !== null && (
              <>
                <div className="w-px h-10 bg-stone-200" />
                <div className="text-center">
                  <p className="font-display text-2xl text-[#4d7c0f]">
                    ${trip.budget.toLocaleString()}
                  </p>
                  <p className="font-meta text-stone-400">Budget</p>
                </div>
              </>
            )}
          </div>

          <div className="rule-line mt-8" />
        </header>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link
            href={`/trips/${trip.id}/itinerary`}
            className="px-5 py-2.5 bg-[#1e40af]/10 text-[#1e40af] rounded-lg font-medium hover:bg-[#1e40af]/20 transition-colors"
          >
            View Itinerary
          </Link>
          <Link
            href={`/trips/${trip.id}/budget`}
            className="px-5 py-2.5 bg-[#4d7c0f]/10 text-[#4d7c0f] rounded-lg font-medium hover:bg-[#4d7c0f]/20 transition-colors"
          >
            Manage Budget
          </Link>
          <Link
            href={`/trips/${trip.id}/notes`}
            className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Journey Notes
          </Link>
        </div>

        {/* Destinations Section - Client Component */}
        <TripDetailClient trip={trip as Trip} />
      </div>
    </EditorialLayout>
  )
}
