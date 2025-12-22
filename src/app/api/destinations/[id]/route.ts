import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  // Verify destination belongs to user's trip
  const { data: destination } = await supabase
    .from('destinations')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!destination || (destination.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
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

  const body = await request.json()

  // Verify destination belongs to user's trip
  const { data: destination } = await supabase
    .from('destinations')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!destination || (destination.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('destinations')
    .update({
      city: body.city,
      country: body.country,
      start_date: body.start_date,
      end_date: body.end_date,
      latitude: body.latitude,
      longitude: body.longitude,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
