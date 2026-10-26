import {buildSearchIndex} from "@/lib/search";
import {LocalSearch} from "@/components/search";
export const metadata={title:"Ricerca locale"};
export default function Search(){return <><p className="eyebrow">TROVA NEL TUO PERCORSO</p><h1>Cerca tra i contenuti.</h1><LocalSearch index={buildSearchIndex()}/></>;}
