CREATE TABLE "Sailors" (
  "sid" INT NOT NULL,
  "sname" TEXT not null,
  "rating" INT,
  "age" REAL,
  CONSTRAINT PK_S1 PRIMARY KEY (sid)
);

CREATE TABLE "Boats" (
  "bid" INT NOT NULL,
  "bname" TEXT not null,
  "color" TEXT,
  CONSTRAINT PK_B PRIMARY KEY (bid)
);

CREATE TABLE "Reserves" (
  "sid" INT NOT NULL,
  "bid" INT NOT NULL,
  "day" TEXT NOT NULL,
  CONSTRAINT PK_R1 PRIMARY KEY (sid,bid,day),
  constraint FK1_R foreign key (sid) 
references Sailors (sid),
  constraint FK2_R foreign key (bid) 
references Boats (bid)
);
