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

const givenOptions = () => {
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

const whatNow = () => {
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


const viewWhat = () =>{
  inquirer.prompt([
    {
      name:"viewoptions",
      type: "list",
      message: "What would you like to view?",
      choices: ["View all Employees", "View all Departments", "View all Roles"],
    }
  ])
  .then((response) => {
    switch (response.viewoptions){
      case "View all Employees":
      viewAllEmployees();
      break;
      case "View all Departments":
        viewAllDepartments();
        break;
      case "View all Roles":
        viewAllRoles();
    }
  })
}



function viewAllDepartments() {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}
function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}

function viewAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}

const addWhat = () => {
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

const addEmployee = () => {
  connection.query("SELECT * FROM role", function (err, res){
    if (err) throw err;
    const roleInfo = res;
    const roletitles = roleInfo.map((roleItem) => {
      return roleItem.title;
    });
    connection.query("SELECT manager_id FROM employee", function (err, res) {
      if (err) throw err;
      const mangernames = res;
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter employee's first name",
            name: "firstname",
        },
        {
            type: "input",
            message: "Please enter employee's last name",
            name: "lastname",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "employeeRole",
            choices: roletitles, 
        },
        {
            type:"list",
            message: "Who is the employee's manager?",
            name: "managerName",
            // populate from databse
            choices: mangernames,
        },
    ])    .then(function(answer) {
        // when finished prompting, insert a new employee into the db with that info
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstname,
            last_name: answer.lastname,
            role_id: answer.employeeRole,
            manager_id: answer.managerName
          },
          function(err) {
            if (err) throw err;
            console.log("Employee was successfully added");
            // re-prompt the user for if they want to bid or post
            whatNow();
          }
        );
   });
  })
  })
}

  function addDepartment() {
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

const addRole = (roleInfo) => {
    const departId = getDepartId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
    let userinput = [title, salary, departId];
  connection.query(query, userinput);
    console.log(`Added role ${title}`); 
}
