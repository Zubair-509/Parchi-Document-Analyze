import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Patient-first',
    body: "Every decision is made with one question: does this help the patient who can't afford to be confused?",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Evidence-backed',
    body: "We don't guess. Every medicine, alternative, and explanation is sourced from the WHO Essential Medicines List and peer-reviewed literature.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: 'Private by design',
    body: 'Your prescription data never touches our servers. Processing is ephemeral — nothing is stored, logged, or sold. Ever.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
      </svg>
    ),
    title: 'Rooted in Pakistan',
    body: 'Built for the realities of the Pakistani healthcare system — from handwritten Urdu prescriptions to Rs 4,500/month medicine bills.',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-left', {
        x: -40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
      })
      gsap.from('.about-card', {
        y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden bg-[var(--bg-deep)] py-32">
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3"
        style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(90,138,110,0.09) 0%, transparent 65%)' }} />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
        <div className="grid items-start gap-16 lg:grid-cols-2">

          <div className="about-left">
            <span className="mb-5 inline-block rounded-full border border-[rgba(90,138,110,0.3)] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--sage)]">
              About Parchi
            </span>

            <h2 className="mb-6 font-display text-[clamp(30px,4.5vw,52px)] font-black leading-[1.05] tracking-tight text-[var(--cream)]">
              The prescription
              <br />
              <span style={{ color: 'var(--sage)' }}>you deserved to read.</span>
            </h2>

            <div className="space-y-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
              <p>
                In Pakistan, a doctor's appointment lasts 7 minutes on average. Prescriptions are often handwritten, rarely explained, and regularly written for the most expensive branded variant — when a generic alternative at a fifth of the cost exists.
              </p>
              <p>
                Parchi started with a simple frustration: a patient with a chronic condition, a prescription they couldn't read, and a pharmacist who handed over Rs 4,500 worth of medicines without a word of explanation.
              </p>
              <p>
                We built the tool that patient deserved — an AI that reads the prescription, explains it in plain Urdu, and shows every affordable alternative backed by clinical evidence.
              </p>
            </div>

            <div className="mt-8 rounded-xl p-5" style={{ background: 'rgba(90,138,110,0.07)', borderLeft: '3px solid var(--sage)' }}>
              <p className="urdu text-lg text-[var(--cream)]"
                style={{ lineHeight: '2.2', textShadow: '0 1px 8px rgba(5,10,8,0.7)' }}>
                "ہر مریض کو اپنا علاج سمجھنے کا حق ہے۔"
              </p>
              <p className="mt-2 text-[12px] text-[var(--text-muted)]">Every patient has the right to understand their treatment.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title}
                className="about-card rounded-2xl p-6 transition-colors duration-200 hover:border-[rgba(90,138,110,0.3)]"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.1)' }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--sage)]"
                  style={{ background: 'rgba(90,138,110,0.1)', border: '1px solid rgba(90,138,110,0.2)' }}>
                  {v.icon}
                </div>
                <h3 className="mb-2 font-display text-[15px] font-bold text-[var(--cream)]">{v.title}</h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">{v.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
