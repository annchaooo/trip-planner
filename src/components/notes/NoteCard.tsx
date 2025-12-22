'use client'

import { useState } from 'react'
import Image from 'next/image'

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; gradient: string }> = {
  note: { icon: '📝', color: 'text-blue-600', bg: 'bg-blue-100', gradient: 'from-blue-500 to-blue-600' },
  essay: { icon: '✍️', color: 'text-purple-600', bg: 'bg-purple-100', gradient: 'from-purple-500 to-pink-500' },
  highlight: { icon: '⭐', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-500 to-orange-500' },
  photo: { icon: '📷', color: 'text-pink-600', bg: 'bg-pink-100', gradient: 'from-pink-500 to-rose-500' },
}

const MOOD_ICONS: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  peaceful: '😌',
  adventurous: '🧗',
  amazed: '😮',
  tired: '😴',
}

interface Note {
  id: string
  title: string
  content: string | null
  type: string
  mood: string | null
  date: string
  location: string | null
  image_url: string | null
  is_favorite: boolean
  destinations: { city: string; country: string } | null
}

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
  onToggleFavorite: (id: string, isFavorite: boolean) => void
}

export function NoteCard({ note, onDelete, onToggleFavorite }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [liked, setLiked] = useState(note.is_favorite)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const config = TYPE_CONFIG[note.type] || TYPE_CONFIG.note

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true)
      setLikeAnimation(true)
      onToggleFavorite(note.id, true)
      setTimeout(() => setLikeAnimation(false), 1000)
    }
  }

  const handleLikeClick = () => {
    const newLiked = !liked
    setLiked(newLiked)
    if (newLiked) {
      setLikeAnimation(true)
      setTimeout(() => setLikeAnimation(false), 1000)
    }
    onToggleFavorite(note.id, newLiked)
  }

  const locationText = [
    note.destinations?.city,
    note.location,
  ].filter(Boolean).join(' • ')

  const shouldTruncate = note.content && note.content.length > 150

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header - Instagram style */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Type Avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <span className="text-lg">{config.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">{note.title}</span>
              {note.mood && (
                <span className="text-sm">{MOOD_ICONS[note.mood]}</span>
              )}
            </div>
            {locationText && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {locationText}
              </p>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="18" r="2"/>
            </svg>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    onDelete(note.id)
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image - Instagram style with double-tap to like */}
      {note.image_url && (
        <div
          className="relative w-full aspect-square bg-gray-100 cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <Image
            src={note.image_url}
            alt={note.title}
            fill
            className="object-cover"
          />

          {/* Double-tap heart animation */}
          {likeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="w-24 h-24 text-white drop-shadow-lg animate-ping"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* No image - show gradient banner for essays/highlights */}
      {!note.image_url && (note.type === 'essay' || note.type === 'highlight') && (
        <div className={`w-full h-32 bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
          <span className="text-5xl opacity-50">{config.icon}</span>
        </div>
      )}

      {/* Actions - Instagram style */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {/* Like button */}
            <button
              onClick={handleLikeClick}
              className="hover:scale-110 transition-transform active:scale-95"
            >
              <svg
                className={`w-7 h-7 transition-colors ${liked ? 'text-red-500' : 'text-gray-800'}`}
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Comment icon (decorative) */}
            <button className="hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Share icon (decorative) */}
            <button className="hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Bookmark/Save */}
          <button
            onClick={handleLikeClick}
            className="hover:scale-110 transition-transform"
          >
            <svg
              className={`w-7 h-7 ${liked ? 'text-gray-900' : 'text-gray-800'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Likes count */}
        {liked && (
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Saved to favorites
          </p>
        )}

        {/* Content - Instagram caption style */}
        {note.content && (
          <div className="mb-2">
            <p className="text-sm text-gray-900">
              <span className="font-semibold mr-1">{note.type === 'essay' ? 'Story' : 'Note'}</span>
              {shouldTruncate && !expanded ? (
                <>
                  {note.content.slice(0, 150)}...
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-gray-500 ml-1 hover:text-gray-700"
                  >
                    more
                  </button>
                </>
              ) : (
                <span className="whitespace-pre-wrap">{note.content}</span>
              )}
            </p>
            {expanded && shouldTruncate && (
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-500 text-sm hover:text-gray-700 mt-1"
              >
                Show less
              </button>
            )}
          </div>
        )}

        {/* Timestamp - Instagram style */}
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {formatDate(note.date)}
        </p>
      </div>

      {/* Type badge - subtle */}
      <div className="px-4 pb-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
          {config.icon} {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
        </span>
      </div>
    </article>
  )
}
