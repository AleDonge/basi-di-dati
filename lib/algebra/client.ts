import {AlgebraError,type AlgebraEvaluation,type AlgebraGrade,type AlgebraFixture} from "./types";
export class AlgebraAdapter {
  private worker?:Worker;private reject?: (e:Error)=>void;private timer?:ReturnType<typeof setTimeout>;
  stop(){this.worker?.terminate();this.worker=undefined;clearTimeout(this.timer);this.reject?.(new AlgebraError("cancelled","Esecuzione interrotta. I progressi sono conservati."));this.reject=undefined;}
  private run<T>(input:unknown):Promise<T>{this.stop();return new Promise((resolve,reject)=>{this.reject=reject;this.worker=new Worker("/algebra/algebra-worker.js",{type:"module"});this.timer=setTimeout(()=>{reject(new AlgebraError("resource","Tempo massimo del worker superato: riduci l’espressione."));this.stop();},5000);this.worker.onmessage=event=>{const message=event.data;this.reject=undefined;this.stop();if(message.ok)resolve(message.value);else reject(new AlgebraError(message.error.kind,message.error.message));};this.worker.onerror=()=>{reject(new AlgebraError("resource","Worker non disponibile. Riprova dopo aver verificato gli asset locali."));this.stop();};this.worker.postMessage(input);});}
  execute(expression:string,fixture:AlgebraFixture){return this.run<AlgebraEvaluation>({type:"execute",expression,fixture});}
  grade(expression:string,reference:string,fixtures:AlgebraFixture[]){return this.run<AlgebraGrade>({type:"grade",expression,reference,fixtures});}
}
