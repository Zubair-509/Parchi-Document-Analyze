import { useState } from "react";
import { ChevronDown, Pill } from "lucide-react";
import { GenericAlternative } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

interface GenericAlternativesProps {
  alternatives: GenericAlternative[];
}

export function GenericAlternatives({ alternatives }: GenericAlternativesProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!alternatives || alternatives.length === 0) return null;

  const affordable = alternatives.filter(a => a.tier === "affordable");
  const medium = alternatives.filter(a => a.tier === "medium");
  const expensive = alternatives.filter(a => a.tier === "expensive");

  return (
    <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <span className="text-sm font-medium text-gray-800 font-sans">Same Medicine, Different Prices</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
              
              {affordable.map((alt, i) => (
                <div key={`aff-${i}`} className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-green-900 flex items-center gap-1"><Pill className="w-3 h-3"/> {alt.brand_name}</h5>
                    <p className="text-xs text-green-700">{alt.manufacturer}</p>
                    {alt.note && <p className="text-xs text-green-800 mt-1">{alt.note}</p>}
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-green-900">Rs {alt.price_per_tablet_pkr}/tab</div>
                    <div className="text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-200/50 px-1 py-0.5 rounded inline-block mt-1">Affordable</div>
                  </div>
                </div>
              ))}

              {medium.map((alt, i) => (
                <div key={`med-${i}`} className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-amber-900 flex items-center gap-1"><Pill className="w-3 h-3"/> {alt.brand_name}</h5>
                    <p className="text-xs text-amber-700">{alt.manufacturer}</p>
                    {alt.note && <p className="text-xs text-amber-800 mt-1">{alt.note}</p>}
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-900">Rs {alt.price_per_tablet_pkr}/tab</div>
                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-200/50 px-1 py-0.5 rounded inline-block mt-1">Medium</div>
                  </div>
                </div>
              ))}

              {expensive.map((alt, i) => (
                <div key={`exp-${i}`} className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex justify-between items-center opacity-80">
                  <div>
                    <h5 className="font-bold text-gray-700 flex items-center gap-1"><Pill className="w-3 h-3"/> {alt.brand_name}</h5>
                    <p className="text-xs text-gray-500">{alt.manufacturer}</p>
                    {alt.note && <p className="text-xs text-gray-600 mt-1">{alt.note}</p>}
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-gray-700">Rs {alt.price_per_tablet_pkr}/tab</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/50 px-1 py-0.5 rounded inline-block mt-1">Expensive</div>
                  </div>
                </div>
              ))}

              <div className="text-xs text-center text-gray-500 mt-4 bg-gray-100 p-2 rounded">
                Prices approximate. Confirm with pharmacist before switching.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
