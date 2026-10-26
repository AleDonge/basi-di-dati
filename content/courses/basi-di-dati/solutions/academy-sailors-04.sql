-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT s.sid,COUNT(r.sid) FROM Sailors s LEFT JOIN Reserves r ON r.sid=s.sid GROUP BY s.sid;
