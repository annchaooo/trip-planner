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
    <div className="bg-stone-100 rounded-lg h-[300px] flex items-center justify-center">
      <p className="text-stone-500">Loading map...</p>
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
      <div className="editorial-card p-12 text-center">
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
        <p className="text-stone-500 mb-6">Add destinations to your trip first</p>
        <a
          href={`/trips/${trip.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
        >
          Add Destinations
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Map with Destinations */}
      <div className="editorial-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-stone-900">Trip Map</h2>
          <p className="text-sm text-stone-500">
            {trip.destinations.length} destination{trip.destinations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ✅ 改成：Map 全寬在上，Destinations 在下 */}
        <div className="space-y-6">
          {/* Map (full width, bigger & responsive height) */}
          <div className="w-full">
            {/* 手機不要太高、桌機用 vh 跟著螢幕變化 */}
            <TripMap
              destinations={trip.destinations}
              highlightedId={highlightedDestination}
              height="70vh"
            />
            <p className="text-xs text-stone-400 mt-2 text-center">
              Hover a destination (or a day card) to highlight it on the map
            </p>
          </div>

          {/* Destinations below the map */}
          <div className="space-y-2">
            <p className="font-meta text-stone-500 text-sm mb-1">Destinations</p>

            {/* ✅ 用 grid 讓閱讀更好：桌機更密、手機不擠 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {trip.destinations.map((dest, index) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    setSelectedDestination(dest.id)
                    setHighlightedDestination(dest.id)
                  }}
                  onMouseEnter={() => setHighlightedDestination(dest.id)}
                  onMouseLeave={() => setHighlightedDestination(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    selectedDestination === dest.id
                      ? 'bg-[#1e40af]/10 border border-[#1e40af]/30'
                      : 'hover:bg-stone-50 border border-stone-200'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      selectedDestination === dest.id
                        ? 'bg-[#1e40af] text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900 truncate">{dest.city}</p>
                    <p className="text-xs text-stone-500 truncate">{dest.country}</p>
                  </div>

                  {dest.start_date && dest.end_date && (
                    <span className="text-xs text-stone-400 whitespace-nowrap">
                      {new Date(dest.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' - '}
                      {new Date(dest.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <p className="text-xs text-stone-400 mt-2 text-center">
              Click a destination to add activities for it
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Day-by-Day Itinerary */}
      <div className="editorial-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg text-stone-900">Itinerary</h2>
          <p className="text-sm text-stone-500">
            {days.length} day{days.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day, index) => {
            const { day: dayLabel, date } = formatDayHeader(day, index)
            const dayActivities = activitiesByDate[day] || []
            const dayDestination = getDestinationForDay(day, dayActivities)

            return (
              <div
                key={day}
                className="border border-stone-200 rounded-lg overflow-hidden"
                onMouseEnter={() => dayDestination && setHighlightedDestination(dayDestination.id)}
                onMouseLeave={() => setHighlightedDestination(null)}
              >
                {/* Day Header */}
                <div className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-display">{dayLabel}</h3>
                      <p className="text-blue-200 text-xs">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {dayDestination && (
                        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <span className="text-[#4d7c0f]">*</span> {dayDestination.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="p-4">
                  {dayActivities.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {dayActivities.map((activity) => {
                        const activityDest = destinationMap[activity.destination_id]
                        return (
                          <div key={activity.id} className="relative">
                            {activityDest && (
                              <span className="absolute -left-1 top-0 w-0.5 h-full bg-[#4d7c0f] rounded-full" />
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

                  {dayActivities.length === 0 && !addingActivityForDay && (
                    <p className="text-stone-400 text-sm text-center py-2">No activities planned</p>
                  )}

                  {addingActivityForDay === day && selectedDestination ? (
                    <div className="p-3 bg-stone-50 rounded-lg">
                      <ActivityForm
                        destinationId={selectedDestination}
                        date={day}
                        destinationCity={destinationMap[selectedDestination]?.city}
                        onSuccess={handleAddSuccess}
                        onCancel={() => setAddingActivityForDay(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingActivityForDay(day)}
                      className="w-full py-2 border border-dashed border-stone-200 rounded-lg text-stone-500 hover:border-[#1e40af] hover:text-[#1e40af] transition-colors text-sm font-medium"
                    >
                      + Add Activity
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
