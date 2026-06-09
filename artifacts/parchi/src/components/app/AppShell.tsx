import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  {
    to: '/app/analyze',
    label: 'Analyze',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  },
  {
    to: '/app/pricing',
    label: 'Pricing',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    to: '/app/know',
    label: 'Know your prescription',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-deep)]">

      {/* Sidebar */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r lg:flex"
        style={{ borderColor: 'rgba(90,138,110,0.12)', background: 'var(--bg-card)' }}>

        <div className="flex h-16 items-center border-b px-6" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
          <span className="font-display text-xl font-bold text-[var(--cream)]">
            Parchi<span style={{ color: 'var(--sage)' }}>.</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3 pt-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Tools</p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${isActive ? 'text-[var(--sage)]' : 'text-[var(--text-muted)]'}`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(90,138,110,0.18)' } : {}}>
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? 'var(--sage)' : 'var(--text-muted)' }}>{item.icon}</span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-4" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--cream)]"
              style={{ background: 'var(--sage)' }}>{initials}</div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--cream)]">{user?.name || 'User'}</p>
              <p className="truncate text-[11px] text-[var(--text-muted)]">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] text-[var(--text-muted)] transition-colors hover:text-[var(--cream)]"
            style={{ border: '1px solid rgba(90,138,110,0.15)' }}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:hidden"
          style={{ borderColor: 'rgba(90,138,110,0.12)', background: 'var(--bg-card)' }}>
          <span className="font-display text-lg font-bold text-[var(--cream)]">
            Parchi<span style={{ color: 'var(--sage)' }}>.</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[var(--text-muted)]">{user?.name}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-[var(--cream)]"
              style={{ background: 'var(--sage)' }}>{initials}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="flex shrink-0 border-t lg:hidden"
          style={{ borderColor: 'rgba(90,138,110,0.12)', background: 'var(--bg-card)' }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors"
              style={({ isActive }) => ({ color: isActive ? 'var(--sage)' : 'var(--text-muted)' })}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold text-[var(--text-muted)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </nav>
      </div>
    </div>
  )
}
