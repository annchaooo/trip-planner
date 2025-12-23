import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ItineraryClient } from './ItineraryClient'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

interface Activity {
  id: string
  destination_id: string
  date: string
  name: string
  time: string | null
  location: string | null
  notes: string | null
  order_index: number
}

interface Destination {
  id: string
  city: string
  country: string
  start_date: string | null
  end_date: string | null
  latitude: number
  longitude: number
  activities: Activity[]
}

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  destinations: Destination[]
}

export default async function ItineraryPage({
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
      destinations (
        *,
        activities (*)
      )
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

  return (
    <EditorialLayout userEmail={user.email}>
      {/* ✅ 讓頁面跟著瀏覽器變寬：移除 content-well、max-width 限制 */}
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-10 lg:py-14">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/trips/${trip.id}`}
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
            Back to {trip.name}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10 lg:mb-12">
          <div className="rule-line mb-8" />

          <div className="text-center">
            <p className="font-meta text-[#4d7c0f] mb-2">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              Itinerary
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Plan your daily activities for {trip.name}.
            </p>
          </div>

          <div className="rule-line mt-8" />
        </header>

        {/* Itinerary Content */}
        <ItineraryClient trip={trip as Trip} />
      </div>
    </EditorialLayout>
  )
}
