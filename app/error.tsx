"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="feature-empty" role="alert"><h1>Qualcosa non ha funzionato.</h1><p>Non è stato possibile caricare questa pagina. Riprova o controlla il terminale locale.</p><Button onClick={reset}>Riprova</Button></div>; }
