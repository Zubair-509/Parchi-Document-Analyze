import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Grainient from './Grainient/Grainient'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const receiptRef = useRef<HTMLDivElement>(null)
  const newEntryRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(phoneRef.current, {
        scale: 0.72,
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from(cardRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.9,
        delay: 0.32,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 35%',
        once: true,
        onEnter: () => {
          const pr = receiptRef.current!.getBoundingClientRect()
          const ph = phoneRef.current!.getBoundingClientRect()
          const tx = (ph.left + ph.width / 2) - (pr.left + pr.width / 2)
          const ty = (ph.top + ph.height / 2) - (pr.top + pr.height / 2)
          gsap.to(receiptRef.current, {
            x: tx, y: ty, scale: 0.1, rotation: 0, opacity: 0,
            duration: 1.4, ease: 'power2.inOut', delay: 0.3,
          })
          gsap.to(newEntryRef.current, {
            opacity: 1, y: 0,
            duration: 0.6, ease: 'back.out(1.7)', delay: 1.4,
          })
        },
      })
    })

    const card = cardRef.current
    const inner = card?.querySelector('.card-inner') as HTMLElement | null
    if (card && inner) {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const cx = rect.width / 2
        const cy = rect.height / 2
        gsap.to(inner, {
          rotateX: (e.clientY - rect.top - cy) / 10,
          rotateY: (cx - (e.clientX - rect.left)) / 10,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000,
        })
      }
      const onLeave = () =>
        gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      return () => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
        ctx.revert()
      }
    }
    return () => ctx.revert()
  }, [])

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Grainient
            color1="#5a8a6e"
            color2="#286953"
            color3="#084b35"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        <div className="relative z-10">
          <section className="mx-auto flex max-w-[1100px] flex-col items-center px-6 pb-32 pt-40 text-center sm:px-10 sm:pt-48">

            <h1
              data-text="PARCHI"
              className="glitch-title mb-6 text-[clamp(72px,11vw,152px)] font-black leading-[0.88] tracking-[-3px]"
            >
              PARCHI
            </h1>

            <p className="mb-3 max-w-[600px] text-[clamp(17px,2.2vw,22px)] leading-snug text-[var(--cream)]" style={{ opacity: 0.75 }}>
              Understand your prescription.&nbsp; Question it.&nbsp; Afford it.
            </p>

            <p className="urdu mb-12 text-[clamp(19px,2.6vw,26px)] text-[var(--cream)]"
              style={{ textShadow: '0 2px 20px rgba(5,10,8,0.9)', opacity: 0.9 }}>
              اپنا نسخہ سمجھیں۔ سوال کریں۔ خریدیں۔
            </p>

            <Link
              to="/auth"
              className="group mb-10 inline-flex items-center gap-3 rounded-full px-10 py-4 text-base font-bold text-[var(--cream)] transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--sage)', boxShadow: '0 0 0 1px rgba(90,138,110,0.5), 0 0 32px rgba(90,138,110,0.45)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sage-deep)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(90,138,110,0.6), 0 0 48px rgba(90,138,110,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--sage)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(90,138,110,0.5), 0 0 32px rgba(90,138,110,0.45)' }}
            >
              Scan your first prescription — free
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { icon: '🔒', text: 'Zero data stored' },
                { icon: '🌐', text: 'Native Urdu' },
                { icon: '🏥', text: 'WHO' },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
                  <span>{icon}</span>
                  {text}
                </span>
              ))}
            </div>

          </section>
        </div>
      </div>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-[var(--bg-deep)] py-32"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(90,138,110,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
          <p className="mb-16 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            See it in action
          </p>

          <div className="relative mx-auto flex h-[640px] w-full max-w-[860px] items-center justify-center">

            <div
              ref={receiptRef}
              className="absolute left-0 top-12 z-30 w-44 rotate-[-11deg] overflow-hidden rounded-sm bg-[#fdf9f0] shadow-2xl"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="bg-[var(--sage-deep)] px-3 py-2 text-center">
                <p className="font-display text-[9px] font-bold uppercase tracking-widest text-[var(--cream)]">
                  Rx — Prescription
                </p>
              </div>
              <div className="space-y-2 px-3 py-3">
                <div className="flex justify-between text-[8px] text-gray-400">
                  <span>Dr. Tariq Ahmad</span>
                  <span>23 May 2025</span>
                </div>
                <div className="h-px bg-gray-200" />
                {[
                  ['Augmentin 625mg', '1×2 — 7 days'],
                  ['Panadol 500mg', '1×3 — 5 days'],
                  ['Nexium 40mg', '1×1 — 14 days'],
                ].map(([med, dose]) => (
                  <div key={med} className="flex flex-col gap-0.5">
                    <p className="text-[9px] font-semibold text-gray-700">{med}</p>
                    <p className="text-[8px] text-gray-400">{dose}</p>
                  </div>
                ))}
                <div className="h-px bg-gray-200" />
                <div className="flex h-8 w-24 items-center justify-center border border-dashed border-gray-300">
                  <p className="text-[7px] text-gray-300">Signature</p>
                </div>
              </div>
            </div>

            <div
              ref={phoneRef}
              className="relative z-20 h-[560px] w-[272px] overflow-hidden rounded-[2.8rem] border-[7px] border-neutral-800 bg-neutral-900 shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="flex h-full flex-col bg-[var(--bg-deep)] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--cream)]">9:41</span>
                  <div className="h-4 w-20 rounded-full bg-neutral-800" />
                  <div className="flex gap-1">
                    <svg className="h-3 w-3 fill-[var(--text-muted)]" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                    <svg className="h-3 w-3 fill-[var(--text-muted)]" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                  </div>
                </div>

                <p className="mb-3 font-display text-base font-bold text-[var(--cream)]">
                  Prescription Scan
                </p>

                <div className="mb-2 flex items-center justify-between rounded-xl border-l-4 border-[var(--coral)] bg-[var(--bg-card)] p-3">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--cream)]">Augmentin 625mg</p>
                    <p className="text-[8px] text-[var(--text-muted)]">Antibiotic · 7 days</p>
                  </div>
                  <p className="font-mono text-[10px] font-bold text-[var(--coral)]">Rs 1,200</p>
                </div>

                <div
                  ref={newEntryRef}
                  className="flex translate-y-3 items-center justify-between rounded-xl border-l-4 border-[var(--sage)] bg-[var(--bg-card)] p-3 opacity-0 shadow-[0_0_16px_rgba(90,138,110,0.25)]"
                >
                  <div>
                    <p className="text-[10px] font-bold text-[var(--sage)]">✓ Amoxiclav 625mg</p>
                    <p className="text-[8px] text-[var(--text-muted)]">Same formula · Generic</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] font-bold text-[var(--sage)]">Rs 380</p>
                    <p className="text-[7px] text-[var(--text-muted)]">Save 68%</p>
                  </div>
                </div>

                <div className="mt-auto flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--sage)] shadow-[0_0_20px_rgba(90,138,110,0.45)]">
                    <svg className="h-5 w-5 fill-[var(--cream)]" viewBox="0 0 24 24">
                      <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={cardRef}
              className="absolute -right-4 bottom-12 z-40 w-64 lg:-right-12"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <div
                className="card-inner rounded-2xl p-5 shadow-2xl"
                style={{
                  background: 'rgba(13,23,19,0.82)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(90,138,110,0.22)',
                  borderLeft: '5px solid var(--sage)',
                }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(90,138,110,0.15)]">
                    <svg className="h-5 w-5 fill-[var(--sage)]" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="rounded bg-[rgba(90,138,110,0.2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]">
                    Alternative
                  </span>
                </div>
                <p className="mb-0.5 text-sm font-bold text-[var(--cream)]">Amoxiclav 625mg</p>
                <p className="mb-3 text-[11px] text-[var(--text-muted)]">Same efficacy · Approved generic</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-[var(--sage)]">Rs 380</span>
                  <span className="font-mono text-xs line-through text-[var(--text-muted)]">Rs 1,200</span>
                  <span className="ml-auto text-xs font-bold text-[var(--coral)]">Save 68%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
