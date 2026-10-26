-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT rating,COUNT(*),AVG(age) FROM Sailors WHERE age>=18 GROUP BY rating HAVING COUNT(*)>=2;
