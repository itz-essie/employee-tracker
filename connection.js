var mysql = require("mysql");

require('dotenv').config();

// console.log(process.env.SECRETPASSWORD);


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.SECRETPASSWORD,
  database: "employee_trackerDB"
});

module.exports = connection;