import { useState } from "react";
import { Link } from "wouter";
import { UploadArea } from "@/components/UploadArea";
import { TestValueCard } from "@/components/TestValueCard";
import { Disclaimer } from "@/components/Disclaimer";
import { ShareButton } from "@/components/ShareButton";
import { TestReportResult } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import { useHistory } from "@/hooks/use-history";
import { useAuth } from "@/contexts/auth-context";

export function TestReport() {
  const [result, setResult] = useState<TestReportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addEntry } = useHistory();
  const { user, logout } = useAuth();

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

      const response = await fetch('/api/testreport/analyze', {
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
        let errorMsg = 'Failed to analyze test report';
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
      addEntry("testreport", file.name, data);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "We couldn't read this test report. Please try again.";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSummaryChips = (summary: TestReportResult['summary']) => {
    const chips = [];
    
    if (summary.urgent > 0) {
      chips.push(
        <div key="urgent" className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm font-medium">
          <AlertTriangle className="w-4 h-4" /> {summary.urgent} Urgent
        </div>
      );
    }
    
    if (summary.flagged > 0) {
      chips.push(
        <div key="high" className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-medium">
          <ArrowUp className="w-4 h-4" /> {summary.flagged} High/Low
        </div>
      );
    }
    
    if (summary.borderline > 0) {
      chips.push(
        <div key="borderline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-medium">
          <Minus className="w-4 h-4" /> {summary.borderline} Borderline
        </div>
      );
    }
    
    if (summary.normal > 0) {
      chips.push(
        <div key="normal" className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> {summary.normal} Normal
        </div>
      );
    }
    
    return chips;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-brand-green-deep text-xl">
            Parchi
          </Link>
          <div className="flex items-center gap-1 sm:gap-4">
            <Link href="/prescription" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 py-4">
              Prescription
            </Link>
            <Link href="/testreport" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 px-1 py-4">
              Test Report
            </Link>
            <Link href="/history" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 py-4">
              History
            </Link>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900 px-1 py-4">Sign out</button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-brand-green hover:text-brand-green/80 px-1 py-4">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 py-6">
        {!result ? (
          <div className="max-w-xl mx-auto mt-8">
            <h1 className="font-serif text-3xl font-bold text-blue-900 mb-2 text-center">Analyze Test Report</h1>
            <p className="text-center text-blue-700/80 mb-8">Upload a photo of your lab report to understand your results.</p>
            <UploadArea type="testreport" onUpload={handleUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div>
            {/* Print-only header */}
            <div className="print-header hidden">
              <h1 style={{ fontSize: "18pt", fontWeight: "bold", color: "#1e3a8a" }}>Parchi — Lab Report Summary</h1>
              <p style={{ fontSize: "10pt", color: "#555", marginTop: "4pt" }}>
                Generated on {new Date().toLocaleDateString("en-PK", { dateStyle: "long" })}
              </p>
            </div>

            <div className="flex justify-between items-center mb-6 no-print">
              <h1 className="font-serif text-2xl font-bold text-gray-900">Your Test Results</h1>
              <div className="flex items-center gap-3">
                <ShareButton variant="blue" />
                <button
                  onClick={() => setResult(null)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Scan another
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-2">
              {getSummaryChips(result.summary)}
            </div>

            <div className="space-y-4">
              {result.test_values.map((test) => (
                <TestValueCard key={test.id} test={test} />
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
        <Link href="/prescription" className="flex flex-col items-center p-2 text-gray-400">
          <span className="text-xl mb-1">📋</span>
          <span className="text-[10px] font-medium">Prescription</span>
        </Link>
        <Link href="/testreport" className="flex flex-col items-center p-2 text-blue-600">
          <span className="text-xl mb-1">🧪</span>
          <span className="text-[10px] font-medium">Test Report</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center p-2 text-gray-400">
          <span className="text-xl mb-1">🕐</span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
      </div>
    </div>
  );
}
