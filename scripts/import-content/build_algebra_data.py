import json, sqlite3, copy, argparse
from pathlib import Path
ROOT=Path('content/courses/basi-di-dati')
parser=argparse.ArgumentParser(description='Rigenera i dataset di algebra da fonti locali.')
parser.add_argument('--output-root',type=Path,default=ROOT,help='Directory destinazione; non cambia le fonti lette.')
OUTPUT_ROOT=parser.parse_args().output_root
def write(path,value):
 p=OUTPUT_ROOT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sailors(seed,id,provenance):
 db=sqlite3.connect(':memory:');db.executescript((ROOT/'datasets/sailors/schema.sql').read_text(encoding='utf-8'));db.executescript(seed)
 relations={}
 for table in ['Sailors','Boats','Reserves']:
  cols=[]
  for c in db.execute(f'PRAGMA table_info({table})'):
   cols.append({'name':c[1],'type':'date' if c[1]=='day' else 'number' if c[2] in ['INT','REAL'] else 'string'})
  relations[table]={'columns':cols,'rows':[list(r) for r in db.execute(f'SELECT * FROM {table}')]}
 db.close();return {'id':id,'title':id,'provenance':provenance,'relations':relations}
official=sailors((ROOT/'datasets/sailors/seed.sql').read_text(encoding='utf-8'),'sailors','Script ufficiale Sailors convertito nello Sprint 2: valori invariati, data ISO; non è la diversa istanza S3 delle slide.')
edge=copy.deepcopy(official);edge.update(id='sailors-algebra-edges',title='Sailors: casi sintetici',provenance='Database Academy, dati sintetici separati dall’originale: omonimi, colori, confini, prenotazioni ripetute, barche mai prenotate.')
edge['relations']['Sailors']['rows']=[[1,'Ada',8,30],[2,'Ada',7,31],[3,'Luca',9,40],[4,'Nora',5,29],[5,'Tutti',10,50],[6,'Mai',3,20],[7,'Verde',7,35]]
edge['relations']['Boats']['rows']=[[101,'A','red'],[102,'B','green'],[103,'C','blue'],[104,'D','red']]
edge['relations']['Reserves']['rows']=[[1,101,'2000-01-01'],[1,101,'2000-01-02'],[2,102,'2000-01-01'],[3,101,'2000-01-01'],[3,102,'2000-01-01'],[4,101,'2000-01-01'],[7,102,'2000-01-01']]+[[5,b,'2000-01-01'] for b in [101,102,103,104]]
empty=copy.deepcopy(edge);empty.update(id='sailors-algebra-empty',title='Relazioni vuote');
for r in empty['relations'].values():r['rows']=[]
noreservations=copy.deepcopy(edge);noreservations.update(id='sailors-algebra-no-reserves',title='Marinai e barche senza prenotazioni');noreservations['relations']['Reserves']['rows']=[]
reverse=copy.deepcopy(edge);reverse.update(id='sailors-algebra-reversed',title='Ordine inverso e tuple duplicate all’ingresso')
for r in reverse['relations'].values():r['rows']=list(reversed(r['rows']))+r['rows'][:1]
for f in [official,edge,empty,noreservations,reverse]:write(Path('algebra/datasets')/(f['id']+'.json'),f)
employees={'Impiegato':{'columns':[{'name':n,'type':t} for n,t in [('Matricola','number'),('Cognome','string'),('Stipendio','number'),('Dipartimento','number')]],'rows':[[1,'Rossi',70,10],[2,'Bianchi',50,10],[3,'Verdi',90,20],[4,'Neri',60,20],[5,'Rossi',80,30],[6,'Solo',100,30]]},'Dipartimento':{'columns':[{'name':n,'type':t} for n,t in [('Codice','number'),('Nome','string'),('Sede','string'),('Direttore','number')]],'rows':[[10,'Ricerca','Roma',2],[20,'Vendite','Trento',3],[30,'Ricerca','Roma',5],[40,'Vuoto','Roma',1]]},'Progetto':{'columns':[{'name':n,'type':t} for n,t in [('Sigla','string'),('Nome','string'),('Bilancio','number'),('Responsabile','number')]],'rows':[['P1','Studio',150,1],['P2','Studio',100,3],['P3','Portale',200,5],['P4','Senza partecipanti',80,2]]},'Partecipazione':{'columns':[{'name':'Impiegato','type':'number'},{'name':'Progetto','type':'string'}],'rows':[[1,'P1'],[1,'P2'],[2,'P1'],[3,'P3'],[4,'P2'],[5,'P1'],[5,'P3']]}}
emp={'id':'impiegati-demo','title':'Impiegati e progetti · dati sintetici','provenance':'Schema trascritto da esercitazione_AR.pdf p. 1. Tutte le righe sono inventate dalla piattaforma per lo studio, non fornite dal docente. Stipendio in milioni; Bilancio in migliaia: convenzioni didattiche, non riconciliano 60K nel testo.','relations':employees}
empedge=copy.deepcopy(emp);empedge.update(id='impiegati-edges',title='Impiegati: confini e omonimi');empedge['relations']['Impiegato']['rows'] += [[7,'Confine',50,10],[8,'Pari',100,20],[9,'Nessuno',60,30]];empedge['relations']['Partecipazione']['rows'] += [[8,'P1'],[8,'P2'],[8,'P3']];empedge['relations']['Progetto']['rows'] += [['P5','Confine',100,8]]
empempty=copy.deepcopy(emp);empempty.update(id='impiegati-empty',title='Impiegati: relazioni vuote');
for r in empempty['relations'].values():r['rows']=[]
emprev=copy.deepcopy(empedge);emprev.update(id='impiegati-reversed',title='Impiegati: ordine inverso')
for r in emprev['relations'].values():r['rows'].reverse()
for f in [emp,empedge,empempty,emprev]:write(Path('algebra/datasets')/(f['id']+'.json'),f)
