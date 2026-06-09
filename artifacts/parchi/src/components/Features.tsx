import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    accent: 'var(--sage)',
    badge: 'Core',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Prescription Explained',
    urdu: 'نسخہ سمجھائیں',
    desc: 'Every medicine on your prescription decoded in plain Urdu — what it treats, how to take it, food interactions, and red-flag side effects.',
    detail: ['Purpose & mechanism', 'Dosage schedule', 'Drug interactions', 'Side effect warnings'],
  },
  {
    accent: 'var(--coral)',
    badge: 'Save Money',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Affordable Alternatives',
    urdu: 'سستے متبادل',
    desc: 'Three pricing tiers for every medicine: branded, generic, and bulk generic — same active formula, from a fraction of the cost.',
    detail: ['Branded vs Generic pricing', 'Bulk buying options', 'Same active ingredient', 'Avg 68% savings'],
  },
  {
    accent: '#6b9fd4',
    badge: 'Evidence',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Clinical Evidence',
    urdu: 'طبی ثبوت',
    desc: 'Know the strength of the evidence behind every prescription. WHO Essential Medicines badge, evidence ratings, and informed questions for your next visit.',
    detail: ['WHO ESL integration', 'Evidence strength ratings', 'Clinical trial summaries', 'Question prompts'],
  },
  {
    accent: '#b08fe8',
    badge: 'Lab Reports',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5a2 2 0 00-2 2v2a2 2 0 002 2h4m0-4h10a2 2 0 012-2v-2a2 2 0 00-2-2H9m0 4v4"/>
      </svg>
    ),
    title: 'Test Report Reader',
    urdu: 'ٹیسٹ رپورٹ',
    desc: 'Upload your blood work, urine analysis, or other lab reports. Get color-coded results with normal ranges explained in Urdu.',
    detail: ['CBC, LFT, KFT, lipids', 'Color-coded status', 'Normal range context', 'Trend tracking'],
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[var(--bg-deep)] py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full border border-[rgba(90,138,110,0.3)] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sage)]">
            Features
          </span>
        </div>
        <h2 className="mb-4 text-center font-display text-[clamp(32px,5vw,56px)] font-black leading-[1.05] tracking-tight text-[var(--cream)]">
          Everything you need<br />
          <span style={{ color: 'var(--sage)' }}>to take control.</span>
        </h2>
        <p className="mx-auto mb-20 max-w-[520px] text-center text-[15px] leading-relaxed text-[var(--text-muted)]">
          From prescription to lab report — Parchi gives every Pakistani patient the information their doctor assumes they already have.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="feat-card group relative overflow-hidden rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: 'var(--bg-card)', border: `1px solid rgba(90,138,110,0.12)`, borderTop: `3px solid ${f.accent}` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${f.accent}18`, color: f.accent }}>
                  {f.icon}
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: `${f.accent}18`, color: f.accent }}>
                  {f.badge}
                </span>
              </div>

              <h3 className="mb-1 font-display text-xl font-bold text-[var(--cream)]">{f.title}</h3>
              <p className="urdu mb-3 text-sm" style={{ color: f.accent, lineHeight: '2', textShadow: '0 1px 6px rgba(5,10,8,0.8)' }}>{f.urdu}</p>
              <p className="mb-6 text-[14px] leading-relaxed text-[var(--text-muted)]">{f.desc}</p>

              <ul className="space-y-2">
                {f.detail.map((d) => (
                  <li key={d} className="flex items-center gap-2.5 text-[13px] text-[var(--text-muted)]">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={f.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(to top, ${f.accent}08, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
