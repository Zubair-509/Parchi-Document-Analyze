import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrescription } from '../../contexts/PrescriptionContext'

const tierColor = (tier: string) => {
  if (tier === 'affordable') return 'var(--sage)'
  if (tier === 'expensive') return 'var(--coral)'
  return '#d4a94e'
}

export default function PricingComparisons() {
  const { result } = usePrescription()
  const [selected, setSelected] = useState<string | null>(null)
  const navigate = useNavigate()

  if (!result || result.medicines.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(90,138,110,0.08)', border: '1px solid rgba(90,138,110,0.15)' }}>
          <svg className="h-8 w-8 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        </div>
        <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">No prescription scanned yet</p>
        <p className="mb-8 text-[13px] text-[var(--text-muted)]">Scan a prescription first to compare generic alternatives and prices.</p>
        <button onClick={() => navigate('/app/analyze')}
          className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all hover:-translate-y-px"
          style={{ background: 'var(--sage)', boxShadow: '0 0 18px rgba(90,138,110,0.35)' }}>
          ← Scan a prescription
        </button>
      </div>
    )
  }

  const meds = result.medicines

  // Total savings: cheapest vs most expensive per medicine
  const totalBranded = meds.reduce((s, m) => {
    const prices = m.generic_alternatives.filter(a => a.price_per_tablet_pkr).map(a => a.price_per_tablet_pkr!)
    return s + (prices.length ? Math.max(...prices) : 0)
  }, 0)
  const totalCheapest = meds.reduce((s, m) => {
    const prices = m.generic_alternatives.filter(a => a.price_per_tablet_pkr).map(a => a.price_per_tablet_pkr!)
    return s + (prices.length ? Math.min(...prices) : 0)
  }, 0)
  const totalSaved = totalBranded - totalCheapest
  const savePct = totalBranded > 0 ? Math.round((totalSaved / totalBranded) * 100) : 0

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Pricing Comparisons</h1>
        <p className="text-[14px] text-[var(--text-muted)]">Same formula, fraction of the price — WHO-approved generics.</p>
      </div>

      {/* Summary banner */}
      {totalBranded > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-3 rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.14)' }}>
          <div className="text-center">
            <p className="mb-0.5 font-mono text-xl font-bold text-[var(--coral)]">Rs {totalBranded}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Most expensive / tab</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full px-3 py-1 text-xs font-bold text-[var(--sage)]"
              style={{ background: 'rgba(90,138,110,0.15)' }}>Save {savePct}%</div>
            <svg className="mt-1 h-4 w-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="mb-0.5 font-mono text-xl font-bold text-[var(--sage)]">Rs {totalCheapest}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Cheapest generic / tab</p>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Per medicine</p>
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--coral)' }} />Expensive</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--sage)' }} />Affordable</span>
        </div>
      </div>

      <div className="space-y-4">
        {meds.map((med) => {
          const altsWithPrice = med.generic_alternatives.filter(a => a.price_per_tablet_pkr)
          const cheapest = altsWithPrice.length ? Math.min(...altsWithPrice.map(a => a.price_per_tablet_pkr!)) : null
          const priciest = altsWithPrice.length ? Math.max(...altsWithPrice.map(a => a.price_per_tablet_pkr!)) : null
          const saving = (cheapest !== null && priciest !== null) ? priciest - cheapest : null
          const savingPct = (saving !== null && priciest) ? Math.round((saving / priciest) * 100) : null
          const maxPrice = priciest ?? 1
          const open = selected === med.id

          return (
            <div key={med.id} className="overflow-hidden rounded-2xl transition-all duration-200"
              style={{ background: 'var(--bg-card)', border: `1px solid ${open ? 'rgba(90,138,110,0.3)' : 'rgba(90,138,110,0.12)'}` }}>

              <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setSelected(open ? null : med.id)}>
                <div>
                  <p className="font-display text-[15px] font-bold text-[var(--cream)]">{med.medicine_name}</p>
                  <p className="text-[12px] text-[var(--text-muted)]">{med.active_formula ?? med.standard_name ?? ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {priciest && <p className="font-mono text-sm font-bold text-[var(--coral)] line-through opacity-60">Rs {priciest}/tab</p>}
                    {cheapest && <p className="font-mono text-base font-bold text-[var(--sage)]">Rs {cheapest}/tab</p>}
                    {!cheapest && <p className="text-[12px] text-[var(--text-muted)]">No price data</p>}
                  </div>
                  {savingPct !== null && (
                    <div className="rounded-full px-2.5 py-1 text-[11px] font-bold text-[var(--sage)]"
                      style={{ background: 'rgba(90,138,110,0.15)' }}>-{savingPct}%</div>
                  )}
                  <svg className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </button>

              {open && (
                <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
                  <div className="space-y-3">
                    {med.generic_alternatives.map((alt, i) => (
                      <div key={i}>
                        <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[12px]">
                          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                            <span className="truncate text-[var(--cream)]">{alt.brand_name}</span>
                            {alt.manufacturer && <span className="shrink-0 text-[var(--text-muted)]">· {alt.manufacturer}</span>}
                            {alt.note && <span className="shrink-0 text-[var(--text-muted)]">· {alt.note}</span>}
                          </div>
                          <span className="shrink-0 font-mono font-bold" style={{ color: tierColor(alt.tier) }}>
                            {alt.price_per_tablet_pkr ? `Rs ${alt.price_per_tablet_pkr}/tab` : '—'}
                          </span>
                        </div>
                        {alt.price_per_tablet_pkr && (
                          <div className="h-2 rounded-full" style={{ background: 'rgba(90,138,110,0.12)' }}>
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ background: tierColor(alt.tier), width: `${(alt.price_per_tablet_pkr / maxPrice) * 100}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {saving !== null && (
                    <div className="mt-4 flex items-center justify-between rounded-xl px-4 py-3"
                      style={{ background: 'rgba(90,138,110,0.07)', border: '1px solid rgba(90,138,110,0.15)' }}>
                      <p className="text-[13px] text-[var(--text-muted)]">Savings per tablet</p>
                      <p className="font-mono font-bold text-[var(--sage)]">Rs {saving} ({savingPct}%)</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalSaved > 0 && (
        <div className="mt-6 rounded-2xl p-5" style={{ background: 'rgba(90,138,110,0.07)', border: '1px solid rgba(90,138,110,0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--cream)]">Max per-tablet savings — all generics</p>
              <p className="text-[12px] text-[var(--text-muted)]">Cheapest vs most expensive option per medicine</p>
            </div>
            <p className="font-mono text-2xl font-black text-[var(--sage)]">Rs {totalSaved}</p>
          </div>
        </div>
      )}
    </div>
  )
}
