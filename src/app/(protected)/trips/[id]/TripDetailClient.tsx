'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { DestinationForm } from '@/components/destinations/DestinationForm'
import { DestinationCard } from '@/components/destinations/DestinationCard'

// Dynamic import for map (SSR disabled)
const TripMap = dynamic(() => import('@/components/map/TripMap').then(mod => mod.TripMap), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
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
  const [destinations, setDestinations] = useState(trip.destinations || [])
  const router = useRouter()

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
        setDestinations(destinations.filter(d => d.id !== destinationId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete destination:', error)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Destinations</h2>
          <p className="text-gray-600 text-sm mt-1">
            {destinations.length} destination{destinations.length !== 1 ? 's' : ''} planned
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
          >
            + Add Destination
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <DestinationForm
            tripId={trip.id}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {destinations.length > 0 ? (
        <>
          {/* Map */}
          <div className="mb-6">
            <TripMap destinations={destinations} height="400px" />
          </div>

          {/* Destination Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations
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
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No destinations yet</h3>
            <p className="text-gray-600 mb-4">Add your first destination to start planning</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Add First Destination
            </button>
          </div>
        )
      )}
    </div>
  )
}
