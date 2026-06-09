import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrescription, type Medicine } from '../../contexts/PrescriptionContext'
import { useAuth } from '../../contexts/AuthContext'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const foodLabel = (r: string) => {
  const m: Record<string, string> = { before_food: 'Before food', after_food: 'After food', with_food: 'With food', anytime: 'Any time' }
  return m[r] ?? r
}

function SectionHeader({ icon, label, color = 'var(--sage)' }: { icon: React.ReactNode; label: string; color?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color }}>{label}</p>
    </div>
  )
}

function MedDetail({ med }: { med: Medicine }) {
  const [showUrdu, setShowUrdu] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.15)', borderTop: '3px solid var(--sage)' }}>
        <div>
          <p className="mb-0.5 font-display text-lg font-bold text-[var(--cream)]">{med.medicine_name}</p>
          <p className="mb-3 text-[13px] text-[var(--text-muted)]">
            {[med.active_formula, med.formula_urdu].filter(Boolean).join(' · ')}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]"
              style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
              📋 {med.dosage}
            </span>
            {med.duration && (
              <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]"
                style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
                ⏱ {med.duration}
              </span>
            )}
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]"
              style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
              🍽 {foodLabel(med.food_relation)}
            </span>
          </div>
        </div>
        <button onClick={() => setShowUrdu(v => !v)}
          className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
          style={showUrdu
            ? { background: 'var(--sage)', color: 'var(--cream)' }
            : { border: '1px solid rgba(90,138,110,0.3)', color: 'var(--text-muted)' }}>
          {showUrdu ? 'English' : 'اردو'}
        </button>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
        <SectionHeader label="What it does" icon={
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        } />
        {showUrdu && med.explanation_urdu ? (
          <p className="urdu text-[15px] leading-[2.2] text-[var(--cream)]" style={{ textShadow: '0 1px 6px rgba(5,10,8,0.6)' }}>
            {med.explanation_urdu}
          </p>
        ) : (
          <p className="text-[14px] leading-relaxed text-[var(--text-muted)]">{med.purpose}</p>
        )}
      </div>

      {med.common_side_effects.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
          <SectionHeader label="Side effects" color="var(--coral)" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          } />
          <ul className="space-y-2">
            {med.common_side_effects.map(s => (
              <li key={s} className="flex items-start gap-2 text-[13px] text-[var(--text-muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
                {s}
              </li>
            ))}
          </ul>
          {med.important_warning && (
            <div className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-[13px]"
              style={{ background: 'rgba(232,130,107,0.08)', border: '1px solid rgba(232,130,107,0.2)', color: 'var(--coral)' }}>
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>{med.important_warning}</span>
            </div>
          )}
        </div>
      )}

      {med.evidence && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
          <SectionHeader label="Clinical evidence" color="#6b9fd4" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          } />
          <div className="mb-3 flex flex-wrap gap-2">
            {med.evidence.who_essential && (
              <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b9fd4]"
                style={{ background: 'rgba(107,159,212,0.12)' }}>WHO Essential</span>
            )}
            {med.evidence.evidence_strength && (
              <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b9fd4]"
                style={{ background: 'rgba(107,159,212,0.08)' }}>
                {med.evidence.evidence_strength.replace('_', ' ')} evidence
              </span>
            )}
          </div>
          {med.evidence.common_indications?.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Common uses</p>
              <div className="flex flex-wrap gap-1.5">
                {med.evidence.common_indications.map(ind => (
                  <span key={ind} className="rounded-full px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
                    style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.1)' }}>{ind}</span>
                ))}
              </div>
            </div>
          )}
          {med.evidence.evidence_note && (
            <p className="mb-3 text-[13px] leading-relaxed text-[var(--text-muted)]">{med.evidence.evidence_note}</p>
          )}
          {med.evidence.doctor_question_urdu && (
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(107,159,212,0.06)', border: '1px solid rgba(107,159,212,0.12)' }}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#6b9fd4]">اپنے ڈاکٹر سے پوچھیں</p>
              <p className="urdu text-[13px] leading-[2] text-[var(--cream)]" style={{ textShadow: '0 1px 4px rgba(5,10,8,0.6)' }}>
                {med.evidence.doctor_question_urdu}
              </p>
              {med.evidence.doctor_question_english && (
                <p className="mt-1 text-[12px] text-[var(--text-muted)] italic">{med.evidence.doctor_question_english}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UploadBox({
  label,
  urduLabel,
  icon,
  accept,
  files,
  onFiles,
  multiple = false,
  accentColor = 'rgba(90,138,110,0.35)',
  accentBg = 'rgba(90,138,110,0.04)',
  required = false,
}: {
  label: string
  urduLabel: string
  icon: React.ReactNode
  accept: string
  files: File[]
  onFiles: (files: File[]) => void
  multiple?: boolean
  accentColor?: string
  accentBg?: string
  required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    if (picked.length) onFiles(multiple ? [...files, ...picked] : picked)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeFile = (i: number) => {
    onFiles(files.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center rounded-2xl px-6 py-8 text-center transition-colors duration-200 cursor-pointer"
        style={{ border: `2px dashed ${accentColor}`, background: accentBg }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const dropped = Array.from(e.dataTransfer.files)
          if (dropped.length) onFiles(multiple ? [...files, ...dropped] : dropped)
        }}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: accentBg, border: `1px solid ${accentColor}` }}>
          {icon}
        </div>
        <p className="mb-1 text-[14px] font-semibold text-[var(--cream)]">
          {label} {required && <span style={{ color: 'var(--coral)' }}>*</span>}
        </p>
        <p className="urdu mb-3 text-[13px] text-[var(--text-muted)]" dir="rtl" style={{ lineHeight: 2 }}>{urduLabel}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold text-[var(--cream)]"
          style={{ background: accentColor }}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          {files.length ? 'Add more' : 'Choose file'}
        </span>
        <p className="mt-2 text-[11px] text-[var(--text-muted)]">JPG · PNG · PDF · Drag & drop</p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.15)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <svg className="h-4 w-4 shrink-0 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span className="truncate text-[12px] text-[var(--cream)]">{f.name}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); removeFile(i) }}
                className="ml-3 shrink-0 rounded-full p-1 text-[var(--text-muted)] hover:text-[var(--coral)] transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function KnowYourPrescription() {
  const { result, setAnalysis, clearAnalysis } = usePrescription()
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([])
  const [reportFiles, setReportFiles] = useState<File[]>([])
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'error'>('upload')
  const [apiError, setApiError] = useState('')

  const analyze = async () => {
    if (!prescriptionFiles[0]) return
    setStage('analyzing')
    setApiError('')
    try {
      const prescFile = prescriptionFiles[0]
      const imageData = await fileToBase64(prescFile)
      const mimeType = prescFile.type || 'image/jpeg'

      const contextImages = await Promise.all(
        reportFiles.map(async f => ({
          imageData: await fileToBase64(f),
          mimeType: f.type || 'image/jpeg',
        }))
      )

      const res = await fetch('/api/prescription/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          imageData,
          mimeType,
          ...(contextImages.length > 0 ? { contextImages } : {}),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data, URL.createObjectURL(prescFile))
      setActive(0)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Could not analyze prescription')
      setStage('error')
    }
  }

  const reset = () => {
    clearAnalysis()
    setPrescriptionFiles([])
    setReportFiles([])
    setStage('upload')
    setApiError('')
  }

  if (result && result.medicines.length > 0) {
    const meds = result.medicines
    const med = meds[active]
    return (
      <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Know Your Prescription</h1>
            <p className="text-[14px] text-[var(--text-muted)]">What each medicine does, side effects, and questions to ask your doctor.</p>
          </div>
          <button onClick={reset}
            className="shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold text-[var(--text-muted)] transition-all hover:text-[var(--cream)]"
            style={{ borderColor: 'rgba(90,138,110,0.25)' }}>
            Upload new
          </button>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {meds.map((m, i) => (
            <button key={m.id} onClick={() => setActive(i)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150"
              style={active === i
                ? { background: 'var(--sage)', color: 'var(--cream)', boxShadow: '0 0 14px rgba(90,138,110,0.35)' }
                : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid rgba(90,138,110,0.15)' }}>
              {m.medicine_name.split(' ')[0]}
            </button>
          ))}
        </div>

        <MedDetail key={med.id} med={med} />

        <p className="mt-6 text-center text-[11px] text-[var(--text-muted)]" style={{ opacity: 0.55 }}>
          {result.disclaimer}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-2">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Know Your Prescription</h1>
        <p className="text-[14px] text-[var(--text-muted)]">Upload your prescription — and optionally your test reports — for richer, more personalised medicine explanations.</p>
      </div>

      {stage === 'analyzing' && (
        <div className="flex flex-col items-center py-20">
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
          <p className="mb-1 font-display text-lg font-bold text-[var(--cream)]">Gemini is reading your prescription…</p>
          <p className="text-[13px] text-[var(--text-muted)]">
            {reportFiles.length > 0
              ? `Using ${reportFiles.length} test report${reportFiles.length > 1 ? 's' : ''} for richer context`
              : 'Identifying medicines and dosages'}
          </p>
        </div>
      )}

      {stage === 'error' && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'rgba(232,130,107,0.12)', border: '1px solid rgba(232,130,107,0.3)' }}>
            <svg className="h-7 w-7 text-[var(--coral)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">Analysis failed</p>
          <p className="mb-8 max-w-[340px] text-[13px] text-[var(--text-muted)]">{apiError}</p>
          <button onClick={() => setStage('upload')}
            className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)]" style={{ background: 'var(--sage)' }}>
            Try again
          </button>
        </div>
      )}

      {stage === 'upload' && (
        <div className="mt-6 space-y-6">

          {/* ── Box 1: Prescription (required) ── */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-[var(--cream)]"
                style={{ background: 'var(--sage)' }}>1</div>
              <p className="text-[13px] font-bold text-[var(--cream)]">Upload your prescription</p>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--sage)]"
                style={{ background: 'rgba(90,138,110,0.12)' }}>Required</span>
            </div>
            <UploadBox
              label="Prescription photo or scan"
              urduLabel="اپنا نسخہ یہاں اپ لوڈ کریں"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              files={prescriptionFiles}
              onFiles={setPrescriptionFiles}
              required
              accentColor="rgba(90,138,110,0.4)"
              accentBg="rgba(90,138,110,0.05)"
              icon={
                <svg className="h-7 w-7 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              }
            />
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(90,138,110,0.12)' }} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">+ Add context</span>
            <div className="h-px flex-1" style={{ background: 'rgba(90,138,110,0.12)' }} />
          </div>

          {/* ── Box 2: Test Reports (optional) ── */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: 'rgba(107,159,212,0.18)', color: '#6b9fd4' }}>2</div>
              <p className="text-[13px] font-bold text-[var(--cream)]">Upload test reports / lab results</p>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6b9fd4]"
                style={{ background: 'rgba(107,159,212,0.12)' }}>Optional</span>
            </div>
            <div className="mb-3 flex items-start gap-2 rounded-xl px-4 py-3 text-[12px]"
              style={{ background: 'rgba(107,159,212,0.06)', border: '1px solid rgba(107,159,212,0.15)', color: '#6b9fd4' }}>
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Sharing your blood tests, X-ray reports, or lab results helps Gemini understand <strong>why</strong> each medicine was prescribed and give you sharper, more personalised explanations.</span>
            </div>
            <UploadBox
              label="Test reports or lab results"
              urduLabel="ٹیسٹ رپورٹ یا لیب نتائج اپ لوڈ کریں"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,application/pdf,.pdf"
              files={reportFiles}
              onFiles={setReportFiles}
              multiple
              accentColor="rgba(107,159,212,0.35)"
              accentBg="rgba(107,159,212,0.04)"
              icon={
                <svg className="h-7 w-7 text-[#6b9fd4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8"/>
                </svg>
              }
            />
          </div>

          {/* ── Analyze button ── */}
          <button
            disabled={!prescriptionFiles[0]}
            onClick={analyze}
            className="w-full rounded-full py-4 text-sm font-bold text-[var(--cream)] transition-all duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--sage)', boxShadow: prescriptionFiles[0] ? '0 0 24px rgba(90,138,110,0.45)' : 'none' }}>
            {reportFiles.length > 0
              ? `Analyze prescription + ${reportFiles.length} report${reportFiles.length > 1 ? 's' : ''} →`
              : 'Analyze prescription →'}
          </button>

          {/* Already have results from Analyze page */}
          <p className="text-center text-[12px] text-[var(--text-muted)]">
            Or{' '}
            <button onClick={() => navigate('/app/analyze')}
              className="underline hover:text-[var(--cream)] transition-colors">
              scan in the Analyze page
            </button>
            {' '}and come back here for detailed explanations.
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
            <svg className="h-3.5 w-3.5 shrink-0 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Your files are never stored — processed and discarded immediately
          </div>
        </div>
      )}
    </div>
  )
}
