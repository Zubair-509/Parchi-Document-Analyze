export default function Footer() {
  return (
    <footer className="border-t bg-[var(--bg-deep)]" style={{ borderColor: 'rgba(90,138,110,0.12)' }}>
      <div className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-3 font-display text-2xl font-bold tracking-tight text-[var(--cream)]">
              Parchi<span style={{ color: 'var(--sage)' }}>.</span>
            </div>
            <p className="mb-4 max-w-[300px] text-[14px] leading-relaxed text-[var(--text-muted)]">
              AI-powered prescription and lab report explainer for Pakistani patients. Understand. Question. Afford.
            </p>
            <p className="urdu text-sm text-[var(--sage)]" style={{ lineHeight: '2', textShadow: '0 1px 6px rgba(5,10,8,0.7)' }}>
              اپنا نسخہ سمجھیں۔ سوال کریں۔ خریدیں۔
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Product</p>
            <ul className="space-y-3">
              {['How it works', 'Prescription Scanner', 'Lab Report Reader', 'Generic Alternatives'].map(l => (
                <li key={l}>
                  <a href="#" className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--cream)]">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Company</p>
            <ul className="space-y-3">
              {['About Us', 'Privacy Policy', 'Contact', 'Signup / Login'].map(l => (
                <li key={l}>
                  <a href="#" className="text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--cream)]">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
          <p className="text-[12px] text-[var(--text-muted)]">© 2026 Parchi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
