'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CURRENCY_INFO } from '@/lib/currency'

export function TripForm() {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [budgetCurrency, setBudgetCurrency] = useState('TWD')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const currencyInfo = CURRENCY_INFO[budgetCurrency]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          start_date: startDate,
          end_date: endDate,
          budget: budget ? parseFloat(budget) : null,
          budget_currency: budgetCurrency,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create trip')
      }

      const trip = await response.json()
      router.push(`/trips/${trip.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="font-meta text-stone-500 block mb-2">
          Trip Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Japan Adventure 2024"
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="font-meta text-stone-500 block mb-2">
            Start Date *
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="font-meta text-stone-500 block mb-2">
            End Date *
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate}
            className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="font-meta text-stone-500 block mb-2">
          Budget (optional)
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
              {currencyInfo?.symbol || '$'}
            </span>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
            />
          </div>
          <select
            id="budgetCurrency"
            value={budgetCurrency}
            onChange={(e) => setBudgetCurrency(e.target.value)}
            className="px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 bg-white"
          >
            <option value="TWD">TWD (NT$)</option>
            <option value="USD">USD ($)</option>
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
        <p className="text-xs text-stone-400 mt-2">
          Set your budget in your home currency. Expenses in other currencies will be converted.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1e40af] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating trip...
          </span>
        ) : (
          'Create Trip'
        )}
      </button>
    </form>
  )
}
