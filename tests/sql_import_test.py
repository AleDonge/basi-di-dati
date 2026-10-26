import sys
import unittest
import sqlite3
import hashlib
import json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts/import-content'))
from convert_sql import convert, split_sql, literal
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'content/courses/basi-di-dati/datasets'

class ConversionTest(unittest.TestCase):
    def database(self,name):
        db=sqlite3.connect(':memory:');db.execute('PRAGMA foreign_keys=ON')
        db.executescript((DATA/name/'schema.sql').read_text(encoding='utf-8'))
        db.executescript((DATA/name/'seed.sql').read_text(encoding='utf-8'))
        self.addCleanup(db.close);return db

    def test_full_conversion_is_reproducible_and_sources_unchanged(self):
        paths=list(DATA.glob('*/*.sql'))+list(DATA.glob('*/*.json'))
        before={p:hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
        for name,file in [('sailors','Schema per generare DB Sailors.txt'),('northwind','Schema per generare DB NorthWind.txt')]:
            original=(ROOT/'source-material'/file).read_bytes()
            report=convert(name,file)
            self.assertEqual(report['sourceSha256'],hashlib.sha256(original).hexdigest())
            self.assertEqual((ROOT/'source-material'/file).read_bytes(),original)
            self.assertEqual((report['rowsSkipped'],report['columnsSkipped'],report['binaryValuesSkipped']),(0,0,0))
            self.assertTrue(all(t['everyValueCompared'] for t in report['tables'].values()))
        self.assertEqual(before,{p:hashlib.sha256(p.read_bytes()).hexdigest() for p in paths})

    def test_sailors_primary_keys_foreign_keys_and_dates(self):
        db=self.database('sailors')
        self.assertEqual([db.execute(f'SELECT count(*) FROM {t}').fetchone()[0] for t in ['Sailors','Boats','Reserves']],[10,4,10])
        self.assertEqual(db.execute('PRAGMA foreign_key_check').fetchall(),[])
        for sql in ["INSERT INTO Sailors VALUES(22,'Dup',7,30)","INSERT INTO Sailors VALUES(NULL,'Null',7,30)","INSERT INTO Reserves VALUES(999,101,'2050-01-01')","INSERT INTO Reserves VALUES(22,999,'2050-01-01')","INSERT INTO Reserves VALUES(22,101,NULL)"]:
            with self.assertRaises(sqlite3.IntegrityError):db.execute(sql)
        self.assertEqual(db.execute('SELECT day FROM Reserves WHERE sid=31 AND bid=104').fetchone()[0],'1998-01-11')

    def test_northwind_counts_unique_keys_binary_and_links(self):
        db=self.database('northwind')
        counts={'categories':8,'customers':91,'employees':9,'order_details':2155,'orders':830,'products':77,'shippers':3,'suppliers':29}
        for table,n in counts.items():self.assertEqual(db.execute(f'SELECT count(*) FROM {table}').fetchone()[0],n)
        self.assertEqual(sum(counts.values()),3202)
        report=json.loads((DATA/'northwind/conversion-report.json').read_text(encoding='utf-8'))
        actual=[hashlib.sha256(row[0]).hexdigest() for row in db.execute('SELECT Photo FROM employees ORDER BY EmployeeID')]
        self.assertEqual(actual,[b['sha256'] for b in report['binaryValues']])
        self.assertEqual(len(actual),9)
        self.assertTrue(all(c['missing']==0 for c in report['inferredLinkChecks']))
        with self.assertRaises(sqlite3.IntegrityError):db.execute("INSERT INTO categories VALUES(999,'Beverages','dup')")
        with self.assertRaises(sqlite3.IntegrityError):db.execute("INSERT INTO order_details VALUES(10248,11,1,1,0)")

    def test_mysql_literals_and_comment_framing(self):
        self.assertEqual(literal("'O\\'Brien'"),"O'Brien")
        self.assertEqual(literal("'a\\r\\nb\\\\c'"),'a\r\nb\\c')
        self.assertEqual(literal('0x00ff'),b'\0\xff')
        self.assertEqual(literal('NULL'),None)
        self.assertEqual(split_sql("-- comment\nINSERT INTO t VALUES('a;b'); # comment\nINSERT INTO t VALUES('c');"),["INSERT INTO t VALUES('a;b')","INSERT INTO t VALUES('c')"])
        with self.assertRaises(ValueError):split_sql("INSERT INTO t VALUES('open)")

if __name__=='__main__':unittest.main()
