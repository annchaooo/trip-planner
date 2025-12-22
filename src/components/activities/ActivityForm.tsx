'use client'

import { useState } from 'react'
import { geocodeLocation } from '@/lib/geocoding'

interface ActivityFormProps {
  destinationId: string
  date: string
  destinationCity?: string
  onSuccess: () => void
  onCancel: () => void
}

export function ActivityForm({ destinationId, date, destinationCity, onSuccess, onCancel }: ActivityFormProps) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!name.trim()) {
      setError('Activity name is required')
      setLoading(false)
      return
    }

    let latitude: number | null = null
    let longitude: number | null = null

    // If location is provided, try to geocode it
    if (location.trim()) {
      setLocationStatus('loading')
      // Search with destination city context for better results
      const searchQuery = destinationCity
        ? `${location.trim()}, ${destinationCity}`
        : location.trim()

      const coords = await geocodeLocation(searchQuery)

      if (coords) {
        latitude = coords.lat
        longitude = coords.lng
        setLocationStatus('found')
      } else {
        // Try without city context
        const fallbackCoords = await geocodeLocation(location.trim())
        if (fallbackCoords) {
          latitude = fallbackCoords.lat
          longitude = fallbackCoords.lng
          setLocationStatus('found')
        } else {
          setLocationStatus('not_found')
          // Continue anyway - location text is still saved
        }
      }
    }

    try {
      const response = await fetch(`/api/destinations/${destinationId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          name: name.trim(),
          time: time || null,
          location: location.trim() || null,
          notes: notes.trim() || null,
          latitude,
          longitude,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add activity')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Activity name (e.g., Visit Eiffel Tower) *"
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 text-sm"
            placeholder="Time"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setLocationStatus('idle')
            }}
            placeholder="Location/Attraction"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
          />
          {locationStatus === 'found' && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {locationStatus === 'found' && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <span>📍</span> Location will be shown on map
        </p>
      )}

      {locationStatus === 'not_found' && location.trim() && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <span>⚠️</span> Location not found on map, but will be saved as text
        </p>
      )}

      <div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400 text-sm resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-500 text-white px-3 py-2 text-sm rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {locationStatus === 'loading' ? 'Finding...' : 'Adding...'}
            </span>
          ) : (
            'Add'
          )}
        </button>
      </div>
    </form>
  )
}
