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
    .from('expenses')
    .select('*')
    .eq('trip_id', id)
    .order('date', { ascending: false })

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
    .from('expenses')
    .insert({
      trip_id: id,
      category: body.category,
      description: body.description,
      amount: body.amount,
      currency: body.currency || 'USD',
      date: body.date,
      paid_by: body.paid_by || null,
      notes: body.notes || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
