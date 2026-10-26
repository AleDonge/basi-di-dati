export type Domain = "number" | "string" | "date";
export interface Attribute { name:string; type:Domain; qualifier?:string }
export interface Relation { columns:Attribute[]; rows:(string|number)[][] }
export interface AlgebraFixture { id:string; title:string; provenance:string; relations:Record<string,Relation> }
export type Operand = {kind:"attribute";name:string} | {kind:"literal";value:string|number};
export type Predicate = {kind:"compare";operator:string;left:Operand;right:Operand} | {kind:"and"|"or";left:Predicate;right:Predicate} | {kind:"not";child:Predicate};
export type Ast = {id:number} & (
  {kind:"relation";name:string} |
  {kind:"select";predicate:Predicate;child:Ast} |
  {kind:"project";attributes:string[];child:Ast} |
  {kind:"rename";alias?:string;mappings:{from:string;to:string}[];child:Ast} |
  {kind:"product"|"join"|"union"|"difference"|"intersection"|"divide";left:Ast;right:Ast;predicate?:Predicate}
);
export interface TraceNode { id:number; label:string; children:number[]; relation:Relation }
export interface AlgebraEvaluation { rootId:number; nodes:TraceNode[]; operations:number }
export class AlgebraError extends Error { constructor(readonly kind:"syntax"|"semantic"|"resource"|"cancelled",message:string) {super(message);this.name="AlgebraError";} }
export interface AlgebraGrade { status:"passed"|"failed"|"inconclusive"; message:string; checks:{fixtureId:string;passed:boolean;detail:string}[] }
