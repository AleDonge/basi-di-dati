import { AlgebraError,type Ast,type Operand,type Predicate } from "./types";
interface Token {value:string;position:number}
function tokenize(text:string):Token[] {
  if(text.length>10000) throw new AlgebraError("resource","Espressione oltre 10.000 caratteri.");
  const tokens:Token[]=[];let offset=0;
  const pattern=/\s+|'(?:[^']|'')*'|(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)?|<=|>=|!=|<>|->|<-|[σπρ×∪∩−–⋈÷∧∨¬≤≥≠→←_{}[\](),;=<>-]/uy;
  while(offset<text.length) {
    pattern.lastIndex=offset;const match=pattern.exec(text);
    if(!match) throw new AlgebraError("syntax",`Simbolo non riconosciuto alla posizione ${offset+1}: ${text[offset]}. Usa apici singoli per il testo.`);
    if(!/^\s+$/.test(match[0])) tokens.push({value:match[0],position:offset});offset=pattern.lastIndex;
    if(tokens.length>2000) throw new AlgebraError("resource","Troppi simboli nell’espressione.");
  }
  return tokens;
}
const identifier=/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)?$/;
class Reader {
  position=0; constructor(readonly tokens:Token[]) {}
  peek(){return this.tokens[this.position]?.value ?? "";}
  take(){const token=this.tokens[this.position++];if(!token) this.fail("Espressione incompleta");return token.value;}
  accept(value:string){if(this.peek()===value){this.position++;return true;}return false;}
  expect(value:string){if(!this.accept(value))this.fail(`Atteso «${value}», trovato «${this.peek() || "fine"}»`);}
  fail(message:string):never {throw new AlgebraError("syntax",`${message} (posizione ${(this.tokens[this.position]?.position ?? this.tokens.at(-1)?.position ?? 0)+1}).`);}
  name(){const value=this.take();if(!identifier.test(value))this.fail(`Attributo o relazione non valido: ${value}`);return value;}
  end(){if(this.peek())this.fail(`Simbolo inatteso «${this.peek()}»`);}
}
class ConditionReader extends Reader {
  depth=0;
  parse(min=0):Predicate {
    if(++this.depth>32)this.fail("Condizione troppo annidata");
    let left:Predicate;
    if(["NOT","¬"].includes(this.peek().toUpperCase())){this.take();left={kind:"not",child:this.parse(30)};}
    else if(this.accept("(")){left=this.parse();this.expect(")");}
    else {
      const a=this.operand(),operator=this.take();
      if(!["=","!=","<>","≠","<",">","<=",">=","≤","≥"].includes(operator))this.fail("Atteso un confronto =, !=, <, >, <= o >=");
      left={kind:"compare",operator,left:a,right:this.operand()};
    }
    while(true){const op=this.peek().toUpperCase();const precedence=["AND","∧"].includes(op)?20:["OR","∨"].includes(op)?10:0;if(!precedence||precedence<min)break;this.take();left={kind:precedence===20?"and":"or",left,right:this.parse(precedence+1)};}
    this.depth--;return left;
  }
  operand():Operand {
    const negative=this.accept("-");const value=this.take();
    if(/^\d/.test(value)){const number=Number((negative?"-":"")+value);if(!Number.isFinite(number))this.fail("Numero non finito");return{kind:"literal",value:number};}
    if(negative)this.fail("Il segno meno richiede un numero");
    if(value.startsWith("'"))return{kind:"literal",value:value.slice(1,-1).replaceAll("''","'")};
    if(!identifier.test(value))this.fail("Atteso un attributo o una costante");return{kind:"attribute",name:value};
  }
}
function condition(tokens:Token[]){const p=new ConditionReader(tokens);const value=p.parse();p.end();return value;}
const binary:Record<string,{kind:"product"|"join"|"union"|"difference"|"intersection"|"divide";precedence:number}>={
  "∪":{kind:"union",precedence:10},UNION:{kind:"union",precedence:10},"−":{kind:"difference",precedence:10},"–":{kind:"difference",precedence:10},"-":{kind:"difference",precedence:10},DIFF:{kind:"difference",precedence:10},"∩":{kind:"intersection",precedence:20},INTERSECT:{kind:"intersection",precedence:20},"×":{kind:"product",precedence:30},PRODUCT:{kind:"product",precedence:30},"⋈":{kind:"join",precedence:30},JOIN:{kind:"join",precedence:30},"÷":{kind:"divide",precedence:30},DIVIDE:{kind:"divide",precedence:30},
};
class AlgebraReader extends Reader {
  nextId=0;depth=0;
  header(){this.accept("_");const opening=this.peek();if(opening==="{"||opening==="["){this.take();const close=opening==="{"?"}":"]";const start=this.position;while(this.peek()&&this.peek()!==close)this.position++;const tokens=this.tokens.slice(start,this.position);this.expect(close);return tokens;}const start=this.position;while(this.peek()&&this.peek()!=="(")this.position++;return this.tokens.slice(start,this.position);}
  parse(min=0):Ast {
    if(++this.depth>32)throw new AlgebraError("resource","Massimo 32 livelli di annidamento.");
    let left:Ast;const op=this.peek();
    if(this.accept("(")){left=this.parse();this.expect(")");}
    else if(["σ","π","ρ","select","project","rename"].includes(op.toLowerCase())) {
      this.take();const header=this.header();this.expect("(");const child=this.parse();this.expect(")");const id=this.nextId++;
      if(["σ","select"].includes(op.toLowerCase()))left={id,kind:"select",predicate:condition(header),child};
      else if(["π","project"].includes(op.toLowerCase())){const r=new Reader(header);const attributes=[r.name()];while(r.accept(","))attributes.push(r.name());r.end();left={id,kind:"project",attributes,child};}
      else {const r=new Reader(header);let alias:string|undefined;const mappings:{from:string;to:string}[]=[];
        if(header.length===1||header[1]?.value===";"){alias=r.name();r.accept(";");}
        while(r.peek()){const first=r.name();const arrow=r.take();if(!["->","→","<-","←"].includes(arrow))r.fail("Rinomina: usa vecchio->nuovo o nuovo<-vecchio");const second=r.name();mappings.push(["<-","←"].includes(arrow)?{from:second,to:first}:{from:first,to:second});if(!r.accept(","))break;}
        r.end();if(!alias&&!mappings.length)r.fail("Rinomina vuota");if(alias?.includes(".")||mappings.some(m=>m.to.includes(".")))r.fail("Alias e nuovi nomi devono essere identificatori semplici, senza punto");left={id,kind:"rename",alias,mappings,child};
      }
    } else left={id:this.nextId++,kind:"relation",name:this.name()};
    while(true){const token=this.peek().toUpperCase();const entry=Object.hasOwn(binary,token)?binary[token]:undefined;if(!entry||entry.precedence<min)break;this.take();const predicate=entry.kind==="join"&&["_","{","["].includes(this.peek())?condition(this.header()):undefined;const right=this.parse(entry.precedence+1);left={id:this.nextId++,kind:entry.kind,left,right,...(predicate?{predicate}:{})};if(this.nextId>128)throw new AlgebraError("resource","Massimo 128 nodi.");}
    this.depth--;if(this.nextId>128)throw new AlgebraError("resource","Massimo 128 nodi.");return left;
  }
}
export function parseAlgebra(text:string):Ast {const p=new AlgebraReader(tokenize(text));const ast=p.parse();p.end();function depth(n:Ast,level:number){if(level>32)throw new AlgebraError("resource","Albero oltre 32 livelli.");if("child" in n)depth(n.child,level+1);else if("left" in n){depth(n.left,level+1);depth(n.right,level+1);}}depth(ast,1);return ast;}
