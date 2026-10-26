-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT ProductID,UnitPrice FROM products WHERE UnitPrice>(SELECT AVG(UnitPrice) FROM products);
