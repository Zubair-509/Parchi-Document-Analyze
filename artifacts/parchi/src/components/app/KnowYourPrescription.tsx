import { useState } from 'react'

const meds = [
  {
    name: 'Augmentin 625mg',
    generic: 'Amoxicillin + Clavulanate',
    class: 'Antibiotic',
    dose: '1 tablet twice daily with food',
    duration: '7 days — complete the full course',
    purpose: {
      en: 'Augmentin is a combination antibiotic used to treat bacterial infections — including chest infections, ear infections, urinary tract infections, and skin infections. It kills bacteria by stopping them from forming cell walls.',
      ur: 'اگمینٹن ایک اینٹی بائیوٹک دوا ہے جو بیکٹیریل انفیکشن کے علاج کے لیے استعمال ہوتی ہے — جیسے سینے، کان، پیشاب اور جلد کی انفیکشن۔',
    },
    sideEffects: {
      mild: ['Nausea or upset stomach', 'Diarrhoea', 'Rash or skin itching', 'Headache'],
      severe: ['Severe allergic reaction (rash, swelling, difficulty breathing)', 'Yellowing of skin or eyes (jaundice)', 'Severe diarrhoea with blood'],
    },
    whenNotTo: [
      'Allergy to penicillin or cephalosporin antibiotics',
      'History of liver problems caused by Augmentin',
      'Severe kidney disease (without dose adjustment)',
      'Mononucleosis (glandular fever)',
    ],
    interactions: ['Warfarin (blood thinner)', 'Methotrexate', 'Oral contraceptives (may reduce effectiveness)'],
  },
  {
    name: 'Panadol 500mg',
    generic: 'Paracetamol',
    class: 'Analgesic / Antipyretic',
    dose: '1–2 tablets every 4–6 hours as needed',
    duration: 'Max 5 days without medical advice',
    purpose: {
      en: 'Paracetamol relieves mild to moderate pain (headache, toothache, back pain, period pain) and reduces fever. It works by blocking pain signals in the brain and reducing elevated body temperature.',
      ur: 'پیناڈول ہلکے سے درمیانے درجے کے درد کو کم کرتا ہے — جیسے سردرد، دانت کا درد — اور بخار اتارتا ہے۔',
    },
    sideEffects: {
      mild: ['Rarely causes side effects at normal doses', 'Nausea in some people'],
      severe: ['Liver damage — only with overdose or alcohol use', 'Severe skin reactions (very rare)'],
    },
    whenNotTo: [
      'Liver disease or heavy alcohol use',
      'Already taking other paracetamol-containing medicines',
      'Allergy to paracetamol',
    ],
    interactions: ['Warfarin (high doses)', 'Alcohol (increases liver risk)', 'Other paracetamol products'],
  },
  {
    name: 'Nexium 40mg',
    generic: 'Esomeprazole',
    class: 'Proton Pump Inhibitor (PPI)',
    dose: '1 tablet once daily — swallow whole, before eating',
    duration: '14 days (short course) — do not exceed without review',
    purpose: {
      en: 'Nexium reduces the amount of acid your stomach produces. It is used for heartburn, acid reflux (GERD), stomach ulcers, and to protect the stomach lining when taking anti-inflammatory medicines.',
      ur: 'نیگزیم معدے میں تیزاب کی پیداوار کم کرتا ہے۔ یہ سینے کی جلن، تیزابیت اور معدے کے السر کے علاج میں استعمال ہوتا ہے۔',
    },
    sideEffects: {
      mild: ['Headache', 'Nausea', 'Diarrhoea or constipation', 'Stomach pain or gas'],
      severe: ['Severe magnesium deficiency (long-term use)', 'Clostridium difficile infection', 'Bone fracture risk (long-term high dose)'],
    },
    whenNotTo: [
      'Allergy to esomeprazole or other PPIs',
      'Taking rilpivirine (HIV medicine)',
      'Without doctor supervision for more than 4 weeks',
    ],
    interactions: ['Clopidogrel (reduced effectiveness)', 'Methotrexate', 'Digoxin', 'Rilpivirine'],
  },
]

function SectionHeader({ icon, label, color = 'var(--sage)' }: { icon: React.ReactNode; label: string; color?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span style={{ color }}>{icon}</span>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color }}>{label}</p>
    </div>
  )
}

export default function KnowYourPrescription() {
  const [active, setActive] = useState(0)
  const [showUrdu, setShowUrdu] = useState(false)
  const med = meds[active]

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Know Your Prescription</h1>
        <p className="text-[14px] text-[var(--text-muted)]">What each medicine does, its side effects, and when to avoid it.</p>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {meds.map((m, i) => (
          <button key={m.name} onClick={() => setActive(i)}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150"
            style={active === i
              ? { background: 'var(--sage)', color: 'var(--cream)', boxShadow: '0 0 14px rgba(90,138,110,0.35)' }
              : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid rgba(90,138,110,0.15)' }}>
            {m.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.15)', borderTop: '3px solid var(--sage)' }}>
        <div>
          <p className="mb-0.5 font-display text-lg font-bold text-[var(--cream)]">{med.name}</p>
          <p className="mb-3 text-[13px] text-[var(--text-muted)]">{med.generic} · {med.class}</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]"
              style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
              📋 {med.dose}
            </span>
            <span className="rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-muted)]"
              style={{ background: 'rgba(5,10,8,0.5)', border: '1px solid rgba(90,138,110,0.12)' }}>
              ⏱ {med.duration}
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

      <div className="space-y-4">
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
          <SectionHeader label="What it does" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          } />
          {showUrdu
            ? <p className="urdu text-[15px] leading-[2.2] text-[var(--cream)]" style={{ textShadow: '0 1px 6px rgba(5,10,8,0.6)' }}>{med.purpose.ur}</p>
            : <p className="text-[14px] leading-relaxed text-[var(--text-muted)]">{med.purpose.en}</p>}
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
          <SectionHeader label="Side effects" color="var(--coral)" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          } />

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Common (mild)</p>
          <ul className="mb-4 space-y-1.5">
            {med.sideEffects.mild.map(s => (
              <li key={s} className="flex items-start gap-2 text-[13px] text-[var(--text-muted)]">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
                {s}
              </li>
            ))}
          </ul>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--coral)]">Serious — see a doctor immediately</p>
          <ul className="space-y-1.5">
            {med.sideEffects.severe.map(s => (
              <li key={s} className="flex items-start gap-2 text-[13px] text-[var(--coral)]" style={{ opacity: 0.85 }}>
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--coral)]" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'rgba(232,130,107,0.06)', border: '1px solid rgba(232,130,107,0.18)' }}>
          <SectionHeader label="When NOT to take" color="var(--coral)" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          } />
          <ul className="space-y-2">
            {med.whenNotTo.map(w => (
              <li key={w} className="flex items-start gap-2.5 text-[13px]" style={{ color: 'rgba(232,130,107,0.9)' }}>
                <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.12)' }}>
          <SectionHeader label="Drug interactions" color="#6b9fd4" icon={
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          } />
          <p className="mb-3 text-[12px] text-[var(--text-muted)]">Tell your doctor if you are taking any of these:</p>
          <div className="flex flex-wrap gap-2">
            {med.interactions.map(d => (
              <span key={d} className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#6b9fd4]"
                style={{ background: 'rgba(107,159,212,0.1)', border: '1px solid rgba(107,159,212,0.2)' }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] text-[var(--text-muted)]" style={{ opacity: 0.6 }}>
        This information is for educational purposes. Always follow your doctor's instructions.
      </p>
    </div>
  )
}
