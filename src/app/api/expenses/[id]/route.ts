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
    .from('expenses')
    .select(`
      *,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
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

  // Verify expense belongs to user's trip
  const { data: expense } = await supabase
    .from('expenses')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!expense || (expense.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('expenses')
    .update({
      category: body.category,
      description: body.description,
      amount: body.amount,
      currency: body.currency,
      date: body.date,
      paid_by: body.paid_by,
      notes: body.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
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

  // Verify expense belongs to user's trip
  const { data: expense } = await supabase
    .from('expenses')
    .select(`
      id,
      trips!inner (user_id)
    `)
    .eq('id', id)
    .single()

  if (!expense || (expense.trips as { user_id: string }).user_id !== user.id) {
    return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
