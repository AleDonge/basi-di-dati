-- Soluzione Database Academy, needs-review; non fornita dal docente.
WITH c AS (SELECT sid,COUNT(*) n FROM Reserves GROUP BY sid) SELECT sid,n FROM c WHERE n>=2;
