-- Soluzione Database Academy, needs-review; non fornita dal docente.
SELECT p.ProductID,p.ProductName,c.CategoryName FROM products p JOIN categories c ON c.CategoryID=p.CategoryID;
