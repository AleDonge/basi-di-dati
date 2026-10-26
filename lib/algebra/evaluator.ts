import {AlgebraError,type AlgebraFixture,type Relation,type Ast,type Predicate,type Operand,type Attribute,type TraceNode,type AlgebraEvaluation} from "./types";
import {fixtureSchema} from "./schema";
import {parseAlgebra} from "./parser";
const key=(row:(string|number)[])=>JSON.stringify(row);
export function asSet(relation:Relation):Relation {return{columns:relation.columns,rows:[...new Map(relation.rows.map(row=>[key(row),row])).values()]};}
function index(columns:Attribute[],name:string){const matches=columns.flatMap((c,i)=>(name.includes(".")?`${c.qualifier}.${c.name}`===name:c.name===name)?[i]:[]);if(matches.length!==1)throw new AlgebraError("semantic",matches.length?`Attributo ambiguo «${name}»: qualificalo o rinominalo.`:`Attributo inesistente «${name}».`);return matches[0];}
function compatible(a:Relation,b:Relation){if(a.columns.length!==b.columns.length||a.columns.some((c,i)=>c.type!==b.columns[i].type))throw new AlgebraError("semantic","Schemi incompatibili: servono stessa arità e domini compatibili nelle stesse posizioni.");}
function predicateFunction(p:Predicate,columns:Attribute[]):(row:(string|number)[])=>boolean {
  if(p.kind==="not"){const f=predicateFunction(p.child,columns);return row=>!f(row);}
  if(p.kind==="and"||p.kind==="or"){const a=predicateFunction(p.left,columns),b=predicateFunction(p.right,columns);return row=>p.kind==="and"?a(row)&&b(row):a(row)||b(row);}
  if(p.kind!=="compare")throw new AlgebraError("semantic","Predicato sconosciuto.");
  const operand=(o:Operand)=>{if(o.kind==="literal")return{type:typeof o.value==="number"?"number":"string",value:()=>o.value,literal:true};const i=index(columns,o.name);return{type:columns[i].type,value:(row:(string|number)[])=>row[i],literal:false};};
  const a=operand(p.left),b=operand(p.right);
  if(a.type!==b.type&&!((a.type==="date"&&b.type==="string"&&b.literal&&/^\d{4}-\d{2}-\d{2}$/.test(String(b.value([]))))||(b.type==="date"&&a.type==="string"&&a.literal&&/^\d{4}-\d{2}-\d{2}$/.test(String(a.value([]))))))throw new AlgebraError("semantic","Confronto tra domini incompatibili: nessuna conversione implicita testo/numero.");
  return row=>{const x=a.value(row),y=b.value(row);switch(p.operator){case"=":return x===y;case"!=":case"<>":case"≠":return x!==y;case"<":return x<y;case">":return x>y;case"<=":case"≤":return x<=y;case">=":case"≥":return x>=y;default:return false;}};
}
export function evaluateAlgebra(text:string,input:AlgebraFixture):AlgebraEvaluation {
  const parsed=fixtureSchema.safeParse(input);if(!parsed.success)throw new AlgebraError("semantic","Dataset non valido: verifica attributi, domini, tuple e assenza di NULL.");
  const ast=parseAlgebra(text),fixture=parsed.data;const nodes:TraceNode[]=[];let operations=0,cells=0;const started=performance.now();
  function tick(n=1){operations+=n;if(operations>250000||performance.now()-started>1000)throw new AlgebraError("resource","Budget superato: riduci prodotti, self-join o annidamento. Nessun risultato parziale corretto.");}
  function visit(node:Ast):Relation {
    tick();let result:Relation;const children:number[]=[];
    if(node.kind==="relation") {const r=Object.hasOwn(fixture.relations,node.name)?fixture.relations[node.name]:undefined;if(!r)throw new AlgebraError("semantic",`Relazione inesistente «${node.name}».`);result=asSet({columns:r.columns.map(c=>({...c,qualifier:c.qualifier??node.name})),rows:r.rows});}
    else if("child" in node){const r=visit(node.child);children.push(node.child.id);
      if(node.kind==="select"){const test=predicateFunction(node.predicate,r.columns);result={columns:r.columns,rows:r.rows.filter(row=>{tick();return test(row);})};}
      else if(node.kind==="project"){const indices=node.attributes.map(a=>index(r.columns,a));if(new Set(indices).size!==indices.length)throw new AlgebraError("semantic","Non ripetere lo stesso attributo nella proiezione.");result=asSet({columns:indices.map(i=>r.columns[i]),rows:r.rows.map(row=>{tick();return indices.map(i=>row[i]);})});}
      else {const mapping=new Map<number,string>();for(const m of node.mappings){const i=index(r.columns,m.from);if(mapping.has(i))throw new AlgebraError("semantic","Attributo rinominato più volte.");mapping.set(i,m.to);}const columns=r.columns.map((c,i)=>({...c,name:mapping.get(i)??c.name,...(node.alias?{qualifier:node.alias}:{})}));if(new Set(columns.map(c=>`${c.qualifier}.${c.name}`)).size!==columns.length)throw new AlgebraError("semantic","La rinomina produce attributi duplicati.");result={columns,rows:r.rows};}
    } else {const a=visit(node.left),b=visit(node.right);children.push(node.left.id,node.right.id);
      if(["union","difference","intersection"].includes(node.kind)){compatible(a,b);const right=new Set(b.rows.map(key));result={columns:a.columns,rows:node.kind==="union"?asSet({columns:a.columns,rows:[...a.rows,...b.rows]}).rows:a.rows.filter(row=>{tick();return node.kind==="difference"?!right.has(key(row)):right.has(key(row));})};}
      else if(node.kind==="divide"){
        const yi=b.columns.map(c=>index(a.columns,c.name));if(yi.some((i,j)=>a.columns[i].type!==b.columns[j].type)||new Set(yi).size!==yi.length)throw new AlgebraError("semantic","Divisione: gli attributi del divisore devono essere un sottoinsieme con gli stessi domini.");
        const xi=a.columns.flatMap((_c,i)=>yi.includes(i)?[]:[i]);const candidates=asSet({columns:xi.map(i=>a.columns[i]),rows:a.rows.map(row=>xi.map(i=>row[i]))});const all=new Set(a.rows.map(key));
        result={columns:candidates.columns,rows:candidates.rows.filter(x=>b.rows.every(y=>{tick();const row:(string|number)[]=[];xi.forEach((i,j)=>row[i]=x[j]);yi.forEach((i,j)=>row[i]=y[j]);return all.has(key(row));}))};
      } else {
        const natural=node.kind==="join"&&!node.predicate;
        const pairs=natural?a.columns.flatMap((c,i)=>b.columns.flatMap((d,j)=>c.name===d.name?[[i,j]]:[])):[];
        if(natural&&(new Set(a.columns.map(c=>c.name)).size!==a.columns.length||new Set(b.columns.map(c=>c.name)).size!==b.columns.length))throw new AlgebraError("semantic","Join naturale ambiguo: rinomina gli attributi ripetuti prima del join.");
        if(pairs.some(([i,j])=>a.columns[i].type!==b.columns[j].type))throw new AlgebraError("semantic","Join naturale: domini incompatibili sugli attributi comuni.");
        const keep=b.columns.flatMap((_c,j)=>pairs.some(([,k])=>j===k)?[]:[j]);const full=[...a.columns,...b.columns];const columns=natural?[...a.columns,...keep.map(j=>b.columns[j])]:full;
        if(new Set(columns.map(c=>`${c.qualifier}.${c.name}`)).size!==columns.length)throw new AlgebraError("semantic","Prodotto/self-join con attributi indistinguibili: usa ρ con alias diversi.");
        const test=node.predicate?predicateFunction(node.predicate,full):undefined;const rows:Relation["rows"]=[];
        for(const x of a.rows)for(const y of b.rows){tick();if(pairs.every(([i,j])=>x[i]===y[j])&&(!test||test([...x,...y]))) {rows.push(natural?[...x,...keep.map(j=>y[j])]:[...x,...y]);if(rows.length>2000)throw new AlgebraError("resource","Risultato intermedio oltre 2000 tuple: nessun troncamento silenzioso.");}}
        result=asSet({columns,rows});
      }
    }
    cells+=result.rows.length*Math.max(1,result.columns.length);if(result.rows.length>2000||result.columns.length>32||cells>100000)throw new AlgebraError("resource","Relazioni intermedie oltre i limiti (2000 tuple, 32 attributi, 100.000 celle totali).");
    nodes.push({id:node.id,label:node.kind==="relation"?node.name:({select:"σ Selezione",project:"π Proiezione",rename:"ρ Ridenominazione",union:"∪ Unione",intersection:"∩ Intersezione",difference:"− Differenza",product:"× Prodotto",join:node.kind==="join"&&node.predicate?"⋈ Theta join":"⋈ Join naturale",divide:"÷ Divisione"})[node.kind],children,relation:result});return result;
  }
  visit(ast);return{rootId:ast.id,nodes,operations};
}
