import { useState } from "react";
import { Edit2, AlertTriangle, ChevronDown, Calendar, Utensils } from "lucide-react";
import { Medicine } from "@workspace/api-client-react";
import { EvidenceLayer } from "./EvidenceLayer";
import { GenericAlternatives } from "./GenericAlternatives";
import { motion, AnimatePresence } from "framer-motion";

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
}

const TIMING_LABELS: Record<string, { en: string; ur: string; emoji: string }> = {
  morning:   { en: "Morning",   ur: "صبح",   emoji: "☀️" },
  afternoon: { en: "Afternoon", ur: "دوپہر",  emoji: "🌞" },
  evening:   { en: "Evening",   ur: "شام",   emoji: "🌆" },
  night:     { en: "Night",     ur: "رات",   emoji: "🌙" },
};

const FOOD_LABELS: Record<string, { en: string; ur: string }> = {
  before_food: { en: "Before food",  ur: "کھانے سے پہلے" },
  after_food:  { en: "After food",   ur: "کھانے کے بعد" },
  with_food:   { en: "With food",    ur: "کھانے کے ساتھ" },
  anytime:     { en: "Anytime",      ur: "کسی بھی وقت" },
};

export function MedicineCard({ medicine, index }: MedicineCardProps) {
  const [sideEffectsExpanded, setSideEffectsExpanded] = useState(false);

  const timingLabel = (time: string) => {
    const t = TIMING_LABELS[time];
    if (!t) return time;
    return (
      <span className="flex flex-col items-center leading-tight gap-0.5">
        <span>{t.emoji} {t.en}</span>
        <span dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "11px", lineHeight: 1.8 }}>{t.ur}</span>
      </span>
    );
  };

  const foodRelation = medicine.food_relation ? FOOD_LABELS[medicine.food_relation] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 mb-4"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-serif text-[22px] font-bold text-gray-900 leading-tight">{medicine.medicine_name}</h3>
          <p className="font-sans text-[15px] text-gray-500">{medicine.standard_name || medicine.medicine_name}</p>
        </div>
        <button className="text-gray-400 hover:text-brand-green p-1">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Active formula — bilingual */}
      {(medicine.active_formula || medicine.formula_urdu) && (
        <div className="inline-flex flex-col bg-[#EFF6FF] text-blue-800 text-xs px-3 py-1.5 rounded-xl mb-3">
          {medicine.active_formula && (
            <span><span className="mr-1">🧪</span> {medicine.active_formula}</span>
          )}
          {medicine.formula_urdu && (
            <span dir="rtl" className="text-blue-700 mt-0.5" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "13px", lineHeight: 2 }}>
              {medicine.formula_urdu}
            </span>
          )}
        </div>
      )}

      {/* Purpose (English) */}
      {medicine.purpose && (
        <p className="text-gray-700 text-sm mb-2">{medicine.purpose}</p>
      )}

      {/* Urdu explanation — right after purpose */}
      {medicine.explanation_urdu && (
        <div className="bg-[#F2F7F3] border border-green-100 rounded-xl px-4 pt-3 pb-2 mb-4">
          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-1">اردو وضاحت</p>
          <p
            className="text-gray-800 text-base"
            dir="rtl"
            style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 2.3 }}
          >
            {medicine.explanation_urdu}
          </p>
        </div>
      )}

      {/* Timing + food + duration chips — bilingual */}
      <div className="flex flex-wrap gap-2 mb-4">
        {medicine.timing && medicine.timing.map((time, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs font-medium bg-brand-green-bg text-brand-green-deep px-3 py-1.5 rounded-full"
          >
            {timingLabel(time)}
          </span>
        ))}

        {foodRelation && (
          <span className="inline-flex flex-col items-center gap-0 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full">
            <span className="flex items-center gap-1"><Utensils className="w-3 h-3" /> {foodRelation.en}</span>
            <span dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "11px", lineHeight: 1.8 }}>{foodRelation.ur}</span>
          </span>
        )}

        {medicine.duration && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full">
            <Calendar className="w-3 h-3" /> {medicine.duration}
          </span>
        )}
      </div>

      {/* Warning */}
      {medicine.important_warning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{medicine.important_warning}</p>
        </div>
      )}

      {/* Side effects */}
      {medicine.common_side_effects && medicine.common_side_effects.length > 0 && (
        <div className="mb-4">
          <button
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setSideEffectsExpanded(!sideEffectsExpanded)}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${sideEffectsExpanded ? "rotate-180" : ""}`} />
            Side effects &nbsp;·&nbsp;
            <span dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "13px", lineHeight: 1.8 }}>ضمنی اثرات</span>
          </button>

          <AnimatePresence>
            {sideEffectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 ml-1 space-y-1">
                  {medicine.common_side_effects.map((effect, i) => (
                    <li key={i}>{effect}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {medicine.evidence && (
        <EvidenceLayer evidence={medicine.evidence} />
      )}

      {medicine.generic_alternatives && medicine.generic_alternatives.length > 0 && (
        <GenericAlternatives alternatives={medicine.generic_alternatives} />
      )}
    </motion.div>
  );
}
