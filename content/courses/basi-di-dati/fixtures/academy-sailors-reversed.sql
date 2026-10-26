-- Fixture sintetica Database Academy, separata dal dataset ufficiale.
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (6,'Pia',NULL,50);
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (5,'Mai',10,17);
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (4,'Luca',5,40);
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (3,'Nora',10,NULL);
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (2,'Ada',8,30);
INSERT INTO "Sailors" (sid,sname,rating,age) VALUES (1,'Ada',8,18);
INSERT INTO "Boats" (bid,bname,color) VALUES (104,'D','blue');
INSERT INTO "Boats" (bid,bname,color) VALUES (103,'C','red');
INSERT INTO "Boats" (bid,bname,color) VALUES (102,'B','green');
INSERT INTO "Boats" (bid,bname,color) VALUES (101,'A','red');
INSERT INTO "Reserves" (sid,bid,day) VALUES (4,103,'2000-01-01');
INSERT INTO "Reserves" (sid,bid,day) VALUES (3,102,'2000-01-01');
INSERT INTO "Reserves" (sid,bid,day) VALUES (2,101,'2000-01-01');
INSERT INTO "Reserves" (sid,bid,day) VALUES (1,102,'2000-01-03');
INSERT INTO "Reserves" (sid,bid,day) VALUES (1,101,'2000-01-02');
INSERT INTO "Reserves" (sid,bid,day) VALUES (1,101,'2000-01-01');
