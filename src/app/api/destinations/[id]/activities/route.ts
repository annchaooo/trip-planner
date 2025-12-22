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
    .from('activities')
    .select('*')
    .eq('destination_id', id)
    .order('date', { ascending: true })
    .order('time', { ascending: true })

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

  const body = await request.json()

  // Get current max order_index for this date
  const { data: maxOrder } = await supabase
    .from('activities')
    .select('order_index')
    .eq('destination_id', id)
    .eq('date', body.date)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrder?.order_index ?? -1) + 1

  const { data, error } = await supabase
    .from('activities')
    .insert({
      destination_id: id,
      date: body.date,
      name: body.name,
      time: body.time || null,
      location: body.location || null,
      notes: body.notes || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      order_index: nextOrder,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
