import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NotesClient } from './NotesClient'

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

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: trip, error } = await supabase
    .from('trips')
    .select(`
      id, name, start_date, end_date,
      destinations (id, city, country)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) {
    notFound()
  }

  const { data: notes } = await supabase
    .from('notes')
    .select(`
      *,
      destinations (city, country)
    `)
    .eq('trip_id', id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <NotesClient
      trip={trip as Trip}
      initialNotes={(notes || []) as Note[]}
      userEmail={user.email}
    />
  )
}
