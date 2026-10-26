-- Soluzione Database Academy, needs-review, non fornita dal docente.
SELECT b.color, SUM(s.rating) AS somma_rating FROM Sailors s JOIN Reserves r ON s.sid=r.sid JOIN Boats b ON r.bid=b.bid GROUP BY b.color HAVING AVG(s.rating)>7;
