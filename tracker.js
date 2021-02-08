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


const viewWhat = async () =>{
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



async function viewAllDepartments () {
  connection.query("select * from department", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}
async function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
}

async function viewAllEmployees() {
  connection.query("select * from employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
  });
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
      switch (response.addWhat) {
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
}
async function updateRole() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    const roleInfo = res;
    const roleNames = roleInfo.map((roleItem) => {
      return roleItem.title;
    });
    console.log({roleInfo, roleNames})
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
        
      })
      // ask question about what to update about role, and then make a new input.
    // either edit entire entry (title, salary) pull departments, and list those ids
  });
}

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

const addRole = async () => {
    inquirer.prompt([
      {
        name: "newRole",
        type: "input", 
        message: "What role would you like to add?",
        validate: confirmString,
      },
      {
        name: "newRoleSalary",
        type: "input",
        message: "What is the salary of this role?"
      }
      // ask what question this role belongs to...populate the list of departments
    ]) .then((answers) => {
      connection.query("INSERT INTO role SET ?",{
          title: answers.newRole,
          salary: answers.newRoleSalary
        }
      )
    });
    }



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