'use client'

import { useState } from 'react'
import Image from 'next/image'

const MOOD_LABELS: Record<string, { label: string; icon: string }> = {
  happy: { label: 'Joyful', icon: '☀' },
  excited: { label: 'Exhilarated', icon: '✦' },
  peaceful: { label: 'Serene', icon: '◌' },
  adventurous: { label: 'Adventurous', icon: '↗' },
  amazed: { label: 'In Awe', icon: '◇' },
  tired: { label: 'Weary', icon: '∿' },
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
    }
  }

  const dateInfo = formatDate(note.date)
  const shouldTruncate = note.content && note.content.length > 280 && note.type !== 'essay'
  const moodInfo = note.mood ? MOOD_LABELS[note.mood] : null

  // Photo entry - Card with large-radius rounded corners
  if (note.image_url) {
    return (
      <article className="editorial-card">
        {/* Image with 3:2 aspect ratio */}
        <div className="relative w-full aspect-[3/2] bg-stone-100">
          <Image
            src={note.image_url}
            alt={note.title}
            fill
            className="object-cover"
          />

          {/* Favorite Badge */}
          {note.is_favorite && (
            <div className="absolute top-4 right-4 bg-[#1e40af] rounded-lg p-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Eyebrow */}
          <p className="font-meta text-stone-400 mb-3">
            {dateInfo.month} {dateInfo.day}, {dateInfo.year}
          </p>

          {/* Title - Bold, centered */}
          <h2 className="font-display text-xl text-stone-900 text-center mb-3">
            {note.title}
          </h2>

          {/* Location */}
          {(note.destinations || note.location) && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[#4d7c0f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-stone-500">
                {[note.destinations?.city, note.location].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}

          {/* Content Preview */}
          {note.content && (
            <p className="text-stone-600 leading-relaxed text-center">
              {shouldTruncate && !expanded ? (
                <>
                  {note.content.slice(0, 180)}...
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-[#1e40af] font-medium ml-1 hover:underline"
                  >
                    Read more
                  </button>
                </>
              ) : (
                <span className="whitespace-pre-wrap">{note.content}</span>
              )}
            </p>
          )}

          {/* Rule Line */}
          <div className="rule-line my-6" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                note.is_favorite ? 'text-[#1e40af]' : 'text-stone-400 hover:text-[#1e40af]'
              }`}
            >
              <svg className="w-5 h-5" fill={note.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {note.is_favorite ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={() => {
                if (confirm('Remove this entry?')) onDelete(note.id)
              }}
              className="text-sm text-stone-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </article>
    )
  }

  // Text entry - Editorial card layout
  return (
    <article className="editorial-card p-6">
      {/* Date Eyebrow */}
      <p className="font-meta text-stone-400 mb-4">
        {dateInfo.month} {dateInfo.day}, {dateInfo.year}
      </p>

      {/* Type Badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`font-meta px-2.5 py-1 rounded-lg ${
          note.type === 'essay' ? 'bg-[#1e40af]/10 text-[#1e40af]' :
          note.type === 'highlight' ? 'bg-[#4d7c0f]/10 text-[#4d7c0f]' :
          'bg-stone-100 text-stone-600'
        }`}>
          {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
        </span>

        {/* Mood */}
        {moodInfo && (
          <span className="flex items-center gap-1.5 text-sm text-stone-400">
            <span className="text-[#4d7c0f]">{moodInfo.icon}</span>
            {moodInfo.label}
          </span>
        )}

        {/* Favorite */}
        {note.is_favorite && (
          <div className="ml-auto bg-[#1e40af]/10 rounded-lg p-1.5">
            <svg className="w-4 h-4 text-[#1e40af]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Location */}
      {(note.destinations || note.location) && (
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[#4d7c0f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-stone-500">
            {[note.destinations?.city, note.location].filter(Boolean).join(' · ')}
          </span>
        </div>
      )}

      {/* Title */}
      <h2 className="font-display text-xl text-stone-900 mb-3">
        {note.title}
      </h2>

      {/* Content */}
      {note.content && (
        <div className={note.type === 'essay' ? 'font-body' : ''}>
          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
            {shouldTruncate && !expanded ? (
              <>
                {note.content.slice(0, 280)}...
                <button
                  onClick={() => setExpanded(true)}
                  className="text-[#1e40af] font-medium ml-1 hover:underline"
                >
                  Read more
                </button>
              </>
            ) : (
              note.content
            )}
          </p>
          {expanded && shouldTruncate && (
            <button
              onClick={() => setExpanded(false)}
              className="text-sm text-stone-400 hover:text-stone-600 mt-2"
            >
              Show less
            </button>
          )}
        </div>
      )}

      {/* Rule Line */}
      <div className="rule-line my-6" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onToggleFavorite(note.id, !note.is_favorite)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            note.is_favorite ? 'text-[#1e40af]' : 'text-stone-400 hover:text-[#1e40af]'
          }`}
        >
          <svg className="w-5 h-5" fill={note.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {note.is_favorite ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={() => {
            if (confirm('Remove this entry?')) onDelete(note.id)
          }}
          className="text-sm text-stone-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </article>
  )
}
