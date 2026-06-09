import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_RESULTS = [
  { name: 'Augmentin 625mg', type: 'Antibiotic', dose: '1 tablet × 2 daily — 7 days', confidence: 98 },
  { name: 'Panadol 500mg', type: 'Analgesic / Antipyretic', dose: '1 tablet × 3 daily — 5 days', confidence: 95 },
  { name: 'Nexium 40mg', type: 'Proton Pump Inhibitor', dose: '1 tablet × 1 daily — 14 days', confidence: 91 },
]

export default function AnalyzePrescription() {
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'done'>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStage('analyzing')
    setTimeout(() => setStage('done'), 2800)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const reset = () => { setStage('idle'); setPreview(null) }

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Analyze Prescription</h1>
        <p className="text-[14px] text-[var(--text-muted)]">Take a photo or upload your prescription — our AI reads it in seconds.</p>
      </div>

      {stage === 'idle' && (
        <div>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="mb-6 flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center transition-colors duration-200"
            style={{ border: '2px dashed rgba(90,138,110,0.35)', background: 'rgba(90,138,110,0.04)', cursor: 'default' }}
            onDragEnter={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.7)')}
            onDragLeave={e => (e.currentTarget.style.borderColor = 'rgba(90,138,110,0.35)')}
          >
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(90,138,110,0.1)', border: '1px solid rgba(90,138,110,0.2)' }}>
              <svg className="h-10 w-10 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="mb-1 text-[15px] font-semibold text-[var(--cream)]">Drop your prescription here</p>
            <p className="mb-6 text-[13px] text-[var(--text-muted)]">Supports JPG, PNG, HEIC, PDF</p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-200 hover:-translate-y-px"
                style={{ background: 'var(--sage)', boxShadow: '0 0 20px rgba(90,138,110,0.4)' }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
                Take Photo
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-200 hover:bg-[rgba(90,138,110,0.08)]"
                style={{ borderColor: 'rgba(90,138,110,0.35)' }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Upload File
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          </div>

          <div className="flex items-center justify-center gap-2 text-[12px] text-[var(--text-muted)]">
            <svg className="h-3.5 w-3.5 shrink-0 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Your prescription is never stored — processed and discarded immediately
          </div>
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="flex flex-col items-center py-16">
          {preview && (
            <div className="mb-8 h-48 w-36 overflow-hidden rounded-xl shadow-2xl" style={{ border: '1px solid rgba(90,138,110,0.2)' }}>
              <img src={preview} alt="prescription" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full opacity-30" style={{ background: 'var(--sage)' }} />
            <div className="absolute inset-2 animate-ping rounded-full opacity-20" style={{ background: 'var(--sage)', animationDelay: '0.3s' }} />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--sage)' }}>
              <svg className="h-5 w-5 text-[var(--cream)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a10 10 0 0110 10" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>
          </div>
          <p className="mb-1 font-display text-lg font-bold text-[var(--cream)]">Reading your prescription…</p>
          <p className="text-[13px] text-[var(--text-muted)]">AI is identifying medicines and dosages</p>

          <div className="mt-8 w-full max-w-[320px] space-y-3 text-left">
            {['Detecting text & handwriting', 'Identifying medicines', 'Looking up alternatives'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: i < 2 ? 'var(--sage)' : 'rgba(90,138,110,0.2)' }}>
                  {i < 2
                    ? <svg className="h-3 w-3 text-[var(--cream)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--sage)]" />}
                </div>
                <span className="text-[13px]" style={{ color: i < 2 ? 'var(--cream)' : 'var(--text-muted)' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(90,138,110,0.2)' }}>
                <svg className="h-3.5 w-3.5 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-[13px] font-semibold text-[var(--sage)]">{MOCK_RESULTS.length} medicines detected</span>
            </div>
            <button onClick={reset} className="text-[12px] text-[var(--text-muted)] underline hover:text-[var(--cream)]">
              Scan another
            </button>
          </div>

          {preview && (
            <div className="mb-6 flex gap-4 rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
              <img src={preview} alt="prescription" className="h-24 shrink-0 rounded-lg object-cover" style={{ width: '72px' }} />
              <div>
                <p className="mb-0.5 text-[13px] font-semibold text-[var(--cream)]">Dr. Tariq Ahmad</p>
                <p className="mb-1 text-[12px] text-[var(--text-muted)]">Scanned just now</p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]"
                  style={{ background: 'rgba(90,138,110,0.12)' }}>98% confidence</span>
              </div>
            </div>
          )}

          <div className="mb-6 space-y-3">
            {MOCK_RESULTS.map((med) => (
              <div key={med.name} className="rounded-2xl p-5 transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-[15px] font-bold text-[var(--cream)]">{med.name}</p>
                    <p className="text-[12px] text-[var(--text-muted)]">{med.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-[var(--sage)]"
                    style={{ background: 'rgba(90,138,110,0.12)' }}>{med.confidence}% match</span>
                </div>
                <p className="mb-4 rounded-lg px-3 py-2 text-[12px] text-[var(--text-muted)]"
                  style={{ background: 'rgba(5,10,8,0.5)' }}>📋 {med.dose}</p>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/app/pricing')}
                    className="flex-1 rounded-full py-2 text-[12px] font-semibold text-[var(--cream)] transition-all hover:-translate-y-px"
                    style={{ background: 'var(--sage)', boxShadow: '0 0 12px rgba(90,138,110,0.3)' }}>
                    Compare Prices
                  </button>
                  <button onClick={() => navigate('/app/know')}
                    className="flex-1 rounded-full border py-2 text-[12px] font-semibold text-[var(--cream)] transition-all hover:bg-[rgba(90,138,110,0.08)]"
                    style={{ borderColor: 'rgba(90,138,110,0.3)' }}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/app/pricing')}
              className="flex-1 rounded-full py-3.5 text-sm font-bold text-[var(--cream)] transition-all hover:-translate-y-px"
              style={{ background: 'var(--sage)', boxShadow: '0 0 20px rgba(90,138,110,0.4)' }}>
              View All Pricing →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
