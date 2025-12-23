'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface EditorialLayoutProps {
  children: React.ReactNode
  userEmail?: string
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '○' },
  { href: '/articles', label: 'Articles', icon: '◇' },
  { href: '/about', label: 'About', icon: '✦' },
]

export function EditorialLayout({ children, userEmail }: EditorialLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Desktop Sidebar */}
      <aside className="editorial-sidebar hidden lg:flex flex-col">
        {/* Brand */}
        <div className="mb-12">
          <Link href="/dashboard" className="block">
            {/* Line Art Logo */}
            <div className="w-12 h-12 mb-4 relative">
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <circle cx="24" cy="24" r="20" stroke="#1e40af" strokeWidth="1.5" />
                <path d="M16 28 L24 16 L32 28" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 24 L24 18 L28 24" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="24" cy="32" r="2" fill="#1e40af" />
              </svg>
            </div>

            {/* Brand Title */}
            <h1 className="text-2xl font-bold text-[#1e40af] tracking-tight">
              WanderNote
            </h1>
          </Link>

          {/* Mission Statement */}
          <p className="mt-4 text-sm text-stone-500 leading-relaxed">
            Stories worth telling,<br />
            journeys worth remembering.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#1e40af] text-white'
                        : 'text-stone-600 hover:bg-white hover:text-[#1e40af]'
                    }`}
                  >
                    <span className={isActive ? 'text-white/80' : 'text-[#4d7c0f]'}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        {userEmail && (
          <div className="pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-400 mb-2 font-medium tracking-wide uppercase">
              Signed in as
            </p>
            <p className="text-sm text-stone-700 truncate mb-3">{userEmail}</p>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-stone-500 hover:text-[#1e40af] transition-colors"
              >
                Sign out →
              </button>
            </form>
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex items-center gap-2 text-stone-300">
            <div className="w-4 h-px bg-stone-300"></div>
            <span className="text-[#4d7c0f] text-xs">✦</span>
            <div className="w-4 h-px bg-stone-300"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="mobile-nav lg:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <circle cx="16" cy="16" r="14" stroke="#1e40af" strokeWidth="1.5" />
              <path d="M10 20 L16 10 L22 20" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold text-[#1e40af]">WanderNote</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-[#1e40af] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-stone-100 bg-white">
            <div className="px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#1e40af] text-white'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className={isActive ? 'text-white/80' : 'text-[#4d7c0f]'}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {userEmail && (
              <div className="px-6 py-4 border-t border-stone-100">
                <p className="text-xs text-stone-400 mb-1">{userEmail}</p>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-[#1e40af] font-medium"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Content Area */}
      <main className="editorial-content">
        {children}
      </main>
    </div>
  )
}
