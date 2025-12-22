import Link from 'next/link'

interface TripCardProps {
  trip: {
    id: string
    name: string
    start_date: string
    end_date: string
    budget: number | null
    destinations: { count: number }[]
  }
}

export function TripCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.start_date)
  const endDate = new Date(trip.end_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isPast = endDate < today
  const isOngoing = startDate <= today && endDate >= today
  const destinationCount = trip.destinations?.[0]?.count ?? 0

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDuration = () => {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`
  }

  return (
    <Link href={`/trips/${trip.id}`}>
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${
          isPast
            ? 'border-gray-200 opacity-75'
            : isOngoing
            ? 'border-emerald-500'
            : 'border-transparent hover:border-emerald-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{trip.name}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>
          {isOngoing && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
              Ongoing
            </span>
          )}
          {isPast && (
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{destinationCount} destination{destinationCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{getDuration()}</span>
          </div>
          {trip.budget && (
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>${trip.budget.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
