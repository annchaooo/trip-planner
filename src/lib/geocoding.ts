// Geocoding service using Nominatim (OpenStreetMap) - free, no API key required
// Rate limit: 1 request per second

interface GeocodingResult {
  lat: number
  lng: number
  displayName: string
}

export async function geocodeLocation(query: string): Promise<GeocodingResult | null> {
  try {
    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`,
      {
        headers: {
          'User-Agent': 'WanderNote/1.0 (travel planning app)',
        },
      }
    )

    if (!response.ok) {
      console.error('Geocoding request failed:', response.status)
      return null
    }

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export async function geocodeCityCountry(city: string, country: string): Promise<GeocodingResult | null> {
  return geocodeLocation(`${city}, ${country}`)
}
