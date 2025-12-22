'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseCard } from '@/components/expenses/ExpenseCard'
import { convertCurrency, formatCurrency, CURRENCY_INFO } from '@/lib/currency'

const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  transport: { icon: '🚗', label: 'Transport', color: 'bg-blue-500' },
  accommodation: { icon: '🏨', label: 'Accommodation', color: 'bg-purple-500' },
  food: { icon: '🍽️', label: 'Food & Drinks', color: 'bg-orange-500' },
  activities: { icon: '🎭', label: 'Activities', color: 'bg-pink-500' },
  shopping: { icon: '🛍️', label: 'Shopping', color: 'bg-emerald-500' },
  other: { icon: '📦', label: 'Other', color: 'bg-gray-500' },
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Budget Overview</h2>

          {/* Total Spent */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-2">
              <span className="text-gray-600">Total Spent</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSpentInBudgetCurrency, budgetCurrency)}
                </span>
                <p className="text-xs text-gray-500">{currencyInfo.name}</p>
              </div>
            </div>

            {trip.budget && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      percentUsed > 100 ? 'bg-red-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{percentUsed.toFixed(0)}% of budget</span>
                  <span className={remaining && remaining < 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                    {remaining && remaining < 0 ? 'Over by ' : 'Remaining: '}
                    {formatCurrency(Math.abs(remaining || 0), budgetCurrency)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Budget: {formatCurrency(trip.budget, budgetCurrency)}
                </p>
              </>
            )}

            {!trip.budget && (
              <p className="text-sm text-gray-500 mt-2">No budget set for this trip</p>
            )}
          </div>

          {/* Expense Count */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-gray-900">{expenses.length}</span>
            </div>
          </div>
        </div>

        {/* Spending by Currency */}
        {Object.keys(expensesByCurrency).length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">By Currency</h2>
            <div className="space-y-2">
              {Object.entries(expensesByCurrency).map(([currency, data]) => {
                const info = CURRENCY_INFO[currency] || { symbol: currency, name: currency }
                const convertedAmount = convertCurrency(data.total, currency, budgetCurrency)
                return (
                  <div key={currency} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{formatCurrency(data.total, currency)}</span>
                      <span className="text-xs text-gray-500 ml-2">({data.count} items)</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ≈ {formatCurrency(convertedAmount, budgetCurrency)}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Converted to {currencyInfo.name} using approximate rates
            </p>
          </div>
        )}

        {/* By Category */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">By Category</h2>

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
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        filterCategory === category
                          ? 'bg-emerald-50 border-2 border-emerald-500'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span className="font-medium text-gray-900">{config.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(amount, budgetCurrency)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${config.color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percent.toFixed(0)}% of total</p>
                    </button>
                  )
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No expenses yet</p>
          )}

          {filterCategory && (
            <button
              onClick={() => setFilterCategory(null)}
              className="w-full mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Right: Expenses List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {filterCategory
                  ? `${CATEGORY_CONFIG[filterCategory]?.label || 'Other'} Expenses`
                  : 'All Expenses'}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
              >
                + Add Expense
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="mb-6">
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
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">
                        {formatDateHeader(date)}
                      </h3>
                      <span className="text-sm font-medium text-emerald-600">
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
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your trip expenses</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                >
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
