-- Soluzione Database Academy, needs-review, non fornita dal docente.
SELECT rating, AVG(age) AS eta_media, COUNT(*) AS numero_marinai FROM Sailors WHERE rating>5 GROUP BY rating HAVING COUNT(*)>=2;
