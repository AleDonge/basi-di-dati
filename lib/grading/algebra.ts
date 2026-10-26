import {evaluateAlgebra} from "@/lib/algebra/evaluator";
import type {AlgebraFixture,AlgebraGrade,Relation} from "@/lib/algebra/types";
export function compareRelations(a:Relation,b:Relation) {
  if(a.columns.length!==b.columns.length||a.columns.some((c,i)=>c.name!==b.columns[i].name||c.type!==b.columns[i].type))return{equal:false,detail:"Schema diverso: controlla nomi, posizione e domini degli attributi richiesti."};
  const x=new Set(a.rows.map(r=>JSON.stringify(r))),y=new Set(b.rows.map(r=>JSON.stringify(r)));
  const equal=x.size===y.size&&[...x].every(v=>y.has(v));return{equal,detail:equal?"Schema e insieme delle tuple coincidono.":`Tuple diverse: ${x.size} ottenute, ${y.size} attese. Controlla filtri, join e identità prima della proiezione.`};
}
export function gradeAlgebra(expression:string,reference:string,fixtures:AlgebraFixture[]):AlgebraGrade {
  if(fixtures.length<2)return{status:"inconclusive",message:"Servono almeno due fixture: verifica sospesa.",checks:[]};
  const checks:AlgebraGrade["checks"]=[];
  for(const fixture of fixtures){const actual=evaluateAlgebra(expression,fixture);let expected;try{expected=evaluateAlgebra(reference,fixture);}catch{return{status:"inconclusive",message:"Riferimento non eseguibile: nessun esito di correttezza.",checks};}const compared=compareRelations(actual.nodes.at(-1)!.relation,expected.nodes.at(-1)!.relation);checks.push({fixtureId:fixture.id,passed:compared.equal,detail:compared.detail});}
  const passed=checks.every(c=>c.passed);return{status:passed?"passed":"failed",checks,message:passed?`Coerente su ${checks.length} fixture secondo il contratto dichiarato. Non è una prova di equivalenza generale.`:"Risultato diverso dal riferimento della piattaforma su almeno una fixture; consulta i casi indicati."};
}
