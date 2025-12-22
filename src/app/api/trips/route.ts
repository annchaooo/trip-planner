import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      destinations(count)
    `)
    .eq('user_id', user.id)
    .order('start_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Validate required fields
  if (!body.name || !body.start_date || !body.end_date) {
    return NextResponse.json(
      { error: 'Name, start date, and end date are required' },
      { status: 400 }
    )
  }

  // Validate dates
  if (new Date(body.end_date) < new Date(body.start_date)) {
    return NextResponse.json(
      { error: 'End date must be after start date' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('trips')
    .insert({
      user_id: user.id,
      name: body.name,
      start_date: body.start_date,
      end_date: body.end_date,
      budget: body.budget || null,
      budget_currency: body.budget_currency || 'TWD',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
