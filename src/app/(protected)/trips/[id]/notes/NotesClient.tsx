'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { NoteForm } from '@/components/notes/NoteForm'
import { NoteCard } from '@/components/notes/NoteCard'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

interface Destination {
  id: string
  city: string
  country: string
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

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  destinations: Destination[]
}

interface NotesClientProps {
  trip: Trip
  initialNotes: Note[]
  userEmail?: string
}

export function NotesClient({ trip, initialNotes, userEmail }: NotesClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [filter, setFilter] = useState<'all' | 'essays' | 'photos' | 'saved'>('all')
  const router = useRouter()

  const handleAddSuccess = () => {
    setShowAddForm(false)
    router.refresh()
  }

  const handleDelete = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const handleToggleFavorite = async (noteId: string, isFavorite: boolean) => {
    try {
      const note = notes.find(n => n.id === noteId)
      if (!note) return

      setNotes(notes.map(n =>
        n.id === noteId ? { ...n, is_favorite: isFavorite } : n
      ))

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...note,
          is_favorite: isFavorite,
        }),
      })

      if (!response.ok) {
        setNotes(notes.map(n =>
          n.id === noteId ? { ...n, is_favorite: !isFavorite } : n
        ))
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  // Filter notes
  let filteredNotes = notes
  if (filter === 'essays') {
    filteredNotes = filteredNotes.filter(n => n.type === 'essay')
  } else if (filter === 'photos') {
    filteredNotes = filteredNotes.filter(n => n.image_url)
  } else if (filter === 'saved') {
    filteredNotes = filteredNotes.filter(n => n.is_favorite)
  }

  // Sort by date (newest first)
  filteredNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatTripDates = () => {
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const startMonth = start.toLocaleDateString('en-US', { month: 'long' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' })
    const year = start.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}–${end.getDate()}, ${year}`
    }
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`
  }

  const heroNote = notes.find(n => n.image_url)
  const photoCount = notes.filter(n => n.image_url).length
  const essayCount = notes.filter(n => n.type === 'essay').length
  const savedCount = notes.filter(n => n.is_favorite).length

  return (
    <EditorialLayout userEmail={userEmail}>
      {/* Hero Section */}
      {heroNote?.image_url && (
        <div className="relative w-full">
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src={heroNote.image_url}
              alt={trip.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Content Well */}
      <div className="content-well px-6 lg:px-8">
        {/* Headline Block */}
        <header className="py-12 lg:py-16">
          {/* Top Rule */}
          <div className="rule-line mb-8" />

          {/* Metadata */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="font-meta text-stone-400">{formatTripDates()}</span>
            {trip.destinations.length > 0 && (
              <>
                <span className="text-stone-300">·</span>
                <span className="font-meta text-stone-400">
                  {trip.destinations.map(d => d.city).join(' · ')}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-center text-stone-900 mb-6">
            {trip.name}
          </h1>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="font-display text-2xl text-stone-900">{notes.length}</p>
              <p className="font-meta text-stone-400">Entries</p>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <p className="font-display text-2xl text-stone-900">{photoCount}</p>
              <p className="font-meta text-stone-400">Photos</p>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <p className="font-display text-2xl text-stone-900">{essayCount}</p>
              <p className="font-meta text-stone-400">Essays</p>
            </div>
          </div>

          {/* Bottom Rule */}
          <div className="rule-line mt-8" />
        </header>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between py-4 mb-8">
          {/* Filters */}
          <div className="flex items-center gap-1">
            {[
              { key: 'all', label: 'All', count: notes.length },
              { key: 'photos', label: 'Photos', count: photoCount },
              { key: 'essays', label: 'Essays', count: essayCount },
              { key: 'saved', label: 'Saved', count: savedCount },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === item.key
                    ? 'bg-[#1e40af] text-white'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                {item.label}
                {item.count > 0 && filter !== item.key && (
                  <span className="ml-1.5 text-stone-400">{item.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* New Entry Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#1e40af] text-white rounded-lg text-sm font-medium hover:bg-[#1e3a8a] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </button>
          )}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-8">
            <NoteForm
              tripId={trip.id}
              destinations={trip.destinations}
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Entries / Latest Stories */}
        {filteredNotes.length > 0 ? (
          <section className="pb-16">
            <div className="stories-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        ) : (
          !showAddForm && (
            <div className="py-16 text-center">
              {/* Empty State */}
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                  <circle cx="40" cy="40" r="36" stroke="#e7e5e4" strokeWidth="1.5" />
                  <path d="M28 50 L40 30 L52 50" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M34 42 L40 32 L46 42" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2 className="font-display text-2xl text-stone-900 mb-3">
                Begin Your Story
              </h2>
              <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
                Every journey has a tale worth telling. Capture your first moment.
              </p>

              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Write Your First Entry
              </button>
            </div>
          )
        )}
      </div>

      {/* Latest Stories Footer (Olive Section) */}
      {savedCount > 0 && filter === 'all' && (
        <section className="bg-[#4d7c0f] py-16">
          <div className="content-well px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-white/30" />
              <span className="text-white/60 text-lg">✦</span>
              <div className="w-8 h-px bg-white/30" />
            </div>

            <h2 className="font-display text-2xl text-white mb-2">
              Saved Moments
            </h2>
            <p className="text-white/70 mb-8">
              Your favorite memories from this journey
            </p>

            <div className="stories-grid">
              {notes
                .filter(n => n.is_favorite)
                .slice(0, 4)
                .map((note) => (
                  <article key={note.id} className="editorial-card">
                    {note.image_url && (
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={note.image_url}
                          alt={note.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-meta text-stone-400 mb-2">
                        {new Date(note.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <h3 className="font-display text-lg text-stone-900 text-center">
                        {note.title}
                      </h3>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>
      )}
    </EditorialLayout>
  )
}
