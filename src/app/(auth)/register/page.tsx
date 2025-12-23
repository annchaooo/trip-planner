import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
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
              <p className="font-meta text-[#1e40af] mb-2">Begin Your Journey</p>
              <h1 className="font-display text-2xl text-stone-900">Create your account</h1>
              <p className="text-stone-500 mt-2">Start documenting your adventures</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  )
}
