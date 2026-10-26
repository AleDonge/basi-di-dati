-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT ProductID,SUM(Quantity) FROM order_details GROUP BY ProductID HAVING SUM(Quantity)>=10;
