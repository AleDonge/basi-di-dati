import Link from "next/link";
export default function NotFound() { return <div className="feature-empty"><p className="eyebrow">PAGINA NON TROVATA</p><h1>Qui non c’è ancora nulla.</h1><p>Il percorso richiesto non è disponibile.</p><Link href="/dashboard" className="text-link">Torna alla dashboard</Link></div>; }
