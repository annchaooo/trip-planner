'use client'

import { useEffect, useRef, useId } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Destination {
  id: string
  city: string
  country: string
  latitude: number
  longitude: number
}

interface TripMapProps {
  destinations: Destination[]
  highlightedId?: string | null
  height?: string
}

// Create custom icons
const createIcon = (isHighlighted: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${isHighlighted ? '32px' : '24px'};
        height: ${isHighlighted ? '32px' : '24px'};
        background: ${isHighlighted ? '#059669' : '#10b981'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        transform: translate(-50%, -50%);
      "></div>
    `,
    iconSize: [isHighlighted ? 32 : 24, isHighlighted ? 32 : 24],
    iconAnchor: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
    popupAnchor: [0, isHighlighted ? -16 : -12],
  })
}

export function TripMap({ destinations, highlightedId, height = '300px' }: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const mapId = useId()
  const isInitializedRef = useRef(false)

  // Create a unique key from destination IDs to detect trip changes
  const destinationKey = destinations.map(d => d.id).sort().join(',')

  // Initialize map - re-run when destinations change (different trip)
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current || destinations.length === 0) return

    // Prevent double initialization in strict mode
    const container = containerRef.current

    // Check if container already has a map
    if ((container as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
      return
    }

    // Clean up existing map first
    if (mapRef.current) {
      try {
        mapRef.current.remove()
      } catch {
        // Ignore errors during cleanup
      }
      mapRef.current = null
      markersRef.current.clear()
    }

    // Small delay to ensure DOM is ready
    const initMap = () => {
      if (!containerRef.current) return

      // Double check container doesn't already have a map
      if ((containerRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) {
        return
      }

      try {
        // Create map
        const map = L.map(containerRef.current)
        mapRef.current = map
        isInitializedRef.current = true

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        // Add markers for each destination
        destinations.forEach((dest) => {
          const marker = L.marker([dest.latitude, dest.longitude], {
            icon: createIcon(false),
          })
            .addTo(map)
            .bindPopup(`<b>${dest.city}</b><br>${dest.country}`)
          markersRef.current.set(dest.id, marker)
        })

        // Draw lines connecting destinations in order (only within this trip)
        if (destinations.length > 1) {
          const latlngs = destinations.map((d) => [d.latitude, d.longitude] as [number, number])
          L.polyline(latlngs, {
            color: '#10b981',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10',
          }).addTo(map)
        }

        // Fit bounds to show all markers
        if (destinations.length === 1) {
          map.setView([destinations[0].latitude, destinations[0].longitude], 10)
        } else {
          const bounds = L.latLngBounds(
            destinations.map((d) => [d.latitude, d.longitude] as [number, number])
          )
          map.fitBounds(bounds, { padding: [30, 30] })
        }
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(initMap)

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch {
          // Ignore errors during cleanup
        }
        mapRef.current = null
        markersRef.current.clear()
        isInitializedRef.current = false
      }
    }
  }, [destinationKey]) // Re-initialize when destinations change

  // Update marker styles when highlighted changes
  useEffect(() => {
    if (!isInitializedRef.current) return

    markersRef.current.forEach((marker, id) => {
      try {
        const isHighlighted = id === highlightedId
        marker.setIcon(createIcon(isHighlighted))
        if (isHighlighted) {
          marker.openPopup()
        }
      } catch {
        // Ignore errors if marker is not ready
      }
    })
  }, [highlightedId])

  if (destinations.length === 0) {
    return (
      <div
        className="bg-gray-100 rounded-xl flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">Add destinations to see them on the map</p>
      </div>
    )
  }

  return (
    <div
      key={mapId}
      ref={containerRef}
      className="rounded-xl overflow-hidden w-full"
      style={{ height }}
    />
  )
}
