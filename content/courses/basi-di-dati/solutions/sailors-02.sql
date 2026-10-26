-- Soluzione Database Academy, needs-review, non fornita dal docente.
SELECT r.day FROM Reserves r JOIN Sailors s ON r.sid=s.sid WHERE s.age>=18 GROUP BY r.day HAVING COUNT(*)>=2;
