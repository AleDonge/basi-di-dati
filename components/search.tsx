"use client";
import {useState} from "react";
import Link from "next/link";
import type {SearchEntry} from "@/lib/search/index";
import {searchLocal} from "@/lib/search/query";
export function LocalSearch({index}:{index:SearchEntry[]}){const[query,setQuery]=useState("");const results=searchLocal(index,query);return <section className="exam-search" id="ricerca"><h2>Ricerca locale</h2><label>Cerca tra lezioni, argomenti, esercizi, definizioni e fonti<input type="search" aria-label="Ricerca globale" value={query} maxLength={200} onChange={e=>setQuery(e.target.value)}/></label><p>Indice locale dei contenuti redatti e dei metadati delle fonti. Book.pdf e il testo integrale dei PDF non sono indicizzati. Nessuna soluzione di riferimento nell’indice.</p><div aria-live="polite">{!query.trim()?<p>Scrivi uno o più termini.</p>:!results.length?<p>Nessun risultato per questi termini.</p>:<ul>{results.map(r=><li key={r.id}><span className="mini-label">{r.category}</span><h3><Link href={r.href}>{r.title}</Link></h3><p>{r.context}…</p></li>)}</ul>}</div></section>;}
