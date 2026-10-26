import {build} from "esbuild";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
const dir=resolve("tmp/exam-catalog");await mkdir(dir,{recursive:true});
await build({entryPoints:["lib/exam/catalog.ts"],outfile:resolve(dir,"catalog.mjs"),bundle:true,platform:"node",format:"esm",packages:"external"});
const {buildArchive}=await import(pathToFileURL(resolve(dir,"catalog.mjs")).href);
const archive=buildArchive(),json=JSON.stringify(archive,null,2)+"\n";
await mkdir("content/exam/archives",{recursive:true});const path=`content/exam/archives/${archive.archiveId}.json`;
try{const existing=await readFile(path,"utf8");if(existing!==json)throw new Error("Archivio esistente diverso: non sovrascrivere.");}catch(error){if(error.code!=="ENOENT")throw error;await writeFile(path,json,{flag:"wx"});}
await writeFile("content/exam/current.json",JSON.stringify({archiveId:archive.archiveId},null,2)+"\n");
console.log(`Exam Prep: ${Object.keys(archive.records).length} attività, archivio ${archive.archiveId}. Nessun archivio precedente rimosso.`);
