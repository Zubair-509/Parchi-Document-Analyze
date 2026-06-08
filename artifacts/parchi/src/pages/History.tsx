import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Disclaimer } from "@/components/Disclaimer";
import { MedicineCard } from "@/components/MedicineCard";
import { ScheduleView } from "@/components/ScheduleView";
import { TestValueCard } from "@/components/TestValueCard";
import { useHistory, HistoryEntry } from "@/hooks/use-history";
import { useAuth } from "@/contexts/auth-context";
import { PrescriptionResult, TestReportResult } from "@workspace/api-client-react";
import { Trash2, Clock, ChevronLeft, AlertTriangle, ArrowUp, Minus, CheckCircle } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
}

function SummaryChips({ summary }: { summary: TestReportResult["summary"] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {summary.urgent > 0 && (
        <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <AlertTriangle className="w-3 h-3" /> {summary.urgent} Urgent
        </span>
      )}
      {summary.flagged > 0 && (
        <span className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <ArrowUp className="w-3 h-3" /> {summary.flagged} High/Low
        </span>
      )}
      {summary.borderline > 0 && (
        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <Minus className="w-3 h-3" /> {summary.borderline} Borderline
        </span>
      )}
      {summary.normal > 0 && (
        <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" /> {summary.normal} Normal
        </span>
      )}
    </div>
  );
}

function EntryDetail({ entry, onBack }: { entry: HistoryEntry; onBack: () => void }) {
  if (entry.type === "prescription") {
    const result = entry.result as PrescriptionResult;
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-brand-green hover:underline mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to History
        </button>
        <div className="mb-4">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Prescription</h2>
          <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
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
    );
  }

  const result = entry.result as TestReportResult;
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to History
      </button>
      <div className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-gray-900">Test Report</h2>
        <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-2">
        <SummaryChips summary={result.summary} />
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
  );
}

export function History() {
  const { entries, removeEntry, clearAll, isLoading } = useHistory();
  const { user, logout } = useAuth();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-brand-green-deep text-xl">
            Parchi
          </Link>
          <div className="flex items-center gap-1 sm:gap-4">
            <Link href="/prescription" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 py-4">
              Prescription
            </Link>
            <Link href="/testreport" className="text-sm font-medium text-gray-500 hover:text-gray-900 px-1 py-4">
              Test Report
            </Link>
            <Link href="/history" className="text-sm font-medium text-brand-green border-b-2 border-brand-green px-1 py-4">
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

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 py-6 pb-24 md:pb-6">
        {selected ? (
          <EntryDetail entry={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            {!user && (
              <div className="mb-5 p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">Sign in to sync your history</p>
                  <p className="text-xs text-gray-500 mt-0.5">Access your analyses from any device</p>
                </div>
                <Link href="/login" className="shrink-0 px-3 py-1.5 bg-brand-green text-white text-xs font-medium rounded-lg hover:bg-brand-green/90 transition">
                  Sign in
                </Link>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">History</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {user ? `Synced to ${user.email}` : "Saved on this device"}
                </p>
              </div>
              {entries.length > 0 && (
                <button
                  onClick={() => { if (confirm("Clear all history?")) clearAll(); }}
                  className="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Clear all
                </button>
              )}
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium text-gray-500">No history yet</p>
                <p className="text-sm mt-1">Analyses you run will appear here.</p>
                <div className="flex gap-3 justify-center mt-6">
                  <button
                    onClick={() => navigate("/prescription")}
                    className="px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-medium hover:bg-brand-green/90"
                  >
                    Analyze Prescription
                  </button>
                  <button
                    onClick={() => navigate("/testreport")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Analyze Test Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3 hover:border-gray-200 transition-colors"
                  >
                    <button
                      className="flex-1 text-left"
                      onClick={() => setSelected(entry)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">
                          {entry.type === "prescription" ? "📋" : "🧪"}
                        </span>
                        <span className="font-medium text-gray-900 text-sm">
                          {entry.type === "prescription" ? "Prescription" : "Test Report"}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{entry.preview}</p>
                      {entry.type === "testreport" && (
                        <SummaryChips summary={(entry.result as TestReportResult).summary} />
                      )}
                    </button>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Disclaimer />

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20 pb-safe">
        <Link href="/prescription" className="flex flex-col items-center p-2 text-gray-400">
          <span className="text-xl mb-1">📋</span>
          <span className="text-[10px] font-medium">Prescription</span>
        </Link>
        <Link href="/testreport" className="flex flex-col items-center p-2 text-gray-400">
          <span className="text-xl mb-1">🧪</span>
          <span className="text-[10px] font-medium">Test Report</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center p-2 text-brand-green">
          <span className="text-xl mb-1">🕐</span>
          <span className="text-[10px] font-medium">History</span>
        </Link>
      </div>
    </div>
  );
}
