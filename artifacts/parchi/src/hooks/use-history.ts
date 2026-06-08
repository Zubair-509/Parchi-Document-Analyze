import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
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

interface ServerRow {
  id: string;
  type: "prescription" | "testreport";
  fileName: string;
  preview: string;
  result: unknown;
  createdAt: string;
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

function serverRowToEntry(row: ServerRow): HistoryEntry {
  return {
    id: row.id,
    type: row.type,
    date: row.createdAt,
    fileName: row.fileName,
    preview: row.preview,
    result: row.result as PrescriptionResult | TestReportResult,
  };
}

function computePreview(
  type: HistoryEntryType,
  result: PrescriptionResult | TestReportResult,
): string {
  return type === "prescription"
    ? (result as PrescriptionResult).medicines
        .slice(0, 3)
        .map((m) => m.medicine_name)
        .join(", ")
    : `${(result as TestReportResult).summary.total} tests · ${(result as TestReportResult).summary.flagged} flagged`;
}

export function useHistory() {
  const { user, token } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      setIsLoading(true);
      fetch("/api/user/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to load history");
          return r.json() as Promise<ServerRow[]>;
        })
        .then((rows) => setEntries(rows.map(serverRowToEntry)))
        .catch(() => setEntries(loadHistory()))
        .finally(() => setIsLoading(false));
    } else {
      setEntries(loadHistory());
    }
  }, [user, token]);

  const addEntry = useCallback(
    async (
      type: HistoryEntryType,
      fileName: string,
      result: PrescriptionResult | TestReportResult,
    ) => {
      const preview = computePreview(type, result);
      if (user && token) {
        try {
          const r = await fetch("/api/user/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type, fileName, preview, result }),
          });
          if (r.ok) {
            const row = (await r.json()) as ServerRow;
            setEntries((prev) => [serverRowToEntry(row), ...prev]);
          }
        } catch {
          // silent
        }
      } else {
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
      }
    },
    [user, token],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      if (user && token) {
        try {
          await fetch(`/api/user/history/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // silent
        }
      } else {
        const updated = entries.filter((e) => e.id !== id);
        saveHistory(updated);
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [user, token, entries],
  );

  const clearAll = useCallback(async () => {
    if (user && token) {
      try {
        await fetch("/api/user/history", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // silent
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setEntries([]);
  }, [user, token]);

  return { entries, addEntry, removeEntry, clearAll, isLoading };
}
