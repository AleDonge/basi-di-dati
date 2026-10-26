"use client";
import { useEffect, useRef, useState } from "react";
import type { editor as MonacoEditor } from "monaco-editor";
export function SqlEditor({ value,onChange,onExecute,disabled }: { value:string; onChange:(query:string) => void; onExecute:(query:string) => void; disabled:boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const editor = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const current = useRef(value); const change = useRef(onChange); const execute = useRef(onExecute);
  const fromEditor=useRef(false);const applyingValue=useRef(false);
  const [plain,setPlain] = useState(false); const [loaded,setLoaded] = useState(false); const [error,setError] = useState("");
  useEffect(() => {
    current.current=value;
    if(editor.current) {
      if(!fromEditor.current && editor.current.getValue() !== value) { applyingValue.current=true;editor.current.setValue(value);applyingValue.current=false; }
      if(editor.current.getValue() === value) fromEditor.current=false;
    }
  },[value]);
  useEffect(() => { change.current=onChange; execute.current=onExecute; },[onChange,onExecute]);
  useEffect(() => {
    let disposed = false;
    void (async () => {
      try {
        (globalThis as typeof globalThis & { MonacoEnvironment?: { getWorker: () => Worker } }).MonacoEnvironment = { getWorker: () => new Worker("/monaco/editor.worker.js",{ type:"module" }) };
        const monaco = await import("monaco-editor/editor/editor.api.js");
        await import("monaco-editor/languages/definitions/sql/register.js");
        if(disposed || !container.current) return;
        monaco.editor.defineTheme("academy-sql",{ base:"vs-dark",inherit:true,rules:[],colors:{ "editor.background":"#111c15", "editorLineNumber.foreground":"#8ca186", "editor.foreground":"#d7e7cd" } });
        editor.current=monaco.editor.create(container.current,{ value:current.current,language:"sql",theme:"academy-sql",automaticLayout:true,minimap:{enabled:false},fontSize:14,lineHeight:24,scrollBeyondLastLine:false,wordWrap:"on",contextmenu:false,quickSuggestions:false,wordBasedSuggestions:"off",ariaLabel:"Editor SQL. Premi Tab per uscire, Control Invio per eseguire.",accessibilitySupport:"on",tabFocusMode:true,tabSize:2 });
        editor.current!.onDidChangeModelContent(() => { if(applyingValue.current)return;fromEditor.current=true;change.current(editor.current?.getValue() ?? ""); });
        editor.current!.addAction({ id:"academy-execute",label:"Esegui query",keybindings:[monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],run:() => execute.current(editor.current?.getValue() ?? current.current) });
        setLoaded(true);
      } catch { if(!disposed) { setError("Monaco non disponibile: puoi usare l’editor testuale accessibile."); setPlain(true); } }
    })();
    return () => { disposed=true; const model=editor.current?.getModel(); editor.current?.dispose(); model?.dispose(); editor.current=null; };
  },[]);
  useEffect(() => { editor.current?.updateOptions({readOnly:disabled}); },[disabled,loaded]);
  useEffect(() => { editor.current?.layout(); },[plain]);
  return <div className="sql-editor"><div className="sql-editor-label"><span>QUERY SQL · SQLITE</span><label><input type="checkbox" checked={plain} onChange={e => setPlain(e.target.checked)} />Editor testuale accessibile</label></div>{!loaded && !plain && <p role="status" className="editor-loading">Caricamento di Monaco dal server locale…</p>}{error && <p className="muted">{error}</p>}<div ref={container} className="monaco-container" onKeyDownCapture={event => { if(event.ctrlKey || event.metaKey) { if(event.key === "Enter") { event.preventDefault();event.stopPropagation();onExecute(editor.current?.getValue() ?? value); } else if(event.key.toLowerCase() === "a") { const range=editor.current?.getModel()?.getFullModelRange();if(range) { event.preventDefault();event.stopPropagation();editor.current?.setSelection(range); } } } }} style={{ display:plain ? "none" : "block" }} />{plain && <textarea aria-label="Query SQL" value={value} onChange={e => onChange(e.target.value)} disabled={disabled} spellCheck={false} maxLength={20000} onKeyDown={e => { if((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); onExecute(e.currentTarget.value); } }} />}<p className="editor-foot">Ctrl/⌘ + Invio per eseguire · una SELECT o WITH … SELECT · massimo 20.000 caratteri</p></div>;
}
