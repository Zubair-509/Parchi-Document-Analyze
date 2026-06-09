import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrescription, type Medicine } from '../../contexts/PrescriptionContext'

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
      {/* Header */}
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

      {/* What it does */}
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

      {/* Side effects */}
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

      {/* Evidence */}
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

export default function KnowYourPrescription() {
  const { result } = usePrescription()
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  if (!result || result.medicines.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(90,138,110,0.08)', border: '1px solid rgba(90,138,110,0.15)' }}>
          <svg className="h-8 w-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">No prescription scanned yet</p>
        <p className="mb-8 text-[13px] text-[var(--text-muted)]">Scan a prescription first to see detailed explanations in Urdu.</p>
        <button onClick={() => navigate('/app/analyze')}
          className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all hover:-translate-y-px"
          style={{ background: 'var(--sage)', boxShadow: '0 0 18px rgba(90,138,110,0.35)' }}>
          ← Scan a prescription
        </button>
      </div>
    )
  }

  const meds = result.medicines
  const med = meds[active]

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Know Your Prescription</h1>
        <p className="text-[14px] text-[var(--text-muted)]">What each medicine does, side effects, and questions to ask your doctor.</p>
      </div>

      {/* Medicine tabs */}
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
