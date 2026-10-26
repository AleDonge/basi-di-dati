CREATE TABLE "categories" (
  "CategoryID" INT NOT NULL,
  "CategoryName" TEXT NOT NULL,
  "Description" TEXT,
  PRIMARY KEY (`CategoryID`),
  UNIQUE (`CategoryName`)
);

CREATE TABLE "customers" (
  "CustomerID" TEXT NOT NULL,
  "CompanyName" TEXT NOT NULL,
  "ContactName" TEXT DEFAULT NULL,
  "ContactTitle" TEXT DEFAULT NULL,
  "Address" TEXT DEFAULT NULL,
  "City" TEXT DEFAULT NULL,
  "Region" TEXT DEFAULT NULL,
  "PostalCode" TEXT DEFAULT NULL,
  "Country" TEXT DEFAULT NULL,
  "Phone" TEXT DEFAULT NULL,
  "Fax" TEXT DEFAULT NULL,
  "Image" BLOB,
  "ImageThumbnail" BLOB,
  PRIMARY KEY (`CustomerID`)
);

CREATE TABLE "employees" (
  "EmployeeID" INT NOT NULL,
  "LastName" TEXT NOT NULL,
  "FirstName" TEXT NOT NULL,
  "Title" TEXT DEFAULT NULL,
  "TitleOfCourtesy" TEXT DEFAULT NULL,
  "BirthDate" TEXT DEFAULT NULL,
  "HireDate" TEXT DEFAULT NULL,
  "Address" TEXT DEFAULT NULL,
  "City" TEXT DEFAULT NULL,
  "Region" TEXT DEFAULT NULL,
  "PostalCode" TEXT DEFAULT NULL,
  "Country" TEXT DEFAULT NULL,
  "HomePhone" TEXT DEFAULT NULL,
  "Extension" TEXT DEFAULT NULL,
  "Photo" BLOB,
  "Notes" TEXT,
  "ReportsTo" INT DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`)
);

CREATE TABLE "order_details" (
  "OrderID" INT NOT NULL,
  "ProductID" INT NOT NULL,
  "UnitPrice" REAL NOT NULL DEFAULT '0.0000',
  "Quantity" INT NOT NULL DEFAULT '1',
  "Discount" REAL NOT NULL DEFAULT '0',
  PRIMARY KEY (`OrderID`,`ProductID`)
);

CREATE TABLE "orders" (
  "OrderID" INT NOT NULL,
  "CustomerID" TEXT DEFAULT NULL,
  "EmployeeID" INT DEFAULT NULL,
  "OrderDate" TEXT DEFAULT NULL,
  "RequiredDate" TEXT DEFAULT NULL,
  "ShippedDate" TEXT DEFAULT NULL,
  "ShipVia" INT DEFAULT NULL,
  "Freight" REAL DEFAULT '0.0000',
  "ShipName" TEXT DEFAULT NULL,
  "ShipAddress" TEXT DEFAULT NULL,
  "ShipCity" TEXT DEFAULT NULL,
  "ShipRegion" TEXT DEFAULT NULL,
  "ShipPostalCode" TEXT DEFAULT NULL,
  "ShipCountry" TEXT DEFAULT NULL,
  PRIMARY KEY (`OrderID`)
);

CREATE TABLE "products" (
  "ProductID" INT NOT NULL,
  "ProductName" TEXT NOT NULL,
  "SupplierID" INT DEFAULT NULL,
  "CategoryID" INT DEFAULT NULL,
  "QuantityPerUnit" TEXT DEFAULT NULL,
  "UnitPrice" REAL DEFAULT '0.0000',
  "UnitsInStock" INT DEFAULT '0',
  "UnitsOnOrder" INT DEFAULT '0',
  "ReorderLevel" INT DEFAULT '0',
  "Discontinued" INT DEFAULT '0',
  PRIMARY KEY (`ProductID`)
);

CREATE TABLE "shippers" (
  "ShipperID" INT NOT NULL,
  "CompanyName" TEXT NOT NULL,
  "Phone" TEXT DEFAULT NULL,
  PRIMARY KEY (`ShipperID`)
);

CREATE TABLE "suppliers" (
  "SupplierID" INT NOT NULL,
  "CompanyName" TEXT NOT NULL,
  "ContactName" TEXT DEFAULT NULL,
  "ContactTitle" TEXT DEFAULT NULL,
  "Address" TEXT DEFAULT NULL,
  "City" TEXT DEFAULT NULL,
  "Region" TEXT DEFAULT NULL,
  "PostalCode" TEXT DEFAULT NULL,
  "Country" TEXT DEFAULT NULL,
  "Phone" TEXT DEFAULT NULL,
  "Fax" TEXT DEFAULT NULL,
  "HomePage" TEXT,
  PRIMARY KEY (`SupplierID`)
);

CREATE INDEX "customers_City" ON "customers" (`City`);

CREATE INDEX "customers_CompanyName" ON "customers" (`CompanyName`);

CREATE INDEX "customers_PostalCode" ON "customers" (`PostalCode`);

CREATE INDEX "customers_Region" ON "customers" (`Region`);

CREATE INDEX "employees_LastName" ON "employees" (`LastName`);

CREATE INDEX "employees_PostalCode" ON "employees" (`PostalCode`);

CREATE INDEX "order_details_OrderID" ON "order_details" (`OrderID`);

CREATE INDEX "order_details_ProductID" ON "order_details" (`ProductID`);

CREATE INDEX "orders_CustomerID" ON "orders" (`CustomerID`);

CREATE INDEX "orders_EmployeeID" ON "orders" (`EmployeeID`);

CREATE INDEX "orders_OrderDate" ON "orders" (`OrderDate`);

CREATE INDEX "orders_ShippedDate" ON "orders" (`ShippedDate`);

CREATE INDEX "orders_ShipPostalCode" ON "orders" (`ShipPostalCode`);

CREATE INDEX "products_CategoryID" ON "products" (`CategoryID`);

CREATE INDEX "products_ProductName" ON "products" (`ProductName`);

CREATE INDEX "products_SupplierID" ON "products" (`SupplierID`);

CREATE INDEX "suppliers_CompanyName" ON "suppliers" (`CompanyName`);

CREATE INDEX "suppliers_PostalCode" ON "suppliers" (`PostalCode`);
