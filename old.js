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
    whatNow();
  });
}

//function to view all roles
function viewAllRoles() {
  connection.query("select * from role", function (err, res) {
    if (err) throw err;
    console.table(res);
    whatNow();
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
          deleteCategory();
          break;
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
        type: "list",
        message: "Anything else?",
        choices: ["Yes", "No"]
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
        "Add New Employee",
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
          choices: roleNames(),
        },
      ])
      .then((answers) => {
        console.log(answers);
        
      })
      const roleNames = () =>{
        console.table("It works!")
      };
    // either edit entire entry (title, salary) pull departments, and list those ids
  }
  );
  
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


function deleteCategory(){
  inquirer.prompt([
   {
    name: "deleting", 
    type: "list", 
    message: "What would you like to delete?", 
    choices: ["An employee", "A department", "A role"]
   }
  ]).then((response) =>{
    switch (response.deleting) {
    case "An employee":
      deleteEmployee();
    break;
    case "A department":
      deleteDepartment();
    break;
    case "A role":
      deleteRole();
  }
  })

}

function deleteEmployee(){
  
}

function deleteDepartment() {
  let departments = connection.query('SELECT * FROM department', function (err, res) {
    if (err) throw err;
    const depInfo = res;
    const depNames = depInfo.map((obj) => {
      return obj.title;
    });
  inquirer.prompt([
      {
          name: "depName",
          type: "list",
          message: "Remove which department?",
          choices: depNames,
      }
  ]).then(response => {
      if (response.depName != "Cancel") {
          let dumpDepartment = departInfo.find(obj => obj.name === response.depName);
          connection.query("DELETE FROM department WHERE id=?", dumpDepartment.id);
          console.log(`${response.depName} was removed.`);
      }
      whatNow();
  })
}
  )}



  // function postAuction() {
  //   // prompt for info about the item being put up for auction
  //   inquirer
  //     .prompt([
  //       
  //         name: "item",
  //         type: "input",
  //         message: "What is the item you would like to submit?"
  //       },
  //       {
  //         name: "category",
  //         type: "input",
  //         message: "What category would you like to place your auction in?"
  //       },
  //       {
  //         name: "startingBid",
  //         type: "input",
  //         message: "What would you like your starting bid to be?",
  //         validate: function(value) {
  //           if (isNaN(value) === false) {
  //             return true;
  //           }
  //           return false;
  //         }
  //       }
  //     ])
  //     .then(function(answer) {
  //       // when finished prompting, insert a new item into the db with that info
  //       connection.query(
  //         "INSERT INTO auctions SET ?",
  //         {
  //           item_name: answer.item,
  //           category: answer.category,
  //           starting_bid: answer.startingBid || 0,
  //           highest_bid: answer.startingBid || 0
  //         },
  //         function(err) {
  //           if (err) throw err;
  //           console.log("Your auction was created successfully!");
  //           // re-prompt the user for if they want to bid or post
  //           start();
  //         }
  //       );
  //     });
  // }
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
