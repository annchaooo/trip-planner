'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <nav className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <circle cx="16" cy="16" r="14" stroke="#1e40af" strokeWidth="1.5" />
              <path d="M10 20 L16 10 L22 20" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 16 L16 11 L19 16" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold text-[#1e40af]">WanderNote</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#4d7c0f]"></div>
            <span className="text-[#4d7c0f] text-lg">✦</span>
            <div className="w-8 h-px bg-[#4d7c0f]"></div>
          </div>

          <div className="editorial-card p-8">
            <div className="text-center mb-8">
              <p className="font-meta text-[#1e40af] mb-2">Account Recovery</p>
              <h1 className="font-display text-2xl text-stone-900">Reset your password</h1>
              <p className="text-stone-500 mt-2">Enter your email to receive a reset link</p>
            </div>

            {success ? (
              <div className="text-center">
                <div className="bg-[#4d7c0f]/10 border border-[#4d7c0f]/20 text-[#4d7c0f] px-4 py-4 rounded-lg mb-6">
                  <p className="font-semibold">Check your email</p>
                  <p className="text-sm mt-1">We&apos;ve sent a password reset link to {email}</p>
                </div>
                <Link
                  href="/login"
                  className="text-[#1e40af] font-semibold hover:text-[#1e3a8a]"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="font-meta text-stone-500 block mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1e40af] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send reset link'
                  )}
                </button>

                <p className="text-center text-stone-500">
                  Remember your password?{' '}
                  <Link href="/login" className="text-[#1e40af] font-semibold hover:text-[#1e3a8a]">
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
