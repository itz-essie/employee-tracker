USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("HR"),("IT"),("Legal"), ("Social Services"), ("Administrative");

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 80000, 3), ("Social Worker", 60000, 4), ("Office Manager", 72000, 5),
("Paralegal", 50000, 5), ("Computer Technician", 62000, 2), ("Attorney in Charge", 250000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Aisha", "Alleyne", 1, 6), ("Kayla", "Graham", 2, 6), ("Jessica", "Rabbit", 3, null), 
("Marcus", "Greenspan", 4, 6), ("Justin", "Givens", 1, 6), ("Tasha", "St. Patrick", 5, null);
