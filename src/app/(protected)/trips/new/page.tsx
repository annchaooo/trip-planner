import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TripForm } from '@/components/trips/TripForm'
import { EditorialLayout } from '@/components/layout/EditorialLayout'

export default async function NewTripPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <EditorialLayout userEmail={user.email}>
      <div className="content-well px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#1e40af] hover:text-[#1e3a8a] font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Journeys
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="rule-line mb-8" />

          <div className="text-center">
            <p className="font-meta text-[#4d7c0f] mb-2">New Adventure</p>
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 mb-4">
              Plan Your Trip
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Start a new journey and create memories that last forever.
            </p>
          </div>

          <div className="rule-line mt-8" />
        </header>

        {/* Form Card */}
        <div className="max-w-xl mx-auto">
          <div className="editorial-card p-8">
            <TripForm />
          </div>
        </div>
      </div>
    </EditorialLayout>
  )
}
