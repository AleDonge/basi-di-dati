-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT r.sid FROM Reserves r JOIN Boats b ON b.bid=r.bid WHERE b.color='red' EXCEPT SELECT r.sid FROM Reserves r JOIN Boats b ON b.bid=r.bid WHERE b.color='green';
