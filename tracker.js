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

const givenOptions = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "userChoice",
        choices: ["Add", "View", "Update", "Delete", "Finished"],
      },
    ])
    .then((response) => {
      switch (response.userChoice) {
        case "Add":
          addWhat();
          break;
        case "View":
          viewWhat();
          break;
        case "Update":
          updateWhat();
          break;
        case "Delete":
          deleteWhat();
          break;
        case "Finished":
          finished();
      }
    });
};
givenOptions();

const whatNow = async () => {
  inquirer
    .prompt([
      {
        name: "whatNow",
        type: "list",
        message: "Anything else?",
        choices: ["Yes", "No"],
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

const viewWhat = async () => {
  inquirer
    .prompt([
      {
        name: "viewoptions",
        type: "list",
        message: "What would you like to view?",
        choices: [
          "View all Employees",
          "View all Departments",
          "View all Roles",
        ],
      },
    ])
    .then((response) => {
      switch (response.viewoptions) {
        case "View all Employees":
          viewAllEmployees();
          break;
        case "View all Departments":
          viewAllDepartments();
          break;
        case "View all Roles":
          viewAllRoles();
      }
    });
};

async function viewAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}
async function viewAllRoles() {
  connection.query(
    "SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      whatNow();
    }
  );
}

async function viewAllEmployees() {
  connection.query(
    `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employee, role.title, department.name AS department,
  salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role on e.role_id=role.id INNER JOIN department on role.department_id=department.id LEFT JOIN employee m ON m.id = e.manager_id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      whatNow();
    }
  );
}

// Add things
const addWhat = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What category would you like to add to?",
        name: "addWhat",
        choices: [
          "Add an Employee",
          "Add a Department",
          "Add a New Role",
          "Main Menu",
        ],
      },
    ])
    .then((response) => {
      switch (response.addWhat) {
        case "Add an Employee":
          addEmployee();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a New Role":
          addRole();
          break;
        case "Main Menu":
          givenOptions();
      }
    });
};

// Delete things
const deleteWhat = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What category would you like to delete from?",
        name: "deleteWhat",
        choices: [
          "Delete an Employee",
          "Delete a Department",
          "Delete a Role",
          "Main Menu",
        ],
      },
    ])
    .then((response) => {
      switch (response.deleteWhat) {
        case "Delete an Employee":
          deleteEmployee();
          break;
        case "Delete a Department":
          deleteDepartment();
          break;
        case "Delete a Role":
          deleteRole();
          break;
        case "Main Menu":
          givenOptions();
      }
    });
};

//Delete Things
const deleteEmployee = async () => {
  connection.query(`SELECT * FROM employee`, function (err, res) {
    if (err) throw err;
    const employeeList = res;
    const employeesnames = employeeList.map((obj) => {
      return obj.role_id + " " + obj.first_name + " " + obj.last_name;
    });
    // console.log(employeesnames)
    inquirer
      .prompt([
        {
          name: "deleteEmployee",
          type: "list",
          message: "Which employee would you like to delete?",
          choices: employeesnames,
        },
      ])
      .then((response) => {
        connection.query(
          (`DELETE FROM employee where ?`,
          { first_name, last_name: response.deleteEmployee })
        );
        console.table(viewAllEmployees);
        whatNow();
      });
  });
};
const deleteDepartment = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    const departmentlist = res;
    // console.table(res)
    const returndepart = departmentlist.map((item) => {
      return item.name;
    });
    inquirer
      .prompt([
        {
          name: "deleteADepart",
          type: "list",
          choices: returndepart,
          message: "Which department would you like to delete?",
        },
      ])
      .then((response) => {
        connection.query("DELETE FROM department WHERE (name) = ?", [
          response.deleteADepart,
        ]);
        console.log(`${response.deleteADepart} was deleted from departments.`);
        whatNow();
      });
  });
};

const deleteRole = () => {
  connection.query(
    "SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id",
    function (err, res) {
      if (err) throw err;
      const allRoles = res;
      const roleNames = allRoles.map((obj) => {
        return obj.title;
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which role would you like to delete?",
            name: "deleteRole",
            choices: roleNames,
          },
        ])
        .then((answers) => {
          connection.query("DELETE FROM role WHERE (title) = ?", [
            answers.deleteRole,
          ]);
          console.log(`${answers.deleteRole} was deleted from roles.`);
          console.log("---------------------------");
          whatNow();
        });
    }
  );
};

//Update Things
const updateWhat = async () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What category would you like to update?",
        name: "updateWhat",
        choices: [
          "Update an Employee",
          "Update a Department",
          "Update a Role",
          "Main Menu",
        ],
      },
    ])
    .then((response) => {
      switch (response.updateWhat) {
        case "Update an Employee":
          updateEmployee();
          break;
        case "Update a Department":
          updateDepartment();
          break;
        case "Update a Role":
          updateRole();
          break;
        case "Main Menu":
          givenOptions();
      }
    });
};
// async function updateRole() {
//   connection.query("SELECT * FROM role", function (err, res) {
//     if (err) throw err;
//     const roleInfo = res;
//     const roleNames = roleInfo.map((roleItem) => {
//       return roleItem.title;
//     });
//     connection.query("SELECT * FROM employee", function (err, res) {
//       if (err) throw err;
//       const employeeInfo = res;
//       const employeeNames = employeeInfo.map((roleItem) => {
//         return roleItem.first_name;
//       });

//       inquirer
//         .prompt([
//           {
//             type: "list",
//             message: "Which employee's role would you like to update?",
//             name: "selectEmployee",
//             choices: employeeNames,
//           },
//           {
//             type: "list",
//             message: "Which role would you like to edit?",
//             name: "newRole",
//             choices: roleNames,
//           },
//         ])
//         .then((answers) => {
//           connection.query(
//             `UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ? ) WHERE id = (SELECT id FROM(SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`,
//             [answers.newRole, answers.selectEmployee],
//             (err, res) => {
//               if (err) throw err;
//               console.log(res);
//               whatNow();

//               // console.log(answers);
//             }
//           );
//         });

// ask question about what to update about role, and then make a new input.
// either edit entire entry (title, salary) pull departments, and list those ids
//     });
//   });
// }

function AllEmployees() {
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT * FROM employee`, function (err, res) {
      if (err) reject(err);
      var Employees = res.map((employee) => {
        //  console.log(employee)
        return employee.first_name;
      });
      resolve(Employees);
    });
  });
}

updateEmployee = async () => {
  connection.query("SELECT * from role", async function (err, res) {
    if (err) throw err;
    var roleResult = res; //all role results in the list defined
    var roleOfNames = roleResult.map((updateRole) => {
      //mapping out to get the information you ACTUALLY want.
      return updateRole.title;
    });
    var employees = await AllEmployees();
    inquirer
      .prompt([
        {
          name: "updateEmployee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employees,
        },
        {
          name: "newRole",
          type: "list",
          message: "What is the new role for this person?",
          choices: roleOfNames,
        },
      ])
      .then((response) => {
        //Pick the employee you would like to update, pick the new role they have THEN updating employee information.
        connection.query(
          `SELECT * FROM role WHERE title = '${response.newRole}'`,
          function (err, role) {
            connection.query(
              `SELECT * FROM employee WHERE first_name = '${response.updateEmployee}'`,
              function (err, user) {
                connection.query(
                  `UPDATE employee SET role_id = ? WHERE id = ?`,
                  [role[0].id, user[0].id],
                  function (err, res) {
                    console.log(`Updated User: ${response.updateEmployee}`);
                    viewAllEmployees();
                  }
                );
              }
            );
          }
        );
      });
  });
};

function confirmString(string) {
  if (string.trim() != "" && string.trim().length <= 30) {
    return true;
  }
  return "Please limit your input to 30 characters or less.";
}

async function addDepartment() {
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
      whatNow();
    });
}

const addRole = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.log(" ");
    console.table("List of current Departments:", res);
    const departmentInfo = res;
    const departmentList = departmentInfo.map((obj) => {
      return obj.name;
    });
    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "What role would you like to add?",
          validate: confirmString,
        },
        {
          name: "newRoleSalary",
          type: "input",
          message: "What is the salary of this role?",
        },
        {
          name: "department",
          type: "list",
          choices: departmentList,
          message: "Select the Department for this new Title:",
        },
        // ask what question this role belongs to...populate the list of departments
      ])
      .then((answer) => {
        connection.query(
          `INSERT INTO role(title, salary, department_id) VALUES ("${answer.newRole}", "${answer.newRoleSalary}", (SELECT id FROM department WHERE name = "${answer.department}"))`
        );
        console.log(
          `${answer.newRole} was successfully added to your list of Roles!`
        );
        whatNow();
      });
  });
};

addEmployee = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const roleInfo = res;
    const roleNames = roleInfo.map((roleItem) => {
      return roleItem.title;
    });
    connection.query(
      "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;",
      function (err, res) {
        if (err) throw err;
        const managernames = res;
        const managerChoices = managernames.map((obj) => {
          return (obj.first_name + " " + obj.last_name);
        });
        console.table(res);
        inquirer
          .prompt([
            {
              name: "employAddFirst",
              type: "input",
              message: "What is the first name of this employee?",
            },
            {
              name: "employAddLast",
              type: "input",
              message: "What is the last name of this employee?",
            },
            {
              name: "employAdd",
              type: "list",
              message: "What is the employee's role?",
              choices: roleNames, //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql.
            },
            // {
            //   name: "employAddManagerId",
            //   type: "list",
            //   message: "Who is the employee's manager?",
            //   choices: managerChoices, //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql
            // },
          ])
          .then((response) => {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: response.employAddFirst,
                last_name: response.employAddLast,
                manager_id: response.employAddManagerId,
              },
              function (err) {
                if (err) throw err;
                console.log("Your employee was created successfully!");
                whatNow();
              }
            );
          });
      }
    );
  });
};

finished = async () => {
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
