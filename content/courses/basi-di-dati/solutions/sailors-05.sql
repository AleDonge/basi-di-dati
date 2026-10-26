-- Soluzione Database Academy, needs-review, non fornita dal docente.
SELECT b.bid, b.bname FROM Boats b JOIN Reserves r ON b.bid=r.bid JOIN Sailors s ON s.sid=r.sid GROUP BY b.bid,b.bname HAVING AVG(s.age)>40 AND COUNT(*)>=2;
