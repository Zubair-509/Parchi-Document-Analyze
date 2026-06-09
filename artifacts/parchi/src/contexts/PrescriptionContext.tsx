import { createContext, useContext, useState, type ReactNode } from 'react'

export interface GenericAlternative {
  brand_name: string
  manufacturer: string | null
  price_per_tablet_pkr: number | null
  tier: 'affordable' | 'medium' | 'expensive'
  note: string | null
}

export interface Evidence {
  who_essential: boolean | null
  common_indications: string[]
  evidence_strength: 'strong' | 'common_practice' | 'limited' | null
  evidence_note: string | null
  evidence_note_urdu: string | null
  doctor_question_english: string | null
  doctor_question_urdu: string | null
}

export interface Medicine {
  id: string
  medicine_name: string
  standard_name: string | null
  active_formula: string | null
  formula_urdu: string | null
  purpose: string
  dosage: string
  timing: string[]
  food_relation: 'before_food' | 'after_food' | 'with_food' | 'anytime'
  duration: string | null
  common_side_effects: string[]
  important_warning: string | null
  explanation_urdu: string
  generic_alternatives: GenericAlternative[]
  evidence: Evidence
  confidence: 'high' | 'medium' | 'low'
  user_edited: boolean
}

export interface AnalysisResult {
  medicines: Medicine[]
  disclaimer: string
}

interface PrescriptionContextValue {
  result: AnalysisResult | null
  previewUrl: string | null
  setAnalysis: (result: AnalysisResult, previewUrl: string) => void
  clearAnalysis: () => void
}

const PrescriptionContext = createContext<PrescriptionContextValue | null>(null)

export function PrescriptionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const setAnalysis = (r: AnalysisResult, url: string) => { setResult(r); setPreviewUrl(url) }
  const clearAnalysis = () => { setResult(null); setPreviewUrl(null) }

  return (
    <PrescriptionContext.Provider value={{ result, previewUrl, setAnalysis, clearAnalysis }}>
      {children}
    </PrescriptionContext.Provider>
  )
}

export function usePrescription() {
  const ctx = useContext(PrescriptionContext)
  if (!ctx) throw new Error('usePrescription must be used inside PrescriptionProvider')
  return ctx
}
