import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BudgetClient } from './BudgetClient'

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  currency: string
  date: string
  paid_by: string | null
  notes: string | null
}

interface Trip {
  id: string
  name: string
  start_date: string
  end_date: string
  budget: number | null
  budget_currency: string
}

export default async function BudgetPage({
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
    .select('id, name, start_date, end_date, budget, budget_currency')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) {
    notFound()
  }

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', id)
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✈</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WanderNote</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link
            href={`/trips/${trip.id}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <span>←</span> Back to Trip
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget & Expenses</h1>
            <p className="text-gray-600 mt-1">{trip.name}</p>
          </div>
        </div>

        <BudgetClient trip={trip as Trip} initialExpenses={(expenses || []) as Expense[]} />
      </main>
    </div>
  )
}
