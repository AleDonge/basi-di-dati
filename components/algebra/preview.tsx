"use client";
import {useMemo} from "react";
import {renderToString} from "katex";
import {parseAlgebra} from "@/lib/algebra/parser";
import {algebraLatex} from "@/lib/algebra/format";
export function AlgebraPreview({expression}:{expression:string}){const html=useMemo(()=>{try{return renderToString(algebraLatex(parseAlgebra(expression)),{trust:false,strict:"error",throwOnError:true,displayMode:true,output:"htmlAndMathml"});}catch{return null;}},[expression]);return html?<div className="algebra-math" role="region" aria-label="Notazione matematica dell’espressione" tabIndex={0}><span dangerouslySetInnerHTML={{__html:html}}/></div>:null;}
