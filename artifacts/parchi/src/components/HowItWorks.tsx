import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    title: 'Snap or Upload',
    urdu: 'تصویر لیں یا اپلوڈ کریں',
    body: 'Take a photo of your prescription or upload an image. Our AI reads handwritten and printed scripts from any Pakistani doctor.',
  },
  {
    num: '02',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Understand in Urdu',
    urdu: 'اردو میں سمجھیں',
    body: 'Each medicine explained in plain Urdu: what it does, when to take it, what to avoid, and what side effects to watch for.',
  },
  {
    num: '03',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Save Without Compromise',
    urdu: 'کم قیمت، اتنا ہی اثر',
    body: 'See WHO-approved generic alternatives. Same active formula, a fraction of the price. Average saving: 68% — without asking your doctor to re-prescribe.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hiw-step', {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="relative overflow-hidden py-32" style={{ background: 'var(--bg-card)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: 'linear-gradient(to bottom, var(--bg-deep), transparent)' }} />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full border border-[rgba(90,138,110,0.3)] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sage)]">
            How it works
          </span>
        </div>
        <h2 className="mb-4 text-center font-display text-[clamp(32px,5vw,56px)] font-black leading-[1.05] tracking-tight text-[var(--cream)]">
          Three steps.<br />
          <span style={{ color: 'var(--sage)' }}>No pharmacy degree required.</span>
        </h2>
        <p className="mx-auto mb-20 max-w-[540px] text-center text-[15px] leading-relaxed text-[var(--text-muted)]">
          Parchi turns an unreadable doctor's note into clear, actionable Urdu — and tells you exactly where to save money.
        </p>

        <div className="relative grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="hiw-step group relative flex flex-col rounded-2xl p-8" style={{ background: 'rgba(5,10,8,0.6)', border: '1px solid rgba(90,138,110,0.14)' }}>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'rgba(90,138,110,0.12)', border: '1px solid rgba(90,138,110,0.3)' }}>
                  <span className="font-display text-sm font-black text-[var(--sage)]">{step.num}</span>
                </div>
                <div className="text-[var(--text-muted)] transition-colors group-hover:text-[var(--sage)]">
                  {step.icon}
                </div>
              </div>

              <h3 className="mb-1 font-display text-xl font-bold text-[var(--cream)]">{step.title}</h3>
              <p className="urdu mb-4 text-sm text-[var(--sage)]" style={{ lineHeight: '2', textShadow: '0 1px 8px rgba(5,10,8,0.9)' }}>{step.urdu}</p>
              <p className="text-[14px] leading-relaxed text-[var(--text-muted)]">{step.body}</p>

              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(90,138,110,0.07) 0%, transparent 70%)' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(to top, var(--bg-deep), transparent)' }} />
    </section>
  )
}
