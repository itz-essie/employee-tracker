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
});

// function to view all departments
function viewAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

//function to view all roles
function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}
// function to view all employees
function viewAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

// viewAllDepartments();
// viewAllRoles();
// viewAllEmployees();

const givenOptions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: ["View All Employees", "Edit Employee Info", "View Roles", "Edit Roles", "View Departments", "Edit Departments"]
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

function editEmployeeInfo() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const allEmployees = res;
    console.table(res)
    })
  inquirer.prompt({
      name: "editOption",
      type: "list",
      message: "What would you like to update?",
      choices: [
          "Change Employee Salary",
          "Change Employee Role",
          "Change Employee Manager",
          "Remove Employee",
          "Return to Menu"
      ]
  }).then(response => {
      switch (response.editOption) {
          case "Change Employee Salary":
              changeSalary();
              break;
          case "Change Employee Role":
              updateEmployeeRole();
              break;
          case "Change Employee Manager":
              updateManager();
              break;
          case "Remove Employee":
              removeEmployee();
              break;
          case "Return to Menu":
              givenOptions();
              break;
      }
  })
};

function editRoles(){
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const roleInfo = res;
    const roleNames = roleInfo.map((roleItem) => {
      return roleItem.title;
    })
    inquirer.prompt([
      {
        type:"list",
        message: "Which role would you like to edit?",
        name: "newRole",
        choices: roleNames
      }
    ]).then((answers) => {
      console.table(answers);
    })
    // either edit entire entry (title, salary, id) pull departments, and list those ids
  });
}
// /Build a command-line application that at a minimum allows the user to:


// * Add departments, roles, employees


// * View departments, roles, employees

                                               

// * Update employee roles


// Bonus points if you're able to:

// * Update employee managers

// * View employees by manager

// * Delete departments, roles, and employees   

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
