'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseCard } from '@/components/expenses/ExpenseCard'
import { convertCurrency, formatCurrency, CURRENCY_INFO } from '@/lib/currency'

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  transport: { icon: '>', label: 'Transport', color: 'bg-[#1e40af]' },
  accommodation: { icon: '~', label: 'Accommodation', color: 'bg-purple-500' },
  food: { icon: '+', label: 'Food & Drinks', color: 'bg-amber-500' },
  activities: { icon: '*', label: 'Activities', color: 'bg-pink-500' },
  shopping: { icon: '#', label: 'Shopping', color: 'bg-[#4d7c0f]' },
  other: { icon: '-', label: 'Other', color: 'bg-stone-500' },
}

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

interface BudgetClientProps {
  trip: Trip
  initialExpenses: Expense[]
}

export function BudgetClient({ trip, initialExpenses }: BudgetClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const router = useRouter()

  const budgetCurrency = trip.budget_currency || 'TWD'
  const currencyInfo = CURRENCY_INFO[budgetCurrency] || CURRENCY_INFO.TWD

  // Calculate totals - convert all expenses to budget currency
  const totalSpentInBudgetCurrency = expenses.reduce((sum, exp) => {
    const convertedAmount = convertCurrency(exp.amount, exp.currency, budgetCurrency)
    return sum + convertedAmount
  }, 0)

  const remaining = trip.budget ? trip.budget - totalSpentInBudgetCurrency : null
  const percentUsed = trip.budget ? (totalSpentInBudgetCurrency / trip.budget) * 100 : 0

  // Calculate by category (converted to budget currency)
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const convertedAmount = convertCurrency(exp.amount, exp.currency, budgetCurrency)
    acc[exp.category] = (acc[exp.category] || 0) + convertedAmount
    return acc
  }, {} as Record<string, number>)

  // Group expenses by original currency for display
  const expensesByCurrency = expenses.reduce((acc, exp) => {
    if (!acc[exp.currency]) {
      acc[exp.currency] = { total: 0, count: 0 }
    }
    acc[exp.currency].total += exp.amount
    acc[exp.currency].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const handleAddSuccess = () => {
    setShowAddForm(false)
    router.refresh()
  }

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Delete this expense?')) return

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setExpenses(expenses.filter(e => e.id !== expenseId))
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  const filteredExpenses = filterCategory
    ? expenses.filter(e => e.category === filterCategory)
    : expenses

  // Group expenses by date
  const expensesByDate = filteredExpenses.reduce((acc, exp) => {
    if (!acc[exp.date]) {
      acc[exp.date] = []
    }
    acc[exp.date].push(exp)
    return acc
  }, {} as Record<string, Expense[]>)

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(expensesByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  // Format date for display
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  // Calculate daily total in budget currency
  const getDailyTotal = (dateExpenses: Expense[]) => {
    return dateExpenses.reduce((sum, exp) => {
      return sum + convertCurrency(exp.amount, exp.currency, budgetCurrency)
    }, 0)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Summary */}
      <div className="lg:col-span-1 space-y-6">
        {/* Budget Overview */}
        <div className="editorial-card p-6">
          <h2 className="font-display text-lg text-stone-900 mb-4">Budget Overview</h2>

          {/* Total Spent */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-2">
              <span className="text-stone-500">Total Spent</span>
              <div className="text-right">
                <span className="font-display text-2xl text-stone-900">
                  {formatCurrency(totalSpentInBudgetCurrency, budgetCurrency)}
                </span>
                <p className="text-xs text-stone-400">{currencyInfo.name}</p>
              </div>
            </div>

            {trip.budget && (
              <>
                <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percentUsed > 100 ? 'bg-red-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-[#4d7c0f]'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">{percentUsed.toFixed(0)}% of budget</span>
                  <span className={remaining && remaining < 0 ? 'text-red-600 font-semibold' : 'text-stone-500'}>
                    {remaining && remaining < 0 ? 'Over by ' : 'Remaining: '}
                    {formatCurrency(Math.abs(remaining || 0), budgetCurrency)}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Budget: {formatCurrency(trip.budget, budgetCurrency)}
                </p>
              </>
            )}

            {!trip.budget && (
              <p className="text-sm text-stone-500 mt-2">No budget set for this trip</p>
            )}
          </div>

          {/* Expense Count */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Expenses</span>
              <span className="font-display text-stone-900">{expenses.length}</span>
            </div>
          </div>
        </div>

        {/* Spending by Currency */}
        {Object.keys(expensesByCurrency).length > 1 && (
          <div className="editorial-card p-6">
            <h2 className="font-display text-lg text-stone-900 mb-4">By Currency</h2>
            <div className="space-y-2">
              {Object.entries(expensesByCurrency).map(([currency, data]) => {
                const info = CURRENCY_INFO[currency] || { symbol: currency, name: currency }
                const convertedAmount = convertCurrency(data.total, currency, budgetCurrency)
                return (
                  <div key={currency} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div>
                      <span className="font-medium text-stone-900">{formatCurrency(data.total, currency)}</span>
                      <span className="text-xs text-stone-400 ml-2">({data.count} items)</span>
                    </div>
                    <span className="text-sm text-stone-500">
                      = {formatCurrency(convertedAmount, budgetCurrency)}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-stone-400 mt-3 text-center">
              Converted to {currencyInfo.name} using approximate rates
            </p>
          </div>
        )}

        {/* By Category */}
        <div className="editorial-card p-6">
          <h2 className="font-display text-lg text-stone-900 mb-4">By Category</h2>

          {Object.keys(expensesByCategory).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other
                  const percent = totalSpentInBudgetCurrency > 0 ? (amount / totalSpentInBudgetCurrency) * 100 : 0

                  return (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(filterCategory === category ? null : category)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        filterCategory === category
                          ? 'bg-[#1e40af]/10 border-2 border-[#1e40af]'
                          : 'hover:bg-stone-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#4d7c0f]">{config.icon}</span>
                          <span className="font-medium text-stone-900">{config.label}</span>
                        </div>
                        <span className="font-display text-stone-900">
                          {formatCurrency(amount, budgetCurrency)}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${config.color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-1">{percent.toFixed(0)}% of total</p>
                    </button>
                  )
                })}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-4">No expenses yet</p>
          )}

          {filterCategory && (
            <button
              onClick={() => setFilterCategory(null)}
              className="w-full mt-4 text-sm text-[#1e40af] hover:text-[#1e3a8a] font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Right: Expenses List */}
      <div className="lg:col-span-2">
        <div className="editorial-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg text-stone-900">
                {filterCategory
                  ? `${CATEGORY_CONFIG[filterCategory]?.label || 'Other'} Expenses`
                  : 'All Expenses'}
              </h2>
              <p className="text-sm text-stone-500">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Expense
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="mb-6 p-6 bg-stone-50 rounded-xl">
              <ExpenseForm
                tripId={trip.id}
                onSuccess={handleAddSuccess}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {sortedDates.length > 0 ? (
            <div className="space-y-6">
              {sortedDates.map((date) => {
                const dateExpenses = expensesByDate[date]
                const dailyTotal = getDailyTotal(dateExpenses)

                return (
                  <div key={date}>
                    {/* Date Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                      <h3 className="font-display text-stone-900">
                        {formatDateHeader(date)}
                      </h3>
                      <span className="text-sm font-medium text-[#4d7c0f]">
                        {formatCurrency(dailyTotal, budgetCurrency)}
                      </span>
                    </div>

                    {/* Expenses for this date */}
                    <div className="space-y-3">
                      {dateExpenses.map((expense) => (
                        <ExpenseCard
                          key={expense.id}
                          expense={expense}
                          budgetCurrency={budgetCurrency}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            !showAddForm && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                    <circle cx="40" cy="40" r="36" stroke="#e7e5e4" strokeWidth="1.5" />
                    <path d="M30 35 L40 25 L50 35" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 45 L40 55 L50 45" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="40" cy="40" r="4" fill="#1e40af" />
                  </svg>
                </div>
                <h3 className="font-display text-lg text-stone-900 mb-2">No expenses yet</h3>
                <p className="text-stone-500 mb-6">Start tracking your trip expenses</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Expense
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
