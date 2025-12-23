import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

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
  trip_id: string
  trips: {
    id: string
    name: string
  }
  destinations: { city: string; country: string } | null
}

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all notes across all trips
  const { data: notes } = await supabase
    .from('notes')
    .select(`
      *,
      trips (id, name),
      destinations (city, country)
    `)
    .eq('trips.user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  const allNotes = (notes || []) as Note[]
  const essays = allNotes.filter(n => n.type === 'essay')
  const photos = allNotes.filter(n => n.image_url)
  const favorites = allNotes.filter(n => n.is_favorite)

  return (
    <EditorialLayout userEmail={user.email}>
      <div className="content-well px-6 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="rule-line mb-8" />

          <div className="text-center">
            <p className="font-meta text-[#1e40af] mb-2">Your Collection</p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              All Journal Entries
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Every story, every photo, every moment from your journeys.
            </p>
          </div>

          <div className="rule-line mt-8" />
        </header>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-12 text-sm">
          <div className="text-center">
            <p className="font-display text-2xl text-stone-900">{allNotes.length}</p>
            <p className="font-meta text-stone-400">Entries</p>
          </div>
          <div className="w-px h-10 bg-stone-200" />
          <div className="text-center">
            <p className="font-display text-2xl text-stone-900">{photos.length}</p>
            <p className="font-meta text-stone-400">Photos</p>
          </div>
          <div className="w-px h-10 bg-stone-200" />
          <div className="text-center">
            <p className="font-display text-2xl text-stone-900">{essays.length}</p>
            <p className="font-meta text-stone-400">Essays</p>
          </div>
          <div className="w-px h-10 bg-stone-200" />
          <div className="text-center">
            <p className="font-display text-2xl text-stone-900">{favorites.length}</p>
            <p className="font-meta text-stone-400">Saved</p>
          </div>
        </div>

        {/* Notes Grid */}
        {allNotes.length > 0 ? (
          <div className="stories-grid">
            {allNotes.map((note) => (
              <Link
                key={note.id}
                href={`/trips/${note.trip_id}/notes`}
                className="block"
              >
                <article className="editorial-card overflow-hidden">
                  {note.image_url && (
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={note.image_url}
                        alt={note.title}
                        fill
                        className="object-cover"
                      />
                      {note.is_favorite && (
                        <div className="absolute top-3 right-3 bg-[#1e40af] rounded-lg p-1.5">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    {/* Trip Name */}
                    <p className="font-meta text-[#4d7c0f] mb-2">
                      {note.trips?.name || 'Unknown Trip'}
                    </p>

                    {/* Date */}
                    <p className="font-meta text-stone-400 mb-2">
                      {new Date(note.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Title */}
                    <h3 className="font-display text-lg text-stone-900 mb-2">
                      {note.title}
                    </h3>

                    {/* Type Badge */}
                    <span className={`font-meta text-xs px-2 py-1 rounded-lg ${
                      note.type === 'essay' ? 'bg-[#1e40af]/10 text-[#1e40af]' :
                      note.type === 'highlight' ? 'bg-[#4d7c0f]/10 text-[#4d7c0f]' :
                      note.type === 'photo' ? 'bg-amber-100 text-amber-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>
                      {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <circle cx="40" cy="40" r="36" stroke="#e7e5e4" strokeWidth="1.5" />
                <path d="M28 50 L40 30 L52 50" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34 42 L40 32 L46 42" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="font-display text-2xl text-stone-900 mb-3">
              No Entries Yet
            </h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Start a trip and begin documenting your journey.
            </p>

            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Plan Your First Trip
            </Link>
          </div>
        )}
      </div>
    </EditorialLayout>
  )
}
