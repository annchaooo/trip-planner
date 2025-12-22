'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDB() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()

        // Test basic connection by checking if we can query the trips table
        const { error } = await supabase.from('trips').select('count').limit(1)

        if (error) {
          // If table doesn't exist yet, that's expected before running schema
          if (error.message.includes('does not exist')) {
            setStatus('error')
            setMessage('Database tables not found. Please run schema.sql in Supabase SQL Editor first.')
          } else {
            setStatus('success')
            setMessage('Connected to Supabase! (No data yet - tables are ready)')
          }
        } else {
          setStatus('success')
          setMessage('Connected to Supabase! Database is ready.')
        }
      } catch (err) {
        setStatus('error')
        setMessage(`Connection failed: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h1>

        {status === 'loading' && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Testing connection...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <span>✓</span>
              <span>Success</span>
            </div>
            <p className="text-emerald-600 mt-1">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 font-medium">
              <span>✗</span>
              <span>Error</span>
            </div>
            <p className="text-red-600 mt-1">{message}</p>
          </div>
        )}

        <a
          href="/"
          className="mt-6 block text-center text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
