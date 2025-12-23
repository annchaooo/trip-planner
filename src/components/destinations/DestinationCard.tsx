interface DestinationCardProps {
  destination: {
    id: string
    city: string
    country: string
    start_date: string | null
    end_date: string | null
    latitude: number
    longitude: number
  }
  onDelete?: (id: string) => void
}

export function DestinationCard({ destination, onDelete }: DestinationCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="editorial-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display text-stone-900">{destination.city}</h4>
          <p className="text-stone-500 text-sm">{destination.country}</p>
          {destination.start_date && destination.end_date && (
            <p className="text-[#4d7c0f] text-sm mt-1 font-meta">
              {formatDate(destination.start_date)} - {formatDate(destination.end_date)}
            </p>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(destination.id)}
            className="text-stone-400 hover:text-red-500 transition-colors p-1"
            title="Delete destination"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
