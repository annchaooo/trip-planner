'use client'

import { useState } from 'react'
import { geocodeCityCountry } from '@/lib/geocoding'

interface DestinationFormProps {
  tripId: string
  onSuccess: () => void
  onCancel: () => void
}

export function DestinationForm({ tripId, onSuccess, onCancel }: DestinationFormProps) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [geocodingStatus, setGeocodingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!city.trim() || !country.trim()) {
      setError('City and country are required')
      setLoading(false)
      return
    }

    // Geocode the location
    setGeocodingStatus('loading')
    const coords = await geocodeCityCountry(city.trim(), country.trim())

    if (!coords) {
      setError(`Could not find location "${city}, ${country}". Please check the spelling.`)
      setGeocodingStatus('error')
      setLoading(false)
      return
    }

    setGeocodingStatus('success')

    try {
      const response = await fetch(`/api/trips/${tripId}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.trim(),
          country: country.trim(),
          latitude: coords.lat,
          longitude: coords.lng,
          start_date: startDate || null,
          end_date: endDate || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add destination')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-display text-lg text-stone-900 mb-4">Add Destination</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="font-meta text-stone-500 block mb-2">
              City *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setGeocodingStatus('idle')
              }}
              placeholder="e.g., Tokyo, Paris, New York"
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
            />
          </div>

          <div>
            <label htmlFor="country" className="font-meta text-stone-500 block mb-2">
              Country *
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                setGeocodingStatus('idle')
              }}
              placeholder="e.g., Japan, France, USA"
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
            />
          </div>
        </div>

        {geocodingStatus === 'success' && (
          <div className="flex items-center gap-2 text-[#4d7c0f] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Location found on map
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="font-meta text-stone-500 block mb-2">
              Start Date (optional)
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="font-meta text-stone-500 block mb-2">
              End Date (optional)
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1e40af] text-white py-3 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {geocodingStatus === 'loading' ? 'Finding location...' : 'Adding...'}
              </span>
            ) : (
              'Add Destination'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
