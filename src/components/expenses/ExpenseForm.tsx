'use client'

import { useState } from 'react'

const EXPENSE_CATEGORIES = [
  { value: 'transport', label: 'Transport', icon: '>' },
  { value: 'accommodation', label: 'Accommodation', icon: '~' },
  { value: 'food', label: 'Food & Drinks', icon: '+' },
  { value: 'activities', label: 'Activities', icon: '*' },
  { value: 'shopping', label: 'Shopping', icon: '#' },
  { value: 'other', label: 'Other', icon: '-' },
]

interface ExpenseFormProps {
  tripId: string
  onSuccess: () => void
  onCancel: () => void
}

export function ExpenseForm({ tripId, onSuccess, onCancel }: ExpenseFormProps) {
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paidBy, setPaidBy] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!category || !description.trim() || !amount || !date) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description: description.trim(),
          amount: amountNum,
          currency,
          date,
          paid_by: paidBy.trim() || null,
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add expense')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-display text-lg text-stone-900 mb-4">Add Expense</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Category Selection */}
        <div>
          <label className="font-meta text-stone-500 block mb-2">
            Category *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  category === cat.value
                    ? 'border-[#1e40af] bg-[#1e40af]/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-lg font-mono text-[#4d7c0f] block mb-1">{cat.icon}</span>
                <span className="text-xs font-medium text-stone-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-meta text-stone-500 block mb-2">
            Description *
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Taxi to airport, Hotel booking"
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
          />
        </div>

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="font-meta text-stone-500 block mb-2">
              Amount *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
            />
          </div>
          <div>
            <label htmlFor="currency" className="font-meta text-stone-500 block mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 bg-white"
            >
              <option value="USD">USD ($)</option>
              <option value="TWD">TWD (NT$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="KRW">KRW (₩)</option>
              <option value="THB">THB (฿)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>

        {/* Date and Paid By */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="font-meta text-stone-500 block mb-2">
              Date *
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900"
            />
          </div>
          <div>
            <label htmlFor="paidBy" className="font-meta text-stone-500 block mb-2">
              Paid By
            </label>
            <input
              id="paidBy"
              type="text"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              placeholder="e.g., John"
              className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="font-meta text-stone-500 block mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details..."
            rows={2}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400 resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1e40af] text-white py-3 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              'Add Expense'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
