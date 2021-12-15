DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;


CREATE TABLE departments
(
	department_id int NOT NULL AUTO_INCREMENT,
	department varchar(30) NOT NULL,
	PRIMARY KEY (department_id)
);
CREATE TABLE roles
(
    role_id int NOT NULL AUTO_INCREMENT,
    title varchar(30) NOT NULL,
    salary DECIMAL(10,4),
    department_id INT,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees
(
	employee_id int NOT NULL AUTO_INCREMENT,
	first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id INT,
    department_id INT,
	PRIMARY KEY (employee_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);