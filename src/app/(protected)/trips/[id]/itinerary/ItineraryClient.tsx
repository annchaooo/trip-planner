'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ActivityForm } from '@/components/activities/ActivityForm'
import { ActivityCard } from '@/components/activities/ActivityCard'

// Dynamic import for map (SSR disabled)
const TripMap = dynamic(() => import('@/components/map/TripMap').then(mod => mod.TripMap), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 rounded-xl h-[300px] flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

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
  latitude: number
  longitude: number
  start_date: string | null
  end_date: string | null
  activities: Activity[]
}

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  destinations: Destination[]
}

interface ItineraryClientProps {
  trip: Trip
}

function getTripDays(startDate: string, endDate: string): string[] {
  const days: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return days
}

// Get destination for a specific date based on destination date range
function getDestinationForDate(destinations: Destination[], date: string): Destination | null {
  for (const dest of destinations) {
    if (dest.start_date && dest.end_date) {
      if (date >= dest.start_date && date <= dest.end_date) {
        return dest
      }
    }
  }
  // If no date range matches, return first destination as default
  return destinations.length > 0 ? destinations[0] : null
}

export function ItineraryClient({ trip }: ItineraryClientProps) {
  const [addingActivityForDay, setAddingActivityForDay] = useState<string | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    trip.destinations.length > 0 ? trip.destinations[0].id : null
  )
  const [highlightedDestination, setHighlightedDestination] = useState<string | null>(null)
  const router = useRouter()

  const days = getTripDays(trip.start_date, trip.end_date)

  // Create a map of destination id to destination
  const destinationMap: Record<string, Destination> = {}
  trip.destinations.forEach((dest) => {
    destinationMap[dest.id] = dest
  })

  // Get all activities across all destinations, grouped by date
  const activitiesByDate: Record<string, Activity[]> = {}
  trip.destinations.forEach((dest) => {
    dest.activities?.forEach((activity) => {
      if (!activitiesByDate[activity.date]) {
        activitiesByDate[activity.date] = []
      }
      activitiesByDate[activity.date].push(activity)
    })
  })

  // Sort activities by time within each day
  Object.keys(activitiesByDate).forEach((date) => {
    activitiesByDate[date].sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })
  })

  const handleAddSuccess = () => {
    setAddingActivityForDay(null)
    router.refresh()
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Delete this activity?')) return

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete activity:', error)
    }
  }

  const formatDayHeader = (dateStr: string, index: number) => {
    const date = new Date(dateStr)
    return {
      day: `Day ${index + 1}`,
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    }
  }

  // Get the destination for a day (based on activity or date range)
  const getDestinationForDay = (day: string, activities: Activity[]): Destination | null => {
    // If there are activities, use the first activity's destination
    if (activities.length > 0) {
      return destinationMap[activities[0].destination_id] || null
    }
    // Otherwise try to match by destination date range
    return getDestinationForDate(trip.destinations, day)
  }

  if (trip.destinations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📍</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No destinations yet</h3>
        <p className="text-gray-600 mb-4">Add destinations to your trip first</p>
        <a
          href={`/trips/${trip.id}`}
          className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
        >
          Add Destinations
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Map & Destinations */}
      <div className="lg:col-span-1 space-y-6">
        {/* Map */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Trip Map</h2>
          <TripMap
            destinations={trip.destinations}
            highlightedId={highlightedDestination}
          />

          {/* Destination Legend */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Destinations</h3>
            {trip.destinations.map((dest, index) => (
              <button
                key={dest.id}
                onClick={() => {
                  setSelectedDestination(dest.id)
                  setHighlightedDestination(dest.id)
                }}
                onMouseEnter={() => setHighlightedDestination(dest.id)}
                onMouseLeave={() => setHighlightedDestination(null)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                  selectedDestination === dest.id
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedDestination === dest.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{dest.city}</p>
                  <p className="text-xs text-gray-500">{dest.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Day-by-Day Itinerary */}
      <div className="lg:col-span-2 space-y-4">
        {days.map((day, index) => {
          const { day: dayLabel, date } = formatDayHeader(day, index)
          const dayActivities = activitiesByDate[day] || []
          const dayDestination = getDestinationForDay(day, dayActivities)

          return (
            <div
              key={day}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              onMouseEnter={() => dayDestination && setHighlightedDestination(dayDestination.id)}
              onMouseLeave={() => setHighlightedDestination(null)}
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg">{dayLabel}</h3>
                    <p className="text-emerald-100 text-sm">{date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {dayDestination && (
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span>📍</span> {dayDestination.city}
                      </span>
                    )}
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      {dayActivities.length} activit{dayActivities.length === 1 ? 'y' : 'ies'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="p-6">
                {dayActivities.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {dayActivities.map((activity) => {
                      const activityDest = destinationMap[activity.destination_id]
                      return (
                        <div key={activity.id} className="relative">
                          {activityDest && (
                            <span className="absolute -left-2 top-0 w-1 h-full bg-emerald-300 rounded-full" />
                          )}
                          <ActivityCard
                            activity={activity}
                            onDelete={handleDeleteActivity}
                            destinationName={activityDest?.city}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}

                {addingActivityForDay === day && selectedDestination ? (
                  <ActivityForm
                    destinationId={selectedDestination}
                    date={day}
                    destinationCity={destinationMap[selectedDestination]?.city}
                    onSuccess={handleAddSuccess}
                    onCancel={() => setAddingActivityForDay(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingActivityForDay(day)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors font-medium"
                  >
                    + Add Activity to {dayLabel}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
