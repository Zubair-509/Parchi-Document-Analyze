import { useState } from 'react'

const meds = [
  {
    name: 'Augmentin 625mg',
    type: 'Antibiotic',
    branded: { name: 'Augmentin (GSK)', price: 1200 },
    alternatives: [
      { name: 'Amoxiclav 625mg', brand: 'AGP Pharma', price: 380, who: true },
      { name: 'Clavupen 625mg', brand: 'Hilton Pharma', price: 420, who: true },
      { name: 'Augpen 625mg', brand: 'Pharmevo', price: 395, who: false },
    ],
  },
  {
    name: 'Panadol 500mg',
    type: 'Analgesic',
    branded: { name: 'Panadol (GSK)', price: 180 },
    alternatives: [
      { name: 'Paracetamol 500mg', brand: 'Genome Pharma', price: 35, who: true },
      { name: 'Calpol 500mg', brand: 'Abbott', price: 55, who: true },
    ],
  },
  {
    name: 'Nexium 40mg',
    type: 'Proton Pump Inhibitor',
    branded: { name: 'Nexium (AstraZeneca)', price: 980 },
    alternatives: [
      { name: 'Esomeprazole 40mg', brand: 'Saffron Pharma', price: 210, who: true },
      { name: 'Emzo 40mg', brand: 'Medipak', price: 195, who: false },
    ],
  },
]

const totalBranded = meds.reduce((s, m) => s + m.branded.price, 0)
const totalCheapest = meds.reduce((s, m) => s + Math.min(...m.alternatives.map(a => a.price)), 0)
const totalSaved = totalBranded - totalCheapest

export default function PricingComparisons() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Pricing Comparisons</h1>
        <p className="text-[14px] text-[var(--text-muted)]">Same formula, fraction of the price — WHO-approved generics only.</p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3 rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.14)' }}>
        <div className="text-center">
          <p className="mb-0.5 font-mono text-xl font-bold text-[var(--coral)]">Rs {totalBranded.toLocaleString()}</p>
          <p className="text-[11px] text-[var(--text-muted)]">Branded total</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full px-3 py-1 text-xs font-bold text-[var(--sage)]"
            style={{ background: 'rgba(90,138,110,0.15)' }}>
            Save {Math.round((totalSaved / totalBranded) * 100)}%
          </div>
          <svg className="mt-1 h-4 w-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="mb-0.5 font-mono text-xl font-bold text-[var(--sage)]">Rs {totalCheapest.toLocaleString()}</p>
          <p className="text-[11px] text-[var(--text-muted)]">Cheapest generics</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Per medicine</p>
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--coral)' }} />Branded</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--sage)' }} />Generic</span>
        </div>
      </div>

      <div className="space-y-4">
        {meds.map((med, i) => {
          const cheapest = Math.min(...med.alternatives.map(a => a.price))
          const saving = med.branded.price - cheapest
          const savingPct = Math.round((saving / med.branded.price) * 100)
          const maxPrice = med.branded.price
          const open = selected === i

          return (
            <div key={med.name} className="overflow-hidden rounded-2xl transition-all duration-200"
              style={{ background: 'var(--bg-card)', border: `1px solid ${open ? 'rgba(90,138,110,0.3)' : 'rgba(90,138,110,0.12)'}` }}>

              <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setSelected(open ? null : i)}>
                <div>
                  <p className="font-display text-[15px] font-bold text-[var(--cream)]">{med.name}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">{med.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-[var(--coral)] line-through opacity-60">Rs {med.branded.price}</p>
                    <p className="font-mono text-base font-bold text-[var(--sage)]">Rs {cheapest}</p>
                  </div>
                  <div className="rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--sage)]"
                    style={{ background: 'rgba(90,138,110,0.15)' }}>-{savingPct}%</div>
                  <svg className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {open && (
                <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="text-[var(--text-muted)]">{med.branded.name}</span>
                      <span className="font-mono font-bold text-[var(--coral)]">Rs {med.branded.price}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(232,130,107,0.15)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ background: 'var(--coral)', width: '100%' }} />
                    </div>
                  </div>

                  {med.alternatives.map((alt) => (
                    <div key={alt.name} className="mb-3">
                      <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[12px]">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate text-[var(--cream)]">{alt.name}</span>
                          <span className="shrink-0 text-[var(--text-muted)]">· {alt.brand}</span>
                          {alt.who && (
                            <span className="shrink-0 rounded px-1 py-px text-[9px] font-bold uppercase tracking-wider text-[#6b9fd4]"
                              style={{ background: 'rgba(107,159,212,0.12)' }}>WHO</span>
                          )}
                        </div>
                        <span className="shrink-0 font-mono font-bold text-[var(--sage)]">Rs {alt.price}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(90,138,110,0.12)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ background: 'var(--sage)', width: `${(alt.price / maxPrice) * 100}%` }} />
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: 'rgba(90,138,110,0.07)', border: '1px solid rgba(90,138,110,0.15)' }}>
                    <p className="text-[13px] text-[var(--text-muted)]">Savings on this medicine</p>
                    <p className="font-mono font-bold text-[var(--sage)]">Rs {saving} ({savingPct}%)</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl p-5" style={{ background: 'rgba(90,138,110,0.07)', border: '1px solid rgba(90,138,110,0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[var(--cream)]">Total savings — all generics</p>
            <p className="text-[12px] text-[var(--text-muted)]">Using cheapest WHO-approved option per medicine</p>
          </div>
          <p className="font-mono text-2xl font-black text-[var(--sage)]">Rs {totalSaved.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
