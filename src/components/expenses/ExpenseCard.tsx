'use client'

import { convertCurrency, formatCurrency } from '@/lib/currency'

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  transport: { icon: '>', color: 'text-[#1e40af]', bg: 'bg-[#1e40af]/10' },
  accommodation: { icon: '~', color: 'text-purple-600', bg: 'bg-purple-100' },
  food: { icon: '+', color: 'text-amber-600', bg: 'bg-amber-100' },
  activities: { icon: '*', color: 'text-pink-600', bg: 'bg-pink-100' },
  shopping: { icon: '#', color: 'text-[#4d7c0f]', bg: 'bg-[#4d7c0f]/10' },
  other: { icon: '-', color: 'text-stone-600', bg: 'bg-stone-100' },
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

interface ExpenseCardProps {
  expense: Expense
  budgetCurrency?: string
  onDelete: (id: string) => void
}

export function ExpenseCard({ expense, budgetCurrency = 'TWD', onDelete }: ExpenseCardProps) {
  const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.other

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  // Convert to budget currency if different
  const showConversion = expense.currency !== budgetCurrency
  const convertedAmount = showConversion
    ? convertCurrency(expense.amount, expense.currency, budgetCurrency)
    : expense.amount

  return (
    <div className="bg-white rounded-lg border border-stone-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className={`font-mono font-bold ${config.color}`}>{config.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-stone-900 truncate">{expense.description}</h4>
              <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                <span>{formatDate(expense.date)}</span>
                {expense.paid_by && (
                  <>
                    <span>-</span>
                    <span>Paid by {expense.paid_by}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-display ${config.color}`}>
                {formatCurrency(expense.amount, expense.currency)}
              </p>
              {showConversion && (
                <p className="text-xs text-stone-400">
                  = {formatCurrency(convertedAmount, budgetCurrency)}
                </p>
              )}
              <p className="text-xs text-stone-400 capitalize font-meta">{expense.category}</p>
            </div>
          </div>

          {expense.notes && (
            <p className="text-sm text-stone-500 mt-2 line-clamp-2">{expense.notes}</p>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(expense.id)}
          className="text-stone-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
          title="Delete expense"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
