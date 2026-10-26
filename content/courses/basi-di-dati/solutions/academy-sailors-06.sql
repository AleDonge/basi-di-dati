-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT sid,rating FROM Sailors WHERE rating=(SELECT MAX(rating) FROM Sailors);
