"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { emptyProgress, type ProgressBackup } from "@/lib/progress/schemas";
import { readProgress } from "@/lib/progress/db";
interface ProgressContextValue {
  data: ProgressBackup; ready: boolean; error: string;
  refresh: () => Promise<void>; perform: (action: () => Promise<unknown>) => Promise<boolean>;
}
const ProgressContext = createContext<ProgressContextValue | null>(null);
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressBackup>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try { setData(await readProgress()); setError(""); setReady(true); }
    catch { setReady(false); setError("Non riesco ad accedere ai progressi locali. Controlla che IndexedDB sia consentito e che lo spazio del browser non sia esaurito. Nessun salvataggio è confermato."); }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(refresh);
    const onFocus = () => { void refresh(); };
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("database-academy-progress") : null;
    if (channel) channel.onmessage = onFocus;
    window.addEventListener("focus", onFocus);
    return () => { channel?.close(); window.removeEventListener("focus", onFocus); };
  }, [refresh]);
  const perform = useCallback(async (action: () => Promise<unknown>) => {
    try {
      await action(); await refresh();
      if (typeof BroadcastChannel !== "undefined") { const channel = new BroadcastChannel("database-academy-progress"); channel.postMessage("updated"); channel.close(); }
      return true;
    } catch (err) { setError(err instanceof Error ? `Salvataggio non riuscito: ${err.message}` : "Salvataggio non riuscito. Riprova dopo aver controllato il browser."); return false; }
  }, [refresh]);
  return <ProgressContext.Provider value={{ data, ready, error, refresh, perform }}>{error && <div className="storage-error" role="alert">{error}<button onClick={() => void refresh()}>Riprova</button></div>}{children}</ProgressContext.Provider>;
}
export function useProgress() { const value = useContext(ProgressContext); if (!value) throw new Error("ProgressProvider mancante"); return value; }
