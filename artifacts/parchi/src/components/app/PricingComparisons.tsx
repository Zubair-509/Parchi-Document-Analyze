import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrescription } from '../../contexts/PrescriptionContext'
import { useAuth } from '../../contexts/AuthContext'

type GenericAlt = {
  brand_name: string
  manufacturer?: string | null
  price_per_tablet_pkr?: number | null
  tier: string
  note?: string | null
  who_verified?: boolean
}

type Medicine = {
  id: string
  medicine_name: string
  standard_name?: string | null
  active_formula?: string | null
  generic_alternatives: GenericAlt[]
}

const tierColor = (tier: string) => {
  if (tier === 'affordable') return 'var(--sage)'
  if (tier === 'expensive') return 'var(--coral)'
  return '#d4a94e'
}

function MedicineList({ meds }: { meds: Medicine[] }) {
  const [selected, setSelected] = useState<string | null>(null)

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
    <>
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
                            {alt.who_verified && (
                              <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                style={{ background: 'rgba(90,138,110,0.15)', color: 'var(--sage)' }}>WHO ✓</span>
                            )}
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
    </>
  )
}

function ManualLookup() {
  const { token } = useAuth()
  const [rows, setRows] = useState([{ name: '' }])
  const [stage, setStage] = useState<'form' | 'loading' | 'result' | 'error'>('form')
  const [error, setError] = useState('')
  const [result, setResult] = useState<Medicine[] | null>(null)

  const addRow = () => setRows(r => [...r, { name: '' }])
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i))
  const updateRow = (i: number, val: string) => setRows(r => r.map((row, idx) => idx === i ? { name: val } : row))

  const filledNames = rows.map(r => r.name.trim()).filter(Boolean)

  const lookup = async () => {
    if (filledNames.length === 0) return
    setStage('loading')
    setError('')
    try {
      const res = await fetch('/api/prescription/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ medicines: filledNames }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lookup failed')
      setResult(data.medicines)
      setStage('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not look up medicines')
      setStage('error')
    }
  }

  const reset = () => {
    setRows([{ name: '' }])
    setStage('form')
    setResult(null)
    setError('')
  }

  if (stage === 'loading') {
    return (
      <div className="flex flex-col items-center py-20">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full opacity-25" style={{ background: 'var(--sage)' }} />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'var(--sage)' }}>
            <svg className="h-5 w-5 animate-spin text-[var(--cream)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <p className="mb-1 font-display text-lg font-bold text-[var(--cream)]">Looking up Pakistan prices…</p>
        <p className="text-[13px] text-[var(--text-muted)]">Finding DRAP-registered WHO-verified alternatives</p>
      </div>
    )
  }

  if (stage === 'error') {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'rgba(232,130,107,0.12)', border: '1px solid rgba(232,130,107,0.3)' }}>
          <svg className="h-7 w-7 text-[var(--coral)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">Lookup failed</p>
        <p className="mb-8 max-w-[340px] text-[13px] text-[var(--text-muted)]">{error}</p>
        <button onClick={reset}
          className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)]" style={{ background: 'var(--sage)' }}>
          Try again
        </button>
      </div>
    )
  }

  if (stage === 'result' && result) {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[13px] text-[var(--text-muted)]">{result.length} medicine{result.length !== 1 ? 's' : ''} — DRAP prices · WHO-verified generics</p>
          <button onClick={reset}
            className="shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold text-[var(--text-muted)] transition-all hover:text-[var(--cream)]"
            style={{ borderColor: 'rgba(90,138,110,0.25)' }}>
            Look up more
          </button>
        </div>
        <MedicineList meds={result} />
      </>
    )
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid rgba(90,138,110,0.14)' }}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'rgba(90,138,110,0.1)' }}>
          <svg className="h-5 w-5 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        </div>
        <div>
          <p className="font-display text-[15px] font-bold text-[var(--cream)]">Enter medicine names</p>
          <p className="text-[12px] text-[var(--text-muted)]">Type the brand or generic name — we'll find DRAP-registered WHO-verified cheaper alternatives with Pakistan prices.</p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(90,138,110,0.12)', color: 'var(--sage)' }}>{i + 1}</div>
            <input
              type="text"
              placeholder={i === 0 ? 'e.g. Augmentin, Panadol, Glucophage…' : 'Medicine name'}
              value={row.name}
              onChange={e => updateRow(i, e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addRow() }}
              className="flex-1 rounded-xl px-4 py-2.5 text-[13px] text-[var(--cream)] outline-none placeholder:text-[var(--text-muted)]"
              style={{ background: 'rgba(90,138,110,0.06)', border: '1px solid rgba(90,138,110,0.18)' }}
              autoFocus={i === rows.length - 1 && i > 0}
            />
            {rows.length > 1 && (
              <button onClick={() => removeRow(i)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--coral)] transition-colors">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <button onClick={addRow}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
          style={{ color: 'var(--sage)', background: 'rgba(90,138,110,0.1)' }}>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add another medicine
        </button>
      </div>

      <button
        disabled={filledNames.length === 0}
        onClick={lookup}
        className="w-full rounded-full py-3.5 text-sm font-bold text-[var(--cream)] transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: 'var(--sage)', boxShadow: filledNames.length > 0 ? '0 0 18px rgba(90,138,110,0.35)' : 'none' }}>
        {filledNames.length > 0
          ? `Find cheaper alternatives for ${filledNames.length} medicine${filledNames.length > 1 ? 's' : ''} →`
          : 'Enter at least one medicine name'}
      </button>

      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
        <svg className="h-3.5 w-3.5 shrink-0 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        DRAP-registered · WHO Essential Medicines · Pakistan retail prices
      </div>
    </div>
  )
}

export default function PricingComparisons() {
  const { result } = usePrescription()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'scan' | 'manual'>(result?.medicines?.length ? 'scan' : 'manual')

  const meds = result?.medicines ?? []
  const hasScan = meds.length > 0

  return (
    <div className="mx-auto max-w-[780px] px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-2xl font-bold text-[var(--cream)]">Pricing Comparisons</h1>
          <p className="text-[14px] text-[var(--text-muted)]">Same formula, fraction of the price — DRAP-registered · WHO-verified generics.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-full p-0.5 text-[11px] font-bold"
          style={{ background: 'rgba(90,138,110,0.1)', border: '1px solid rgba(90,138,110,0.18)' }}>
          <button
            onClick={() => setMode('manual')}
            className="rounded-full px-3 py-1.5 transition-all"
            style={mode === 'manual'
              ? { background: 'var(--sage)', color: 'var(--cream)' }
              : { color: 'var(--text-muted)' }}>
            Enter manually
          </button>
          {hasScan && (
            <button
              onClick={() => setMode('scan')}
              className="rounded-full px-3 py-1.5 transition-all"
              style={mode === 'scan'
                ? { background: 'var(--sage)', color: 'var(--cream)' }
                : { color: 'var(--text-muted)' }}>
              From scan
            </button>
          )}
        </div>
      </div>

      {mode === 'manual' && <ManualLookup />}

      {mode === 'scan' && hasScan && <MedicineList meds={meds as Medicine[]} />}

      {mode === 'scan' && !hasScan && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="mb-2 font-display text-lg font-bold text-[var(--cream)]">No prescription scanned yet</p>
          <p className="mb-6 text-[13px] text-[var(--text-muted)]">Scan a prescription to see its pricing comparisons here, or use "Enter manually" above.</p>
          <button onClick={() => navigate('/app/analyze')}
            className="rounded-full px-6 py-3 text-sm font-semibold text-[var(--cream)] transition-all hover:-translate-y-px"
            style={{ background: 'var(--sage)', boxShadow: '0 0 18px rgba(90,138,110,0.35)' }}>
            ← Scan a prescription
          </button>
        </div>
      )}
    </div>
  )
}
