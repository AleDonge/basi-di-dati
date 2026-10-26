import "fake-indexeddb/auto";
import {describe,it,expect} from "vitest";
import {deleteDB} from "idb";
import {importProgress,readProgress,saveExerciseAttempt} from "@/lib/progress/db";
import {emptyProgress,parseBackup} from "@/lib/progress/schemas";
import {moduleProgress} from "@/lib/progress/selectors";
import {manifest} from "@/lib/content";
const date="2026-10-24T12:00:00.000Z";
const sql={id:"sql-old",exerciseId:"sailors-01",exerciseVersion:1,answer:"SELECT 1",result:"passed" as const,feedback:"Conservato",attemptedAt:date};
const algebra={...sql,id:"ar-new",exerciseId:"ar-sailors-01",answer:"π_sname(Sailors)",verificationStatus:"passed" as const};
describe("Algebra e archivio v3 preesistente",()=>{
 it("aggiunge algebra senza cambiare formato, perdere SQL, letture o cronologia",async()=>{const name="algebra-legacy-v3";await deleteDB(name);const old={...emptyProgress(),attempts:[sql],lessons:[{lessonId:"dbms-dati",lessonVersion:1,lastVisitedAt:date,completedAt:date}],sqlHistory:[{id:"old-query",datasetId:"sailors" as const,query:"SELECT 1",status:"executed" as const,feedback:"Eseguita",attemptedAt:date}]};await importProgress(old,name);await saveExerciseAttempt(algebra,name);const current=await readProgress(name);expect(current.schemaVersion).toBe(5);expect(current.attempts).toEqual([algebra,sql]);expect(current.lessons).toEqual(old.lessons);expect(current.sqlHistory).toEqual(old.sqlHistory);const backup=parseBackup(JSON.stringify(current));await deleteDB(name);await importProgress(backup,name);expect((await readProgress(name)).attempts).toEqual(current.attempts);await deleteDB(name);});
 it("conserva versioni precedenti, tentativi guidati e import atomico sui conflitti",async()=>{const name="algebra-conflict";await deleteDB(name);await saveExerciseAttempt(algebra,name);await saveExerciseAttempt({...algebra,id:"ar-new-v2",exerciseVersion:2,result:"guided"},name);const backup=await readProgress(name);expect(backup.attempts).toHaveLength(2);await expect(importProgress({...emptyProgress(),attempts:[{...algebra,answer:"Boats"}]},name)).rejects.toThrow("Conflitto");expect((await readProgress(name)).attempts).toHaveLength(2);await deleteDB(name);});
 it("le nuove lezioni cambiano i totali senza cancellare completamenti precedenti",()=>{const data={...emptyProgress(),lessons:[{lessonId:"dbms-dati",lessonVersion:1,lastVisitedAt:date,completedAt:date}]};expect(moduleProgress("introduzione",manifest.lessons,data).completed).toBe(1);expect(moduleProgress("algebra-relazionale",manifest.lessons,data)).toMatchObject({completed:0,total:9});expect(data.lessons).toHaveLength(1);});
});
