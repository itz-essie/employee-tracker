//Dependencies

var inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("./connection");
var figlet = require("figlet");

// figlet("Welcome to CMS", function (err, data) {
//   if (err) {
//     console.log("Something went wrong...");
//     console.dir(err);
//     return;
//   }
//   console.log(data);
// });

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  connection.end();
});

// function to view all departments
function viewAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    // console.table(res);
  });
}

//function to view all roles
function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    // console.table(res);
  });
}
// function to view all employees
function viewAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    // console.table(res);
  });
}

viewAllDepartments();
viewAllRoles();
viewAllEmployees();

const givenOptions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: ["View All Employees", "Edit Employeee Info", "View Roles", "Edit Roles", "View Departments", "Edit Departments"]
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "View All Employees":
          return viewAllEmployees();
        case "Edit Employeee Info":
          return editEmployeeInfo();
        case "View Roles":
          return viewAllRoles();
        case "Edit Roles":
          return editRoles();
        case "View Departments":
          return viewAllDepartments();
        case "Edit Departments":
          return editDepartments();
      }
    });
};



givenOptions();

// /Build a command-line application that at a minimum allows the user to:


// * Add departments, roles, employees


// * View departments, roles, employees

                                               

// * Update employee roles


// Bonus points if you're able to:

// * Update employee managers

// * View employees by manager

// * Delete departments, roles, and employees   

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
