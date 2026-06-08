import { useState } from "react";
import { Edit2, AlertTriangle, ChevronDown, Calendar, Clock, Utensils } from "lucide-react";
import { Medicine } from "@workspace/api-client-react";
import { EvidenceLayer } from "./EvidenceLayer";
import { GenericAlternatives } from "./GenericAlternatives";
import { motion, AnimatePresence } from "framer-motion";

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
}

export function MedicineCard({ medicine, index }: MedicineCardProps) {
  const [sideEffectsExpanded, setSideEffectsExpanded] = useState(false);

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'morning': return '☀️ Morning';
      case 'afternoon': return '🌞 Afternoon';
      case 'evening': return '🌆 Evening';
      case 'night': return '🌙 Night';
      default: return time;
    }
  };

  const getFoodText = (relation: string) => {
    switch (relation) {
      case 'before_food': return 'Before food';
      case 'after_food': return 'After food';
      case 'with_food': return 'With food';
      case 'anytime': return 'Anytime';
      default: return relation;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
      className="bg-white rounded-[16px] p-5 shadow-sm border border-gray-100 mb-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-serif text-[22px] font-bold text-gray-900 leading-tight">{medicine.medicine_name}</h3>
          <p className="font-sans text-[15px] text-gray-500">{medicine.standard_name || medicine.medicine_name}</p>
        </div>
        <button className="text-gray-400 hover:text-brand-green p-1">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {medicine.active_formula && (
        <div className="inline-flex items-center bg-[#EFF6FF] text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
          <span className="mr-1">🧪</span> Active Formula: {medicine.active_formula}
        </div>
      )}

      {medicine.purpose && (
        <p className="text-gray-700 text-sm mb-4">{medicine.purpose}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {medicine.timing && medicine.timing.map((time, i) => (
          <span key={i} className="inline-flex items-center text-xs font-medium bg-brand-green-bg text-brand-green-deep px-3 py-1 rounded-full">
            {getTimeIcon(time)}
          </span>
        ))}
        
        {medicine.food_relation && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
            <Utensils className="w-3 h-3" /> {getFoodText(medicine.food_relation)}
          </span>
        )}
        
        {medicine.duration && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full">
            <Calendar className="w-3 h-3" /> {medicine.duration}
          </span>
        )}
      </div>

      {medicine.important_warning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{medicine.important_warning}</p>
        </div>
      )}

      {medicine.common_side_effects && medicine.common_side_effects.length > 0 && (
        <div className="mb-4">
          <button 
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setSideEffectsExpanded(!sideEffectsExpanded)}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${sideEffectsExpanded ? 'rotate-180' : ''}`} />
            Side effects
          </button>
          
          <AnimatePresence>
            {sideEffectsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
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

      {medicine.explanation_urdu && (
        <div className="mt-4 bg-[#F2F7F3] rounded-lg p-4">
          <p className="text-gray-800 text-base" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
            {medicine.explanation_urdu}
          </p>
        </div>
      )}
    </motion.div>
  );
}
