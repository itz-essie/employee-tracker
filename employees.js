//Dependencies

var inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("./connection");

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
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
    .prompt ([
      {
        type: "list",
        message: "What would you like to do?",
        name: "doSomething",
      },

    ])
}