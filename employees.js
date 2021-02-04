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
        choices: ["Add", "View", "Update", "Delete"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Add":
          return addWhat();
        case "View":
          return viewWhat();
        case "Update":
          return updateWhat();
        case "Delete":
          return deleteWhat();
      }
    });
};

const addWhat = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please choose what you would like to add.",
        name: "toAdd",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return addDepartment();
        case "Role":
          return addRole();
        case "Employee":
          return addEmployee();
      }
    });
};

const viewWhat = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to view?",
        name: "toView",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return viewDepartment();
        case "Role":
          return viewRole();
        case "Employee":
          return viewEmployee();
      }
    });
};

const updateWhat = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What category would you like to make an update to?",
        name: "toUpdate",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return updateDepartment();
        case "Role":
          return updateRole();
        case "Employee":
          return updateEmployee();
      }
    });
};

const deleteWhat = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What category would you like to delete an item from?",
        name: "toDelete",
        choices: ["Department", "Role", "Employee"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Department":
          return deleteDepartment();
        case "Role":
          return deleteRole();
        case "Employee":
          return deleteEmployee();
      }
    });
};

givenOptions();
