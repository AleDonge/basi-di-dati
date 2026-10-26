-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT CategoryID,COUNT(*) FROM products WHERE CategoryID IS NOT NULL GROUP BY CategoryID HAVING COUNT(*)>=2;
