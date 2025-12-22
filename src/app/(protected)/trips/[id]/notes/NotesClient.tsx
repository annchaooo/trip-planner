'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NoteForm } from '@/components/notes/NoteForm'
import { NoteCard } from '@/components/notes/NoteCard'

const TYPE_FILTERS = [
  { value: 'all', label: 'All', icon: '🌟' },
  { value: 'photo', label: 'Photos', icon: '📷' },
  { value: 'essay', label: 'Stories', icon: '✍️' },
  { value: 'highlight', label: 'Highlights', icon: '⭐' },
  { value: 'note', label: 'Notes', icon: '📝' },
]

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
}

export function NotesClient({ trip, initialNotes }: NotesClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [filterType, setFilterType] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const router = useRouter()

  const handleAddSuccess = () => {
    setShowAddForm(false)
    router.refresh()
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this memory?')) return

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

      // Optimistic update
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
        // Revert on failure
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
  if (filterType !== 'all') {
    filteredNotes = filteredNotes.filter(n => n.type === filterType)
  }
  if (showFavoritesOnly) {
    filteredNotes = filteredNotes.filter(n => n.is_favorite)
  }

  // Sort by date (newest first)
  filteredNotes = [...filteredNotes].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const photoCount = notes.filter(n => n.type === 'photo' || n.image_url).length
  const storyCount = notes.filter(n => n.type === 'essay').length
  const favoriteCount = notes.filter(n => n.is_favorite).length

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile Header - Instagram style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Trip Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-3xl">✈️</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{trip.name}</h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{notes.length}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{photoCount}</p>
                <p className="text-xs text-gray-500">Photos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{storyCount}</p>
                <p className="text-xs text-gray-500">Stories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Share a Moment
          </button>
        )}
      </div>

      {/* Add Form - Slide down */}
      {showAddForm && (
        <div className="mb-6">
          <NoteForm
            tripId={trip.id}
            destinations={trip.destinations}
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Filter Tabs - Instagram style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 sticky top-0 z-10">
        <div className="flex items-center border-b border-gray-100">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`flex-1 py-3 text-center transition-all relative ${
                filterType === t.value
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {filterType === t.value && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Favorites Toggle */}
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'moment' : 'moments'}
          </span>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill={showFavoritesOnly ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoriteCount}
          </button>
        </div>
      </div>

      {/* Feed - Instagram style */}
      {filteredNotes.length > 0 ? (
        <div className="space-y-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No moments yet</h3>
            <p className="text-gray-500 mb-6">Start capturing your travel memories</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Share Your First Moment
            </button>
          </div>
        )
      )}

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  )
}
