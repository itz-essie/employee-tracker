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
    whatNow();
  });
}

const givenOptions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: [
          "View All Employees",
          "Edit Employee Info",
          "View Roles",
          "Edit Roles",
          "View Departments",
          "Add Departments",
          "Delete",
          "Finished",
        ],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Edit Employee Info":
          editEmployeeInfo();
          break;
        case "View Roles":
          viewAllRoles();
          break;
        case "Edit Roles":
          editRoles();
          break;
        case "View Departments":
          viewAllDepartments();
          break;
        case "Add Departments":
          addDepartments();
          break;
        case "Delete":
          Delete();
        case "Finished":
          finished();
      }
    });
};
const whatNow = () => {
  inquirer
    .prompt([
      {
        name: "whatNow",
        type: "confirm",
        message: "Anything else?",
      },
    ])
    .then((response) => {
      if (response.whatNow === "Yes") {
        return givenOptions();
      } else {
        return finished();
      }
    });
};

givenOptions();

function confirmString(string) {
  if (string.trim() != "" && string.trim().length <= 30) {
    return true;
  }
  return "Please limit your input to 30 characters or less.";
}

function editEmployeeInfo() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    return res;
  });
  inquirer
    .prompt({
      name: "editOption",
      type: "list",
      message: "What would you like to update?",
      choices: [
        "Change Employee Salary",
        "Change Employee Role",
        "Change Employee Manager",
        "Remove Employee",
        "Return to Menu",
      ],
    })
    .then((response) => {
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
    });
}

function editRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const roleInfo = res;
    const roleNames = roleInfo.map((roleItem) => {
      return roleItem.title;
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which role would you like to edit?",
          name: "newRole",
          choices: roleNames,
        },
      ])
      .then((answers) => {
        console.log(answers);
      });
    // either edit entire entry (title, salary) pull departments, and list those ids
  });
}

function addDepartments() {
  inquirer
    .prompt([
      {
        name: "departName",
        type: "input",
        message: "Enter new department:",
        validate: confirmString,
      },
    ])
    .then((answers) => {
      connection.query("INSERT INTO department (name) VALUES (?)", [
        answers.departName,
      ]);
      console.log(`${answers.departName} was added to departments.`);
      givenOptions();
    });
}




function deleteCatgeory(){

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

finished = () => {
  figlet("Goodbye!", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
    connection.end(); //close the connection
  });
};

// viewAllDepartments();
// viewAllRoles();
// viewAllEmployees();
