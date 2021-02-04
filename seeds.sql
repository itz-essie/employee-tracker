USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("HR"),("IT"),("Legal"), ("Social Services");

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 80000, 1234);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aisha", "Alleyne", 345, 027), ("Esiena", "Ekwofia", 612, 012);