import { useState } from "react";
import { ChevronDown, Shield, ShieldAlert, ShieldCheck, Copy, Check } from "lucide-react";
import { EvidenceData } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";

interface EvidenceLayerProps {
  evidence: EvidenceData;
}

export function EvidenceLayer({ evidence }: EvidenceLayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Question for doctor: ${evidence.doctor_question_english}\n${evidence.doctor_question_urdu}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthDisplay = () => {
    switch (evidence.evidence_strength) {
      case 'strong':
        return { icon: <ShieldCheck className="w-4 h-4" />, text: "Strong Evidence", colors: "bg-green-50 text-green-800 border-green-200" };
      case 'common_practice':
        return { icon: <Shield className="w-4 h-4" />, text: "Common Practice", colors: "bg-amber-50 text-amber-800 border-amber-200" };
      case 'limited':
        return { icon: <ShieldAlert className="w-4 h-4" />, text: "Limited Evidence", colors: "bg-gray-100 text-gray-700 border-gray-300" };
      default:
        return null;
    }
  };

  const strength = getStrengthDisplay();

  return (
    <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {evidence.who_essential && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              <ShieldCheck className="w-3 h-3" /> WHO Essential
            </span>
          )}
          {strength && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${strength.colors}`}>
              {strength.icon} {strength.text}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
          <span className="hidden sm:inline">Ask doctor</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
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
            <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50/50">
              {evidence.common_indications && evidence.common_indications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Commonly Used For</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-1">
                    {evidence.common_indications.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(evidence.evidence_note || evidence.evidence_note_urdu) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Evidence</h4>
                  {evidence.evidence_note && <p className="text-sm text-gray-700 mb-2">{evidence.evidence_note}</p>}
                  {evidence.evidence_note_urdu && (
                    <p className="text-base text-gray-800" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
                      {evidence.evidence_note_urdu}
                    </p>
                  )}
                </div>
              )}

              {(evidence.doctor_question_english || evidence.doctor_question_urdu) && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 relative">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Ask Your Doctor</h4>
                  
                  {evidence.doctor_question_english && (
                    <p className="text-sm text-blue-900 italic mb-3">"{evidence.doctor_question_english}"</p>
                  )}
                  
                  {evidence.doctor_question_english && evidence.doctor_question_urdu && (
                    <div className="h-px bg-blue-200 w-full my-2"></div>
                  )}
                  
                  {evidence.doctor_question_urdu && (
                    <p className="text-base text-blue-900" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
                      "{evidence.doctor_question_urdu}"
                    </p>
                  )}
                  
                  <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-white/50 px-2 py-1 rounded text-xs font-medium"
                  >
                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                ⓘ This is publicly available medical information. Always discuss with your doctor.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
