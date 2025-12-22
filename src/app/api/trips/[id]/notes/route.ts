import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify trip belongs to user
  const { data: trip } = await supabase
    .from('trips')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      destinations (city, country)
    `)
    .eq('trip_id', id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify trip belongs to user
  const { data: trip } = await supabase
    .from('trips')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('notes')
    .insert({
      trip_id: id,
      destination_id: body.destination_id || null,
      title: body.title,
      content: body.content || null,
      type: body.type || 'note',
      mood: body.mood || null,
      date: body.date,
      location: body.location || null,
      image_url: body.image_url || null,
      is_favorite: body.is_favorite || false,
    })
    .select(`
      *,
      destinations (city, country)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
