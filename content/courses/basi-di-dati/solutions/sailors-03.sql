-- Soluzione Database Academy, needs-review, non fornita dal docente.
SELECT sname FROM Sailors GROUP BY sname HAVING COUNT(*)>1 AND MAX(age)-MIN(age)<10;
