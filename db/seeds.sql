USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("HR"),("IT"),("Legal"), ("Social Services"), ("Administrative");

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 80000, 3), ("Social Worker", 60000, 4), ("Paralegal", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aisha", "Alleyne", 1, null), ("Esiena", "Ekwofia", 2, null), ("Jessica", "Rabbit", 3, 1);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;