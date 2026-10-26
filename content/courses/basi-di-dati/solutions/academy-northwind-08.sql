-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT ProductID,SUM(UnitPrice*Quantity*(1-Discount)) FROM order_details GROUP BY ProductID;
