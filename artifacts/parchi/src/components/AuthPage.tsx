import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

const features = [
  { icon: '📋', text: 'Prescription explained in plain Urdu' },
  { icon: '💊', text: 'Generic alternatives — save up to 68%' },
  { icon: '🧪', text: 'Lab report reader with normal ranges' },
]

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--bg-deep)]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/4 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,81,69,0.35) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/4 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(90,138,110,0.18) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 hidden flex-col justify-between p-14 lg:flex lg:w-[45%]">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-[var(--cream)]">
          Parchi<span style={{ color: 'var(--sage)' }}>.</span>
        </Link>

        <div>
          <p className="urdu mb-4 text-[clamp(22px,2.5vw,30px)] text-[var(--cream)]"
            style={{ textShadow: '0 2px 16px rgba(5,10,8,0.85)' }}>
            اپنا نسخہ سمجھیں۔
          </p>
          <h2 className="mb-4 font-display text-[clamp(32px,3.5vw,52px)] font-black leading-[1.05] tracking-tight text-[var(--cream)]">
            Health information<br />
            <span style={{ color: 'var(--sage)' }}>that belongs to you.</span>
          </h2>
          <p className="mb-10 max-w-[380px] text-[15px] leading-relaxed text-[var(--text-muted)]">
            Every Pakistani patient deserves to understand their prescription — in their own language, at a price they can afford.
          </p>

          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-[14px] text-[var(--text-muted)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
                  style={{ background: 'rgba(90,138,110,0.12)', border: '1px solid rgba(90,138,110,0.2)' }}>
                  {f.icon}
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Zero prescription data stored — your health info stays on your device
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10 lg:px-16">
        <Link to="/" className="mb-8 font-display text-2xl font-bold tracking-tight text-[var(--cream)] lg:hidden">
          Parchi<span style={{ color: 'var(--sage)' }}>.</span>
        </Link>

        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl p-8 shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.16)' }}>

            <div className="mb-8 flex rounded-xl p-1" style={{ background: 'rgba(5,10,8,0.6)' }}>
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200"
                  style={tab === t
                    ? { background: 'var(--sage)', color: 'var(--cream)', boxShadow: '0 0 16px rgba(90,138,110,0.3)' }
                    : { color: 'var(--text-muted)' }}
                >
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <div className="mb-7">
              <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-[13px] text-[var(--text-muted)]">
                {tab === 'login'
                  ? 'Sign in to access your prescriptions and saved alternatives.'
                  : 'Start understanding your prescriptions in Urdu — free.'}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/app/analyze') }}>
              {tab === 'signup' && (
                <InputField label="Full Name" placeholder="Muhammad Ali" type="text" />
              )}

              <InputField label="Email address" placeholder="ali@example.com" type="email" />

              <PasswordField label="Password" show={showPass} onToggle={() => setShowPass(v => !v)} />

              {tab === 'signup' && (
                <PasswordField label="Confirm password" show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
              )}

              {tab === 'login' && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-[12px] text-[var(--text-muted)] transition-colors hover:text-[var(--sage)]">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 font-semibold text-[var(--cream)] transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'var(--sage)', boxShadow: '0 0 24px rgba(90,138,110,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage-deep)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(90,138,110,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--sage)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(90,138,110,0.35)' }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[13px] text-[var(--text-muted)]">
            {tab === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => setTab('signup')} className="font-semibold text-[var(--sage)] hover:underline">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setTab('login')} className="font-semibold text-[var(--sage)] hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, placeholder, type }: { label: string; placeholder: string; type: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-[var(--cream)] placeholder-[rgba(156,194,166,0.4)] outline-none transition-all duration-200"
        style={{ background: 'rgba(5,10,8,0.7)', border: '1px solid rgba(90,138,110,0.18)' }}
        onFocus={e => (e.target.style.borderColor = 'rgba(90,138,110,0.6)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(90,138,110,0.18)')}
      />
    </div>
  )
}

function PasswordField({ label, show, onToggle }: { label: string; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-[var(--cream)] placeholder-[rgba(156,194,166,0.35)] outline-none transition-all duration-200"
          style={{ background: 'rgba(5,10,8,0.7)', border: '1px solid rgba(90,138,110,0.18)' }}
          onFocus={e => (e.target.style.borderColor = 'rgba(90,138,110,0.6)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(90,138,110,0.18)')}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--cream)]"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}
