-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT p.ProductID FROM products p WHERE NOT EXISTS(SELECT 1 FROM order_details d WHERE d.ProductID=p.ProductID);
