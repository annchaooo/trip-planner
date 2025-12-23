'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
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

      <div>
        <label htmlFor="password" className="font-meta text-stone-500 block mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1e40af]/20 focus:border-[#1e40af] outline-none transition-all text-stone-900 placeholder-stone-400"
        />
      </div>

      <div className="flex items-center justify-end">
        <Link href="/forgot-password" className="text-sm text-[#1e40af] hover:text-[#1e3a8a] font-medium">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1e40af] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Logging in...
          </span>
        ) : (
          'Log in'
        )}
      </button>

      <div className="rule-line my-6" />

      <p className="text-center text-stone-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#1e40af] font-semibold hover:text-[#1e3a8a]">
          Sign up
        </Link>
      </p>
    </form>
  )
}
