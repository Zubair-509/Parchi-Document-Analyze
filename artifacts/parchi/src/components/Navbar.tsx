import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(5,10,8,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(90,138,110,0.18)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.35)',
      } : {}}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">

        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'rgba(90,138,110,0.2)', border: '1px solid rgba(90,138,110,0.35)' }}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--cream)] transition-opacity group-hover:opacity-80">
            Parchi<span style={{ color: 'var(--sage)' }}>.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="#how-it-works">How it works</NavLink>
          <NavLink href="#about">About Us</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="hidden rounded-full border px-5 py-2 text-sm font-semibold text-[var(--cream)] transition-all duration-200 hover:bg-[rgba(90,138,110,0.12)] md:inline-block"
            style={{ borderColor: 'rgba(90,138,110,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.75)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.4)')}
          >
            Sign in / Sign up
          </Link>

          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:text-[var(--cream)] md:hidden"
            style={{ border: '1px solid rgba(90,138,110,0.2)' }}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--cream)]"
    >
      {children}
      <span className="absolute inset-x-4 bottom-1 h-px scale-x-0 rounded-full bg-[var(--sage)] transition-transform duration-200 hover:scale-x-100" />
    </a>
  )
}
