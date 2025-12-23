interface ActivityCardProps {
  activity: {
    id: string
    name: string
    time: string | null
    location: string | null
    notes: string | null
  }
  onDelete?: (id: string) => void
  destinationName?: string
}

export function ActivityCard({ activity, onDelete, destinationName }: ActivityCardProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="bg-white rounded-lg border border-stone-100 p-3 hover:shadow-sm transition-shadow ml-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {activity.time && (
              <span className="text-[#1e40af] font-medium text-sm">
                {formatTime(activity.time)}
              </span>
            )}
            <span className="font-medium text-stone-900">{activity.name}</span>
            {destinationName && (
              <span className="text-xs bg-[#4d7c0f]/10 text-[#4d7c0f] px-2 py-0.5 rounded-lg font-meta">
                {destinationName}
              </span>
            )}
          </div>
          {activity.location && (
            <p className="text-stone-500 text-sm mt-1 flex items-center gap-1">
              <span className="text-[#4d7c0f]">*</span> {activity.location}
            </p>
          )}
          {activity.notes && (
            <p className="text-stone-500 text-sm mt-1">{activity.notes}</p>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(activity.id)}
            className="text-stone-400 hover:text-red-500 transition-colors p-1 ml-2"
            title="Delete activity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
