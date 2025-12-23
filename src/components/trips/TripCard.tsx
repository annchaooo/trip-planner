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
    })
  }

  const getDuration = () => {
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`
  }

  return (
    <Link href={`/trips/${trip.id}`}>
      <article className="editorial-card p-6 h-full">
        {/* Date Eyebrow */}
        <p className="font-meta text-stone-400 mb-3">
          {formatDate(startDate)} – {formatDate(endDate)}, {startDate.getFullYear()}
        </p>

        {/* Title */}
        <h3 className="font-display text-xl text-stone-900 mb-3">
          {trip.name}
        </h3>

        {/* Status Badge */}
        {isOngoing && (
          <span className="inline-flex items-center gap-1.5 font-meta px-2.5 py-1 rounded-lg bg-[#4d7c0f]/10 text-[#4d7c0f] mb-4">
            <span className="w-1.5 h-1.5 bg-[#4d7c0f] rounded-full animate-pulse" />
            In Progress
          </span>
        )}
        {isPast && (
          <span className="inline-flex font-meta px-2.5 py-1 rounded-lg bg-stone-100 text-stone-500 mb-4">
            Completed
          </span>
        )}

        {/* Rule Line */}
        <div className="rule-line my-4" />

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#4d7c0f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{destinationCount} destination{destinationCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#1e40af]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{getDuration()}</span>
          </div>
          {trip.budget && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>${trip.budget.toLocaleString()}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
