import { useState } from "react";
import { Copy, Check, AlertTriangle, ArrowUp, ArrowDown, Minus, CheckCircle } from "lucide-react";
import { TestValue, TestValueStatus } from "@workspace/api-client-react";

interface TestValueCardProps {
  test: TestValue;
}

export function TestValueCard({ test }: TestValueCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Question for doctor: ${test.doctor_question}\n${test.doctor_question_urdu}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusConfig = (status: TestValueStatus) => {
    switch (status) {
      case 'normal':
        return { bg: 'bg-[#F0FDF4]', border: 'border-[#22C55E]', text: 'text-[#14532D]', icon: <CheckCircle className="w-3 h-3" />, label: 'NORMAL' };
      case 'high':
        return { bg: 'bg-[#FCEAE1]', border: 'border-[#E8826B]', text: 'text-[#B85A3E]', icon: <ArrowUp className="w-3 h-3" />, label: 'HIGH' };
      case 'low':
        return { bg: 'bg-[#EFF6FF]', border: 'border-[#93C5FD]', text: 'text-[#1E3A8A]', icon: <ArrowDown className="w-3 h-3" />, label: 'LOW' };
      case 'borderline':
        return { bg: 'bg-[#FFFBEB]', border: 'border-[#F59E0B]', text: 'text-[#78350F]', icon: <Minus className="w-3 h-3" />, label: 'BORDERLINE' };
      case 'unclear':
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: null, label: 'UNCLEAR' };
    }
  };

  const statusConfig = getStatusConfig(test.status);
  const isUrgent = test.urgency === 'discuss_urgently';

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border mb-4 overflow-hidden ${isUrgent ? 'border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse-border' : 'border-gray-100'}`}>
      
      {isUrgent && (
        <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-medium flex items-center justify-between border-b border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>⚠ URGENT — Please contact your doctor today</span>
          </div>
        </div>
      )}
      
      {isUrgent && (
        <div className="bg-red-50 text-red-800 px-4 py-2 text-base font-medium flex items-center justify-end border-b border-red-200" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 1.5 }}>
          فوری — آج ہی اپنے ڈاکٹر سے رابطہ کریں
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-[20px] font-bold text-gray-900">{test.test_name}</h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[12px] font-bold font-sans tracking-wider ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
            {statusConfig.icon} {statusConfig.label}
          </div>
        </div>
        
        {test.test_name_urdu && (
          <div className="text-gray-500 text-lg mb-4" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>
            {test.test_name_urdu}
          </div>
        )}

        <div className="h-px w-full bg-gray-100 my-4"></div>

        <div className="text-center mb-1">
          <span className={`font-mono text-[28px] font-bold ${statusConfig.text}`}>
            {test.patient_value}
          </span>
          {test.unit && <span className="text-gray-500 font-mono text-sm ml-1">{test.unit}</span>}
        </div>
        
        {test.normal_range && (
          <div className="text-center text-[13px] text-gray-500 font-sans mb-4">
            Normal: {test.normal_range}
          </div>
        )}

        <div className="h-px w-full bg-gray-100 my-4"></div>

        <div className="space-y-3">
          <p className="text-[15px] font-sans text-gray-800">{test.explanation_english}</p>
          <p className="text-[17px] text-gray-800" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
            {test.explanation_urdu}
          </p>
        </div>

        {test.status !== 'normal' && (test.doctor_question || test.doctor_question_urdu) && (
          <div className="mt-4 bg-[#EFF6FF] border border-[#93C5FD] rounded-lg p-4 relative">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Ask Your Doctor</h4>
            
            {test.doctor_question && (
              <p className="text-[15px] text-blue-900 italic mb-3">"{test.doctor_question}"</p>
            )}
            
            {test.doctor_question && test.doctor_question_urdu && (
              <div className="h-px bg-blue-200 w-full my-2"></div>
            )}
            
            {test.doctor_question_urdu && (
              <p className="text-base text-blue-900" dir="rtl" style={{ fontFamily: 'Noto Nastaliq Urdu', lineHeight: 2.2 }}>
                "{test.doctor_question_urdu}"
              </p>
            )}
            
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-white/60 px-2 py-1 rounded text-xs font-medium"
            >
              {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
