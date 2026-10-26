import type {Ast,Predicate,Operand} from "./types";
const escape=(text:string)=>[...text].map(c=>({"\\":"\\textbackslash{}","{":"\\{","}":"\\}","_":"\\_","$":"\\$","&":"\\&","#":"\\#","%":"\\%","^":"\\textasciicircum{}","~":"\\textasciitilde{}"})[c]??c).join("");
const text=(value:string)=>`\\text{${escape(value)}}`;
function operand(value:Operand):string{return value.kind==="attribute"?text(value.name):typeof value.value==="number"?String(value.value):text(`'${value.value}'`);}
function condition(p:Predicate):string{if(p.kind==="not")return`\\neg (${condition(p.child)})`;if(p.kind==="compare")return`${operand(p.left)} ${({"<=":"\\le",">=":"\\ge","≤":"\\le","≥":"\\ge","!=":"\\ne","<>":"\\ne","≠":"\\ne"})[p.operator]??p.operator} ${operand(p.right)}`;return`(${condition(p.left)} ${p.kind==="and"?"\\land":"\\lor"} ${condition(p.right)})`;}
export function algebraLatex(ast:Ast):string{
 if(ast.kind==="relation")return text(ast.name);
 if(ast.kind==="select")return`\\sigma_{${condition(ast.predicate)}}\\left(${algebraLatex(ast.child)}\\right)`;
 if(ast.kind==="project")return`\\pi_{${text(ast.attributes.join(", "))}}\\left(${algebraLatex(ast.child)}\\right)`;
 if(ast.kind==="rename")return`\\rho_{${text([ast.alias,...ast.mappings.map(m=>`${m.from} -> ${m.to}`)].filter(Boolean).join("; "))}}\\left(${algebraLatex(ast.child)}\\right)`;
 const op={product:"\\times",union:"\\cup",difference:"-",intersection:"\\cap",join:"\\bowtie",divide:"\\div"}[ast.kind];
 return`\\left(${algebraLatex(ast.left)} ${op}${ast.predicate?`_{${condition(ast.predicate)}}`:""} ${algebraLatex(ast.right)}\\right)`;
}
