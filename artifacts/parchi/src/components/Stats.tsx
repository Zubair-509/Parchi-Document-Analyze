import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 'Rs 4,500+', label: 'avg monthly spend on branded meds by chronic patients', accent: 'var(--coral)' },
  { value: '68%', label: 'average savings switching to generic equivalents', accent: 'var(--sage)' },
  { value: '0', label: 'prescription data ever stored on our servers', accent: 'var(--sage)' },
  { value: 'WHO', label: 'Essential Medicines List integrated for evidence ratings', accent: '#6b9fd4' },
]

const trust = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    label: 'Zero data storage',
    sub: 'Your prescription never leaves your device',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'WHO-verified',
    sub: 'Essential Medicines List as evidence standard',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    label: 'Native Urdu',
    sub: 'Naskh script, not machine-translated English',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
      </svg>
    ),
    label: 'WCAG 2.1 AA',
    sub: 'Accessible on low-end Android devices',
  },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        y: 28, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from('.trust-item', {
        x: -20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.trust-row', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28" style={{ background: 'var(--bg-card)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20" style={{ background: 'linear-gradient(to bottom, var(--bg-deep), transparent)' }} />

      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="mx-auto mb-20 max-w-[680px] text-center">
          <p className="mb-6 font-display text-[clamp(22px,3.5vw,36px)] font-bold leading-snug text-[var(--cream)]">
            The average Pakistani patient with a chronic condition spends
            <span style={{ color: 'var(--coral)' }}> Rs 4,500+ per month</span> on branded medicines —
            <span style={{ color: 'var(--sage)' }}> when generics exist at a fifth of the price.</span>
          </p>
          <p className="text-[var(--text-muted)]">Parchi closes that gap without asking you to change doctors, hospitals, or pharmacies.</p>
        </div>

        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="stat-item rounded-2xl p-6 text-center" style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
              <p className="mb-2 font-display text-[clamp(32px,4vw,48px)] font-black leading-none" style={{ color: s.accent }}>{s.value}</p>
              <p className="text-[12px] leading-relaxed text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="trust-row grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label} className="trust-item flex items-start gap-4 rounded-xl p-4" style={{ background: 'rgba(90,138,110,0.06)', border: '1px solid rgba(90,138,110,0.12)' }}>
              <div className="mt-0.5 shrink-0 text-[var(--sage)]">{t.icon}</div>
              <div>
                <p className="mb-0.5 text-[13px] font-semibold text-[var(--cream)]">{t.label}</p>
                <p className="text-[12px] text-[var(--text-muted)]">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20" style={{ background: 'linear-gradient(to top, var(--bg-deep), transparent)' }} />
    </section>
  )
}
