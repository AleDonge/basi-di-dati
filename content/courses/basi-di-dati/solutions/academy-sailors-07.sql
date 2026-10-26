-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT s.sid,s.sname FROM Sailors s WHERE NOT EXISTS(SELECT 1 FROM Reserves r WHERE r.sid=s.sid);
