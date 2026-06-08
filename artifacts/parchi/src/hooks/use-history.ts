import { useState, useCallback } from "react";
import { PrescriptionResult, TestReportResult } from "@workspace/api-client-react";

export type HistoryEntryType = "prescription" | "testreport";

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  date: string;
  fileName: string;
  preview: string;
  result: PrescriptionResult | TestReportResult;
}

const STORAGE_KEY = "parchi_history";
const MAX_ENTRIES = 30;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full — silently ignore
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  const addEntry = useCallback(
    (
      type: HistoryEntryType,
      fileName: string,
      result: PrescriptionResult | TestReportResult
    ) => {
      const preview =
        type === "prescription"
          ? (result as PrescriptionResult).medicines
              .slice(0, 3)
              .map((m) => m.medicine_name)
              .join(", ")
          : `${(result as TestReportResult).summary.total} tests · ${(result as TestReportResult).summary.flagged} flagged`;

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        type,
        date: new Date().toISOString(),
        fileName,
        preview,
        result,
      };

      setEntries((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  }, []);

  return { entries, addEntry, removeEntry, clearAll };
}
