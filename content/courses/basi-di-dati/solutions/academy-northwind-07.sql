-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT c.CustomerID,COUNT(o.OrderID) FROM customers c LEFT JOIN orders o ON o.CustomerID=c.CustomerID GROUP BY c.CustomerID;
