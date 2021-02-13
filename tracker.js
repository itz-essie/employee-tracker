//Dependencies

var inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("./connection");
var figlet = require("figlet");


// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;

  viewAllEmployees();
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


const whatNow = async () => {
  inquirer
    .prompt([
      {
        name: "whatNow",
        type: "list",
        message: "Would you like to continue?",
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
          "Delete a Department",
          "Delete a Role",
          "Main Menu",
        ],
      },
    ])
    .then((response) => {
      switch (response.deleteWhat) {
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
        console.log("---------------------------")
        console.log(`${response.deleteADepart} was deleted from departments.`);
        console.log("---------------------------")
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
          console.log("---------------------------")
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
          "Main Menu",
        ],
      },
    ])
    .then((response) => {
      switch (response.updateWhat) {
        case "Update an Employee":
          updateEmployee();
          break;
        case "Main Menu":
          givenOptions();
      }
    });
};

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
                    console.log("---------------------------")
                    console.log(`Updated User: ${response.updateEmployee}`);
                    console.log("---------------------------")
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

    const roleId = roleInfo.map((obj) => {
      const roleTitles = obj.title
       const roleObj = {
         [roleTitles]:obj.department_id
       }
       console.log(roleObj)
       return  roleObj
     })


  
    connection.query(
      "SELECT first_name, last_name, role_id FROM employee WHERE manager_id IS NULL;",
      function (err, res) {
        if (err) throw err;
        const managernames = res;
        const managerChoices = managernames.map((obj) => {
          return (obj.first_name + " " + obj.last_name);
          
        });
        const managerId = managernames.map((obj) => {
         const managername = obj.first_name + " " + obj.last_name;
          const managerobj = {
            [managername]:obj.role_id
          }
          console.log(managerobj)
          return  managerobj
        })
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
            {
              name: "employAddManagerId",
              type: "list",
              message: "Who is the employee's manager?",
              choices: managerChoices, //NEED TO DO SOMETHING WITH ID AND MANAGER ID with sql
            },
          ])
          .then((response) => {
            const rolenameandId = roleId[response.employAdd]
            const managerid = managerId[response.employAddManagerId]
            connection.query(
              `INSERT INTO employee(first_name, last_name, role_id) VALUES ("${response.employAddFirst}", "${response.employAddLast}", (SELECT id FROM role WHERE title = "${response.employAdd}")`
            );
                console.log(`INSERT INTO employee(first_name, last_name, role_id) VALUES ("${response.employAddFirst}", "${response.employAddLast}", (SELECT id FROM role WHERE title = "${response.employAdd}"`);
                whatNow();
          });
          })
      }
    );
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
