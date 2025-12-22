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

  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      destinations (city, country),
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  if ((data.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify note belongs to user's trip
  const { data: note } = await supabase
    .from('notes')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!note || (note.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('notes')
    .update({
      destination_id: body.destination_id,
      title: body.title,
      content: body.content,
      type: body.type,
      mood: body.mood,
      date: body.date,
      location: body.location,
      image_url: body.image_url,
      is_favorite: body.is_favorite,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      destinations (city, country)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify note belongs to user's trip
  const { data: note } = await supabase
    .from('notes')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!note || (note.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
