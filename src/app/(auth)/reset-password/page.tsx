'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-2xl text-stone-900 tracking-tight">WanderNote</span>
            <span className="text-[#4d7c0f] font-mono text-sm">*</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-stone-200 p-8">
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl text-stone-900">Set new password</h1>
              <p className="text-stone-600 mt-2">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="font-meta text-stone-500 block mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="font-meta text-stone-500 block mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e40af] text-white py-3 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update password'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
