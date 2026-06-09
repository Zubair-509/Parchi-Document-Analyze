import { useState } from "react";
import { Copy, Check, AlertTriangle, ArrowUp, ArrowDown, Minus, CheckCircle } from "lucide-react";
import { TestValue, TestValueStatus } from "@workspace/api-client-react";

interface TestValueCardProps {
  test: TestValue;
}

const STATUS_CONFIG: Record<TestValueStatus | "unclear", {
  bg: string; border: string; text: string;
  icon: React.ReactNode;
  labelEn: string; labelUr: string;
}> = {
  normal:     { bg: "bg-[#F0FDF4]", border: "border-[#22C55E]", text: "text-[#14532D]", icon: <CheckCircle className="w-3 h-3" />, labelEn: "NORMAL",     labelUr: "نارمل" },
  high:       { bg: "bg-[#FCEAE1]", border: "border-[#E8826B]", text: "text-[#B85A3E]", icon: <ArrowUp    className="w-3 h-3" />, labelEn: "HIGH",       labelUr: "زیادہ" },
  low:        { bg: "bg-[#EFF6FF]", border: "border-[#93C5FD]", text: "text-[#1E3A8A]", icon: <ArrowDown  className="w-3 h-3" />, labelEn: "LOW",        labelUr: "کم" },
  borderline: { bg: "bg-[#FFFBEB]", border: "border-[#F59E0B]", text: "text-[#78350F]", icon: <Minus      className="w-3 h-3" />, labelEn: "BORDERLINE", labelUr: "حدِ نارمل" },
  unclear:    { bg: "bg-gray-50",   border: "border-gray-300",  text: "text-gray-700",  icon: null,                              labelEn: "UNCLEAR",    labelUr: "غیر واضح" },
};

export function TestValueCard({ test }: TestValueCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `Question for doctor: ${test.doctor_question}\n${test.doctor_question_urdu}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cfg = STATUS_CONFIG[test.status] ?? STATUS_CONFIG.unclear;
  const isUrgent = test.urgency === "discuss_urgently";
  const discussSoon = test.urgency === "discuss_soon";

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border mb-4 overflow-hidden ${isUrgent ? "border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse-border" : "border-gray-100"}`}>

      {/* Urgent banner — English */}
      {isUrgent && (
        <div className="bg-red-100 text-red-800 px-4 py-2 text-sm font-medium flex items-center gap-2 border-b border-red-200">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          ⚠ URGENT — Please contact your doctor today
        </div>
      )}

      {/* Urgent banner — Urdu */}
      {isUrgent && (
        <div className="bg-red-50 text-red-800 px-4 py-2 text-base font-medium flex items-center justify-end border-b border-red-200"
          dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 1.5 }}>
          فوری — آج ہی اپنے ڈاکٹر سے رابطہ کریں
        </div>
      )}

      {/* Discuss soon banner */}
      {discussSoon && (
        <>
          <div className="bg-amber-50 text-amber-800 px-4 py-2 text-sm font-medium flex items-center gap-2 border-b border-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Discuss with your doctor at your next visit
          </div>
          <div className="bg-amber-50 text-amber-800 px-4 py-2 text-base font-medium flex items-center justify-end border-b border-amber-200"
            dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 1.5 }}>
            اگلی ملاقات پر ڈاکٹر سے ضرور بات کریں
          </div>
        </>
      )}

      <div className="p-5">
        {/* Test name + status badge */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-[20px] font-bold text-gray-900">{test.test_name}</h3>

          {/* Bilingual status badge */}
          <div className={`flex flex-col items-center px-2.5 py-1 rounded-xl border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider">{cfg.icon} {cfg.labelEn}</span>
            <span dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "12px", lineHeight: 1.8 }}>{cfg.labelUr}</span>
          </div>
        </div>

        {/* Urdu test name */}
        {test.test_name_urdu && (
          <div className="text-gray-500 text-lg mb-4" dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu" }}>
            {test.test_name_urdu}
          </div>
        )}

        <div className="h-px w-full bg-gray-100 my-4" />

        {/* Patient value */}
        <div className="text-center mb-1">
          <span className={`font-mono text-[28px] font-bold ${cfg.text}`}>
            {test.patient_value}
          </span>
          {test.unit && <span className="text-gray-500 font-mono text-sm ml-1">{test.unit}</span>}
        </div>

        {/* Normal range — bilingual */}
        {test.normal_range && (
          <div className="text-center text-[13px] text-gray-500 font-sans mb-4 space-y-0.5">
            <div>Normal: {test.normal_range}</div>
            <div dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", fontSize: "13px", lineHeight: 1.8 }}>
              نارمل حد: {test.normal_range}
            </div>
          </div>
        )}

        <div className="h-px w-full bg-gray-100 my-4" />

        {/* Explanations — English then Urdu */}
        <div className="space-y-3">
          <p className="text-[15px] font-sans text-gray-800">{test.explanation_english}</p>

          {test.explanation_urdu && (
            <div className="bg-[#F2F7F3] border border-green-100 rounded-xl px-4 pt-3 pb-2">
              <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-1">اردو وضاحت</p>
              <p className="text-[17px] text-gray-800" dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 2.2 }}>
                {test.explanation_urdu}
              </p>
            </div>
          )}
        </div>

        {/* Doctor question */}
        {test.status !== "normal" && (test.doctor_question || test.doctor_question_urdu) && (
          <div className="mt-4 bg-[#EFF6FF] border border-[#93C5FD] rounded-lg p-4 relative">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-0.5">Ask Your Doctor</h4>
            <p className="text-[10px] text-blue-600 mb-2" dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 1.8 }}>
              ڈاکٹر سے پوچھیں
            </p>

            {test.doctor_question && (
              <p className="text-[15px] text-blue-900 italic mb-3">"{test.doctor_question}"</p>
            )}

            {test.doctor_question && test.doctor_question_urdu && (
              <div className="h-px bg-blue-200 w-full my-2" />
            )}

            {test.doctor_question_urdu && (
              <p className="text-base text-blue-900" dir="rtl" style={{ fontFamily: "Noto Nastaliq Urdu", lineHeight: 2.2 }}>
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
