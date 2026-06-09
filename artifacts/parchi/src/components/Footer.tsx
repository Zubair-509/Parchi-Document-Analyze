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

        {/* Bilingual medical disclaimer */}
        <div className="mb-6 rounded-2xl px-5 py-4 text-center" style={{ background: 'rgba(232,130,107,0.06)', border: '1px solid rgba(232,130,107,0.18)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="h-4 w-4 shrink-0 text-[var(--coral)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--coral)' }}>
              Parchi is AI and can make mistakes. Do not take any medicine without consultation with a doctor.
            </p>
          </div>
          <p className="text-[13px] font-semibold" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: '2.2', color: 'var(--coral)' }}>
            پرچی ایک AI ہے اور غلطی کر سکتی ہے۔ ڈاکٹر سے مشورے کے بغیر کوئی دوائی نہ لیں۔
          </p>
        </div>

        <div className="border-t pt-8 text-center" style={{ borderColor: 'rgba(90,138,110,0.1)' }}>
          <p className="text-[12px] text-[var(--text-muted)]">© 2026 Parchi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
