'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { DestinationForm } from '@/components/destinations/DestinationForm'
import { DestinationCard } from '@/components/destinations/DestinationCard'

// Dynamic import for map (SSR disabled)
const TripMap = dynamic(() => import('@/components/map/TripMap').then((mod) => mod.TripMap), {
  ssr: false,
  loading: () => (
    <div className="bg-stone-100 rounded-lg h-full flex items-center justify-center">
      <p className="text-stone-500">Loading map...</p>
    </div>
  ),
})

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

interface TripDetailClientProps {
  trip: Trip
}

export function TripDetailClient({ trip }: TripDetailClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>(trip.destinations || [])
  const router = useRouter()

  // ✅ Keep local state in sync if trip.destinations changes after router.refresh()
  useEffect(() => {
    setDestinations(trip.destinations || [])
  }, [trip.destinations])

  const handleAddSuccess = () => {
    setShowAddForm(false)
    router.refresh()
  }

  const handleDelete = async (destinationId: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return

    try {
      const response = await fetch(`/api/destinations/${destinationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Optimistic UI update
        setDestinations((prev) => prev.filter((d) => d.id !== destinationId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete destination:', error)
    }
  }

  return (
    <div className="editorial-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-stone-900">Destinations</h2>
          <p className="text-stone-500 text-sm mt-1">
            {destinations.length} destination{destinations.length !== 1 ? 's' : ''} planned
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Destination
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 p-6 bg-stone-50 rounded-lg">
          <DestinationForm
            tripId={trip.id}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {destinations.length > 0 ? (
        <>
          {/* ✅ Map: responsive height that adapts to viewport */}
          <div className="mb-6 h-[360px] sm:h-[420px] lg:h-[70vh]">
            <TripMap destinations={destinations} height="100%" />
          </div>

          {/* Destination Cards */}
          <div className="stories-grid">
            {destinations
              .slice()
              .sort((a, b) => a.order_index - b.order_index)
              .map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        </>
      ) : (
        !showAddForm && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#e7e5e4" strokeWidth="1.5" />
                <circle cx="40" cy="32" r="8" stroke="#1e40af" strokeWidth="1.5" />
                <path d="M40 44 L40 52" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M32 56 C32 52 48 52 48 56"
                  stroke="#4d7c0f"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="font-display text-lg text-stone-900 mb-2">No destinations yet</h3>
            <p className="text-stone-500 mb-6">Add your first destination to start planning</p>

            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add First Destination
            </button>
          </div>
        )
      )}
    </div>
  )
}
