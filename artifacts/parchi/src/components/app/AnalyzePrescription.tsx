import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePrescription, type Medicine } from '../../contexts/PrescriptionContext'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result is "data:<mimeType>;base64,<data>" — strip the prefix
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const confidenceBadge = (c: Medicine['confidence']) => {
  const map = { high: { label: 'High confidence', color: 'var(--sage)' }, medium: { label: 'Medium', color: '#d4a94e' }, low: { label: 'Low confidence', color: 'var(--coral)' } }
  return map[c] ?? map.medium
}

const tierColor = (tier: string) => {
  if (tier === 'affordable') return 'var(--sage)'
  if (tier === 'expensive') return 'var(--coral)'
  return '#d4a94e'
}

const foodLabel = (r: string) => {
  const m: Record<string, { en: string; ur: string }> = {
    before_food: { en: 'Before food',  ur: 'کھانے سے پہلے' },
    after_food:  { en: 'After food',   ur: 'کھانے کے بعد' },
    with_food:   { en: 'With food',    ur: 'کھانے کے ساتھ' },
    anytime:     { en: 'Any time',     ur: 'کسی بھی وقت' },
  }
  return m[r] ?? { en: r, ur: '' }
}

const TIMING_UR: Record<string, string> = {
  morning: 'صبح', afternoon: 'دوپہر', evening: 'شام', night: 'رات',
}

export default function AnalyzePrescription() {
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [apiError, setApiError] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { token } = useAuth()
  const { result, setAnalysis, clearAnalysis } = usePrescription()

  const analyze = async (file: File) => {
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStage('analyzing')
    setApiError('')
    try {
      const imageData = await fileToBase64(file)
      const mimeType = file.type || 'image/jpeg'
      const res = await fetch('/api/prescription/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ imageData, mimeType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data, url)
      setStage('done')
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Could not analyze prescription')
      setStage('error')
    }
  }

  const handleFile = (file: File | undefined) => { if (file) analyze(file) }
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }

  const reset = () => { setStage('idle'); setPreview(null); setApiError(''); clearAnalysis(); setExpanded(null) }

  const medicines = result?.medicines ?? []

  // Compute total savings
  const totalSavings = medicines.reduce((acc, m) => {
    const alts = m.generic_alternatives.filter(a => a.price_per_tablet_pkr)
    const cheapest = alts.length ? Math.min(...alts.map(a => a.price_per_tablet_pkr!)) : null
    const expensive = alts.length ? Math.max(...alts.map(a => a.price_per_tablet_pkr!)) : null
    if (cheapest !== null && expensive !== null) acc += (expensive - cheapest)
    return acc
  }, 0)

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Analyze Prescription</h1>
        <p className="text-[14px] text-[var(--text-muted)]">Take a photo or upload your prescription — AI reads it in seconds.</p>
      </div>

      {/* ── Idle upload area ── */}
      {stage === 'idle' && (
        <div>
          <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
            className="mb-6 flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center transition-colors duration-200"
            style={{ border: '2px dashed rgba(90,138,110,0.35)', background: 'rgba(90,138,110,0.04)' }}
            onDragEnter={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.7)')}
            onDragLeave={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.35)')}>
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(90,138,110,0.1)', border: '1px solid rgba(90,138,110,0.2)' }}>
              <svg className="h-10 w-10 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="mb-1 text-[15px] font-semibold text-[var(--cream)]">Drop your prescription here</p>
            <p className="mb-6 text-[13px] text-[var(--text-muted)]">Supports JPG, PNG, HEIC — handwritten or printed</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-200 hover:-translate-y-px"
                style={{ background: 'var(--sage)', boxShadow: '0 0 20px rgba(90,138,110,0.4)' }}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
                Take Photo / Upload
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          </div>
          <div className="flex items-center justify-center gap-2 text-[12px] text-[var(--text-muted)]">
            <svg className="h-3.5 w-3.5 shrink-0 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Your prescription is never stored — processed and discarded immediately
          </div>
        </div>
      )}

      {/* ── Analyzing ── */}
      {stage === 'analyzing' && (
        <div className="flex flex-col items-center py-16">
          {preview && (
            <div className="mb-8 h-48 w-36 overflow-hidden rounded-xl shadow-2xl" style={{ border: '1px solid rgba(90,138,110,0.2)' }}>
              <img src={preview} alt="prescription" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full opacity-25" style={{ background: 'var(--sage)' }} />
            <div className="absolute inset-2 animate-ping rounded-full opacity-15" style={{ background: 'var(--sage)', animationDelay: '0.3s' }} />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--sage)' }}>
              <svg className="h-5 w-5 animate-spin text-[var(--cream)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <p className="mb-1 font-display text-lg font-bold text-[var(--cream)]">Reading your prescription…</p>
          <p className="text-[13px] text-[var(--text-muted)]">Gemini AI is identifying medicines and dosages</p>
          <div className="mt-8 w-full max-w-[320px] space-y-3 text-left">
            {['Detecting text & handwriting', 'Identifying medicines', 'Finding affordable alternatives'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: i < 1 ? 'var(--sage)' : 'rgba(90,138,110,0.2)' }}>
                  {i < 1
                    ? <svg className="h-3 w-3 text-[var(--cream)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--sage)]" />}
                </div>
                <span className="text-[13px]" style={{ color: i < 1 ? 'var(--cream)' : 'var(--text-muted)' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {stage === 'error' && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(232,130,107,0.12)', border: '1px solid rgba(232,130,107,0.3)' }}>
            <svg className="h-7 w-7 text-[var(--coral)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">Analysis failed</p>
          <p className="mb-8 max-w-[340px] text-[13px] text-[var(--text-muted)]">{apiError}</p>
          <button onClick={reset} className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)]" style={{ background: 'var(--sage)' }}>
            Try again
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {stage === 'done' && result && (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(90,138,110,0.2)' }}>
                <svg className="h-3.5 w-3.5 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-[13px] font-semibold text-[var(--sage)]">{medicines.length} medicine{medicines.length !== 1 ? 's' : ''} detected</span>
            </div>
            <button onClick={reset} className="text-[12px] text-[var(--text-muted)] underline hover:text-[var(--cream)]">Scan another</button>
          </div>

          {/* Total savings banner */}
          {totalSavings > 0 && (
            <div className="mb-5 flex items-center justify-between rounded-xl px-5 py-4"
              style={{ background: 'rgba(90,138,110,0.09)', border: '1px solid rgba(90,138,110,0.25)' }}>
              <p className="text-[13px] text-[var(--text-muted)]">Potential savings switching to generics</p>
              <p className="font-mono text-lg font-black text-[var(--sage)]">Rs {totalSavings.toLocaleString()}+</p>
            </div>
          )}

          {/* Medicine cards */}
          <div className="mb-6 space-y-4">
            {medicines.map((med) => {
              const badge = confidenceBadge(med.confidence)
              const isOpen = expanded === med.id
              const cheapestAlt = med.generic_alternatives
                .filter(a => a.price_per_tablet_pkr)
                .sort((a, b) => (a.price_per_tablet_pkr ?? 0) - (b.price_per_tablet_pkr ?? 0))[0]

              return (
                <div key={med.id} className="overflow-hidden rounded-2xl transition-all duration-200"
                  style={{ background: 'var(--bg-card)', border: `1px solid ${isOpen ? 'rgba(90,138,110,0.3)' : 'rgba(90,138,110,0.12)'}` }}>

                  {/* Card header — always visible */}
                  <button className="flex w-full items-start justify-between gap-3 p-5 text-left" onClick={() => setExpanded(isOpen ? null : med.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="font-display text-[15px] font-bold text-[var(--cream)]">{med.medicine_name}</p>
                        {med.standard_name && med.standard_name !== med.medicine_name && (
                          <span className="text-[11px] text-[var(--text-muted)]">· {med.standard_name}</span>
                        )}
                      </div>
                      <p className="mb-0.5 text-[12px] text-[var(--text-muted)]">{med.active_formula ?? ''} · {med.dosage}</p>
                      {med.formula_urdu && (
                        <p className="mb-1 text-[12px] text-[var(--sage)]" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 1.8 }}>{med.formula_urdu}</p>
                      )}
                      <p className="text-[12px] text-[var(--text-muted)]">{med.purpose}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: `${badge.color}18`, color: badge.color }}>{badge.label}</span>
                      {cheapestAlt?.price_per_tablet_pkr && (
                        <span className="font-mono text-xs font-bold text-[var(--sage)]">
                          from Rs {cheapestAlt.price_per_tablet_pkr}/tab
                        </span>
                      )}
                      <svg className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t px-5 pb-6 pt-4 space-y-5" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>

                      {/* Dosage info */}
                      <div className="flex flex-wrap gap-2">
                        <Chip en={med.dosage} ur={med.dosage} icon="📋" />
                        <Chip en={med.duration ?? 'See doctor'} ur={med.duration ?? 'ڈاکٹر سے پوچھیں'} icon="⏱" />
                        <Chip en={foodLabel(med.food_relation).en} ur={foodLabel(med.food_relation).ur} icon="🍽" />
                        {med.timing.length > 0 && (
                          <Chip
                            en={med.timing.join(', ')}
                            ur={med.timing.map(t => TIMING_UR[t] ?? t).join(' · ')}
                            icon="🕐"
                          />
                        )}
                      </div>

                      {/* Urdu explanation */}
                      {med.explanation_urdu && (
                        <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(90,138,110,0.06)', border: '1px solid rgba(90,138,110,0.14)' }}>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--sage)]">اردو میں وضاحت</p>
                          <p className="urdu text-sm text-[var(--cream)]" style={{ lineHeight: '2.2', textShadow: '0 1px 4px rgba(5,10,8,0.7)' }}>
                            {med.explanation_urdu}
                          </p>
                        </div>
                      )}

                      {/* Warning */}
                      {med.important_warning && (
                        <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px]"
                          style={{ background: 'rgba(232,130,107,0.07)', border: '1px solid rgba(232,130,107,0.2)', color: 'var(--coral)' }}>
                          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                          {med.important_warning}
                        </div>
                      )}

                      {/* Side effects */}
                      {med.common_side_effects.length > 0 && (
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                            Common side effects · <span dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>ممکنہ ضمنی اثرات</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {med.common_side_effects.map(s => (
                              <span key={s} className="rounded-full px-3 py-1 text-[12px] text-[var(--text-muted)]"
                                style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.1)' }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Generic alternatives */}
                      {med.generic_alternatives.length > 0 && (
                        <div>
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                            Affordable alternatives · <span dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>سستے متبادل</span>
                          </p>
                          <div className="space-y-2">
                            {med.generic_alternatives.map((alt, i) => (
                              <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3"
                                style={{ background: 'rgba(5,10,8,0.4)', border: '1px solid rgba(90,138,110,0.1)' }}>
                                <div>
                                  <p className="text-[13px] font-semibold text-[var(--cream)]">{alt.brand_name}</p>
                                  {alt.manufacturer && <p className="text-[11px] text-[var(--text-muted)]">{alt.manufacturer}</p>}
                                  {alt.note && <p className="text-[11px] text-[var(--text-muted)]">{alt.note}</p>}
                                </div>
                                <div className="text-right">
                                  {alt.price_per_tablet_pkr && (
                                    <p className="font-mono text-sm font-bold" style={{ color: tierColor(alt.tier) }}>
                                      Rs {alt.price_per_tablet_pkr}/tab
                                    </p>
                                  )}
                                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                    style={{ background: `${tierColor(alt.tier)}18`, color: tierColor(alt.tier) }}>
                                    {alt.tier}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence */}
                      {med.evidence && (
                        <div className="rounded-xl px-4 py-3 space-y-2" style={{ background: 'rgba(107,159,212,0.06)', border: '1px solid rgba(107,159,212,0.14)' }}>
                          <div className="flex items-center gap-2">
                            {med.evidence.who_essential && (
                              <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#6b9fd4]"
                                style={{ background: 'rgba(107,159,212,0.14)' }}>WHO Essential</span>
                            )}
                            {med.evidence.evidence_strength && (
                              <span className="text-[11px] text-[#6b9fd4]" style={{ textTransform: 'capitalize' }}>
                                {med.evidence.evidence_strength.replace('_', ' ')} evidence
                              </span>
                            )}
                          </div>
                          {med.evidence.evidence_note_urdu && (
                            <p className="urdu text-[12px] text-[var(--text-muted)]" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: '2' }}>
                              {med.evidence.evidence_note_urdu}
                            </p>
                          )}
                          {med.evidence.doctor_question_urdu && (
                            <div className="pt-1 border-t" style={{ borderColor: 'rgba(107,159,212,0.15)' }}>
                              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b9fd4]">
                                ڈاکٹر سے پوچھیں
                              </p>
                              <p className="urdu text-[13px] text-[var(--cream)]" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: '2.2' }}>
                                💬 {med.evidence.doctor_question_urdu}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button onClick={() => navigate('/app/pricing')}
              className="flex-1 rounded-full py-3.5 text-sm font-bold text-[var(--cream)] transition-all hover:-translate-y-px"
              style={{ background: 'var(--sage)', boxShadow: '0 0 20px rgba(90,138,110,0.4)' }}>
              Compare Prices →
            </button>
            <button onClick={() => navigate('/app/know')}
              className="flex-1 rounded-full border py-3.5 text-sm font-bold text-[var(--cream)] transition-all hover:bg-[rgba(90,138,110,0.08)]"
              style={{ borderColor: 'rgba(90,138,110,0.3)' }}>
              Know Your Prescription →
            </button>
          </div>

          {result.disclaimer && (
            <p className="mt-5 text-center text-[11px] text-[var(--text-muted)]" style={{ opacity: 0.6 }}>
              {result.disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Chip({ en, ur, icon }: { en: string; ur: string; icon?: string }) {
  return (
    <span className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[var(--text-muted)] flex items-center gap-1.5"
      style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
      {icon && <span>{icon}</span>}
      <span>{en}</span>
      {ur && ur !== en && (
        <span className="text-[var(--sage)]" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 1.6 }}>· {ur}</span>
      )}
    </span>
  )
}
