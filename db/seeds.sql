INSERT INTO departments (department) 
VALUES("Finance"),
("Accounting"),
("Engineering"),
("Corporate");

INSERT INTO roles (title,salary,department_id) 
VALUES ("Junior Engineer",55000,3),
("Accountant",52000,2),
("Manager",63000,4),
("Analyst",52000,1);

INSERT INTO employees (first_name,last_name,role_id,department_id) 
VALUES ("Michelle","Nijjar", 1, 3),
("John","Smith",2,2),
("Nick","Hudson",3,4),
("Andrew","Johnson",4,1);