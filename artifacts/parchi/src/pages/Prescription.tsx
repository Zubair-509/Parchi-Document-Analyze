import { useState } from "react";
import { Link } from "wouter";
import { UploadArea } from "@/components/UploadArea";
import { MedicineCard } from "@/components/MedicineCard";
import { ScheduleView } from "@/components/ScheduleView";
import { Disclaimer } from "@/components/Disclaimer";
import { ShareButton } from "@/components/ShareButton";
import { PrescriptionResult } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_RESULT: PrescriptionResult = {
  medicines: [
    {
      id: "demo-1",
      medicine_name: "Augmentin 625",
      standard_name: "Augmentin 625mg",
      active_formula: "Amoxicillin + Clavulanate",
      formula_urdu: "اموکسیسیلن",
      purpose: "An antibiotic used to treat bacterial infections such as throat, chest, and urinary tract infections.",
      dosage: "625mg twice daily",
      timing: ["morning", "night"],
      food_relation: "after_food",
      duration: "7 days",
      common_side_effects: ["Nausea", "Diarrhoea", "Skin rash"],
      important_warning: "Complete the full course even if you feel better. Do not skip doses.",
      explanation_urdu: "یہ دوائی جراثیم کے خلاف کام کرتی ہے۔ اسے کھانے کے بعد لیں اور پورا کورس مکمل کریں۔",
      generic_alternatives: [
        { brand_name: "Amoxiclav", manufacturer: "Highnoon", price_per_tablet_pkr: 45, tier: "affordable", note: "Same formula" },
        { brand_name: "Clavam", manufacturer: "Getz Pharma", price_per_tablet_pkr: 55, tier: "medium", note: null },
      ],
      evidence: {
        who_essential: true,
        common_indications: ["Respiratory tract infections", "Urinary tract infections", "Skin infections"],
        evidence_strength: "strong",
        evidence_note: "Amoxicillin-clavulanate is a first-line antibiotic with strong evidence for bacterial infections.",
        evidence_note_urdu: "یہ دوائی جراثیمی انفیکشن کے لیے ایک مضبوط اور مؤثر علاج ہے۔",
        doctor_question_english: "Is this the right antibiotic for my specific infection, and is 7 days the right duration?",
        doctor_question_urdu: "کیا یہ دوائی میرے انفیکشن کے لیے مناسب ہے اور کتنے دن لینی ہے؟",
      },
      confidence: "high",
      user_edited: false,
    },
    {
      id: "demo-2",
      medicine_name: "Panadol 500mg",
      standard_name: "Panadol",
      active_formula: "Paracetamol",
      formula_urdu: "پیراسیٹامول",
      purpose: "Pain reliever and fever reducer used for headache, body aches, and fever.",
      dosage: "500mg three times daily",
      timing: ["morning", "afternoon", "night"],
      food_relation: "anytime",
      duration: "5 days",
      common_side_effects: ["Rare at normal doses", "Liver damage if overdosed"],
      important_warning: "Do not exceed 4 tablets (2g) per day. Avoid alcohol.",
      explanation_urdu: "یہ دوائی بخار اور درد کو کم کرتی ہے۔ دن میں تین بار لیں لیکن 4 سے زیادہ گولیاں نہ لیں۔",
      generic_alternatives: [
        { brand_name: "Paracetamol (Generic)", manufacturer: "Various", price_per_tablet_pkr: 3, tier: "affordable", note: "Exact same ingredient" },
        { brand_name: "Calpol", manufacturer: "GSK", price_per_tablet_pkr: 8, tier: "medium", note: null },
      ],
      evidence: {
        who_essential: true,
        common_indications: ["Fever", "Mild to moderate pain", "Headache"],
        evidence_strength: "strong",
        evidence_note: "Paracetamol is the most widely used analgesic with strong safety profile at recommended doses.",
        evidence_note_urdu: "پیراسیٹامول درد اور بخار کے لیے ایک محفوظ اور مؤثر دوائی ہے۔",
        doctor_question_english: "Can I take this alongside my other medicines without any interactions?",
        doctor_question_urdu: "کیا میں یہ دوائی اپنی دوسری دوائیوں کے ساتھ لے سکتا ہوں؟",
      },
      confidence: "high",
      user_edited: false,
    },
  ],
  disclaimer: "Information is for guidance only. Always discuss any questions with your doctor or pharmacist. Parchi does not diagnose or prescribe. | یہ معلومات صرف رہنمائی کے لیے ہیں۔ ہمیشہ اپنے ڈاکٹر سے مشورہ کریں۔",
};

export function Prescription() {
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1] || result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/prescription/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: base64,
          mimeType: file.type
        })
      });

      if (!response.ok) {
        let errorMsg = 'Failed to analyze prescription';
        try {
          const errData = await response.json();
          errorMsg = errData?.error || errorMsg;
        } catch {
          // server returned non-JSON error body
        }
        throw new Error(errorMsg);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response. Please try again.");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "We couldn't read this prescription. Please try again.";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-brand-green-deep text-xl">
            Parchi
          </Link>
          <div className="flex gap-4">
            <Link href="/prescription" className="text-sm font-medium text-brand-green border-b-2 border-brand-green px-1 py-4">
              My Prescription
            </Link>
            <Link href="/testreport" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 py-4">
              Test Report
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 py-6">
        {!result ? (
          <div className="max-w-xl mx-auto mt-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2 text-center">Analyze Prescription</h1>
            <p className="text-center text-gray-600 mb-8">Upload a photo of your prescription to understand your medicines.</p>
            <UploadArea type="prescription" onUpload={handleUpload} isLoading={isLoading} />
            <p className="text-center mt-6 text-sm text-gray-400">
              Want to see what the output looks like?{" "}
              <button
                onClick={() => { setIsDemo(true); setResult(SAMPLE_RESULT); }}
                className="text-brand-green underline hover:no-underline"
              >
                View a sample result
              </button>
            </p>
          </div>
        ) : (
          <div>
            {isDemo && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 text-center">
                📋 This is a <strong>sample output</strong> — upload your own prescription to get real results.
              </div>
            )}
            {/* Print-only header */}
            <div className="print-header hidden">
              <h1 style={{ fontSize: "18pt", fontWeight: "bold", color: "#2D5145" }}>Parchi — Prescription Summary</h1>
              <p style={{ fontSize: "10pt", color: "#555", marginTop: "4pt" }}>
                Generated on {new Date().toLocaleDateString("en-PK", { dateStyle: "long" })}
              </p>
            </div>

            <div className="flex justify-between items-center mb-6 no-print">
              <h1 className="font-serif text-2xl font-bold text-gray-900">Your Medicines</h1>
              <div className="flex items-center gap-3">
                <ShareButton variant="green" />
                <button
                  onClick={() => { setResult(null); setIsDemo(false); }}
                  className="text-sm text-brand-green hover:underline"
                >
                  {isDemo ? "Upload my prescription" : "Scan another"}
                </button>
              </div>
            </div>

            <ScheduleView medicines={result.medicines} />

            <div className="space-y-4">
              {result.medicines.map((medicine, index) => (
                <MedicineCard key={medicine.id} medicine={medicine} index={index} />
              ))}
            </div>

            {result.disclaimer && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 text-center">
                {result.disclaimer}
              </div>
            )}
          </div>
        )}
      </main>

      <Disclaimer />
      
      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20 pb-safe">
        <Link href="/prescription" className="flex flex-col items-center p-2 text-brand-green">
          <span className="text-xl mb-1">📋</span>
          <span className="text-[10px] font-medium">Prescription</span>
        </Link>
        <Link href="/testreport" className="flex flex-col items-center p-2 text-gray-400">
          <span className="text-xl mb-1">🧪</span>
          <span className="text-[10px] font-medium">Test Report</span>
        </Link>
      </div>
    </div>
  );
}
