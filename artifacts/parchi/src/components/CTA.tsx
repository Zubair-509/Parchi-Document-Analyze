import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-inner > *', {
        y: 32, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--bg-deep)] py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(90,138,110,0.14) 0%, transparent 65%)' }} />

      <div className="cta-inner relative mx-auto flex max-w-[720px] flex-col items-center px-6 text-center sm:px-10">
        <span className="mb-6 inline-block rounded-full border border-[rgba(90,138,110,0.3)] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sage)]">
          Free to start
        </span>

        <h2 className="mb-5 font-display text-[clamp(36px,6vw,72px)] font-black leading-[0.95] tracking-tight text-[var(--cream)]">
          Your first prescription,
          <br />
          <span style={{ color: 'var(--sage)' }}>explained free.</span>
        </h2>

        <p className="urdu mb-8 text-[clamp(20px,2.8vw,28px)] text-[var(--cream)]"
          style={{ textShadow: '0 2px 14px rgba(5,10,8,0.9)' }}>
          پہلی پرچی مفت — ابھی شروع کریں
        </p>

        <p className="mb-10 max-w-[440px] text-[15px] leading-relaxed text-[var(--text-muted)]">
          No account required. No data stored. Just take a photo of your prescription and Parchi will do the rest — in under 30 seconds.
        </p>

        <Link to="/auth"
          className="group inline-flex items-center gap-3 rounded-full px-10 py-4 font-bold text-[var(--cream)] transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'var(--sage)', boxShadow: '0 0 0 1px rgba(90,138,110,0.5), 0 0 32px rgba(90,138,110,0.45)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage-deep)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(90,138,110,0.6), 0 0 48px rgba(90,138,110,0.65)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--sage)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(90,138,110,0.5), 0 0 32px rgba(90,138,110,0.45)' }}
        >
          Get started free
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>

        <p className="mt-8 text-[12px] text-[var(--text-muted)]">
          Zero data stored · Works in browser · No app needed
        </p>
      </div>
    </section>
  )
}
