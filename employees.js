var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
const connection = require("./connection");

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});