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

  // Verify activity belongs to user's trip
  const { data: activity } = await supabase
    .from('activities')
    .select(`
      id,
      destinations!inner (
        trips!inner (user_id)
      )
    `)
    .eq('id', id)
    .single()

  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const destinations = activity.destinations as { trips: { user_id: string } }
  if (destinations.trips.user_id !== user.id) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('activities')
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

  // Verify activity belongs to user's trip
  const { data: activity } = await supabase
    .from('activities')
    .select(`
      id,
      destinations!inner (
        trips!inner (user_id)
      )
    `)
    .eq('id', id)
    .single()

  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const destinations = activity.destinations as { trips: { user_id: string } }
  if (destinations.trips.user_id !== user.id) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('activities')
    .update({
      name: body.name,
      time: body.time,
      location: body.location,
      notes: body.notes,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
