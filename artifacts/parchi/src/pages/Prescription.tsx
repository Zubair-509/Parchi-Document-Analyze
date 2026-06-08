import { useState } from "react";
import { Link } from "wouter";
import { UploadArea } from "@/components/UploadArea";
import { MedicineCard } from "@/components/MedicineCard";
import { ScheduleView } from "@/components/ScheduleView";
import { Disclaimer } from "@/components/Disclaimer";
import { PrescriptionResult } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function Prescription() {
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        throw new Error('Failed to analyze prescription');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't read this prescription. Please try a clearer image.",
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
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-serif text-2xl font-bold text-gray-900">Your Medicines</h1>
              <button 
                onClick={() => setResult(null)} 
                className="text-sm text-brand-green hover:underline"
              >
                Scan another
              </button>
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
