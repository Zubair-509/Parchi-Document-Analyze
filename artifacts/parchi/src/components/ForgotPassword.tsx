import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-deep)] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,81,69,0.28) 0%, transparent 65%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Link to="/" className="mb-10 block text-center font-display text-2xl font-bold tracking-tight text-[var(--cream)]">
          Parchi<span style={{ color: 'var(--sage)' }}>.</span>
        </Link>

        <div className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.16)' }}>

          {!sent ? (
            <>
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(90,138,110,0.12)', border: '1px solid rgba(90,138,110,0.25)' }}>
                  <svg className="h-7 w-7 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
              </div>

              <h1 className="mb-2 text-center font-display text-2xl font-bold text-[var(--cream)]">
                Forgot password?
              </h1>
              <p className="mb-7 text-center text-[13px] leading-relaxed text-[var(--text-muted)]">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ali@example.com"
                    className="w-full rounded-xl px-4 py-3 text-sm text-[var(--cream)] placeholder-[rgba(156,194,166,0.4)] outline-none transition-all duration-200"
                    style={{ background: 'rgba(5,10,8,0.7)', border: '1px solid rgba(90,138,110,0.18)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(90,138,110,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(90,138,110,0.18)')}
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 font-semibold text-[var(--cream)] transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'var(--sage)', boxShadow: '0 0 24px rgba(90,138,110,0.35)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage-deep)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(90,138,110,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--sage)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(90,138,110,0.35)' }}
                >
                  Send reset link
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(90,138,110,0.12)', border: '1px solid rgba(90,138,110,0.3)' }}>
                  <svg className="h-7 w-7 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.82a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
              </div>

              <h1 className="mb-2 text-center font-display text-2xl font-bold text-[var(--cream)]">
                Check your email
              </h1>
              <p className="mb-2 text-center text-[13px] leading-relaxed text-[var(--text-muted)]">
                We sent a reset link to
              </p>
              <p className="mb-7 text-center text-[13px] font-semibold text-[var(--sage)]">{email}</p>
              <p className="mb-6 text-center text-[12px] text-[var(--text-muted)]">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-[var(--sage)] hover:underline">
                  try again
                </button>
                .
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[13px] text-[var(--text-muted)]">
          Remember your password?{' '}
          <Link to="/auth" className="font-semibold text-[var(--sage)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
