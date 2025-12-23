import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BudgetClient } from './BudgetClient'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    <EditorialLayout userEmail={user.email}>
      {/* ✅ 改這裡：讓頁面寬度跟著瀏覽器變動 */}
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-10 lg:py-14">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/trips/${trip.id}`}
            className="text-[#1e40af] hover:text-[#1e3a8a] font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to {trip.name}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="rule-line mb-8" />

          <div className="text-center">
            <p className="font-meta text-[#4d7c0f] mb-2">{trip.name}</p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              Budget & Expenses
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Track your spending and stay within budget.
            </p>
          </div>

          <div className="rule-line mt-8" />
        </header>

        <BudgetClient trip={trip as Trip} initialExpenses={(expenses || []) as Expense[]} />
      </div>
    </EditorialLayout>
  )
}
