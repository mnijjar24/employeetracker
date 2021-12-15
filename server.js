const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeetracker_db",
});
let roles;
let department;
let employee;
let employeeId;
connection.connect(function (err) {
  if (err) {
    console.error("error" + err.stack);
    return;
  }
  console.log("connected as" + connection.threadId);
});

function init() {
  roles = [];
  department = [];
  employee = [];
  employeeId = [];
  connection.query("SELECT department FROM departments", function (err, res) {
    for (i = 0; i < res.length; i++) {
      department.push(res[i].department);
    }
    connection.query("SELECT title FROM roles", function (err, res) {
      for (i = 0; i < res.length; i++) {
        roles.push(res[i].title);
      }
      connection.query(
        "SELECT employee_id, first_name, last_name FROM employees",
        function (err, res) {
          for (i = 0; i < res.length; i++) {
            employeeId.push(res[i].employee_id);
            employee.push(res[i].first_name + " " + res[i].last_name);
          }
          inquirer
            .prompt({
              name: "start",
              type: "list",
              message: "Please select one of the following options",
              choices: [
                "View all Employees",
                "View all Departments",
                "View all Roles",
                "Add an Employee",
                "Add a Role",
                "Add a Department",
                "Update an Employee Role",
                "Exit",
              ],
            })
            .then(function (answers) {
              switch (answers.start) {
                case "View all Employees":
                  connection.query(
                    "SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department, roles.title, roles.salary FROM employees INNER JOIN departments ON employees.department_id=departments.department_id INNER JOIN roles ON employees.role_id=roles.role_id",
                    function (err, data) {
                      if (err) throw err;
                      console.table(data);
                      init();
                    }
                  );
                  break;
                case "View all Departments":
                  deptRole("department", "departments", "Department", "Departments");
                  break;
                case "View all Roles":
                  deptRole("title", "roles", "Role", "Title");
                  break;
                case "Add an Employee":
                  addAnItem("employees");
                  break;
                case "Add a Role":
                  addAnItem("roles");
                  break;
                case "Add a Department":
                  addAnItem("departments");
                  break;
                case "Update an Employee Role":
                  remove("roles");
                  break;

                case "Exit":
                  process.exit(1);
                  break;
              }
            })
            // .catch((err) => {
            //   if (err) throw err;
            // });
        }
      );
    });
  });
}
init();

function deptRole(col, table, deptOrRole) {
  connection.query("SELECT ?? FROM ??", [col, table], function (err, data) {
    // if (err) throw err;
    choicesArr = [];
    if (col === "department") {
      for (i = 0; i < data.length; i++) {
        choicesArr.push(data[i].department);
      }
    } else {
      for (i = 0; i < data.length; i++) {
        choicesArr.push(data[i].title);
      }
    }
    inquirer
      .prompt({
        name: "selectionPrompt",
        message: "Which " + deptOrRole + " would you like to view?",
        type: "list",
        choices: choicesArr,
      })
      .then((answers) => {
        connection.query(
          "SELECT employees.employee_id, employees.first_name, employees.last_name, departments.department, roles.title, roles.salary FROM employees INNER JOIN departments ON employees.department_id=departments.department_id INNER JOIN roles ON employees.role_id=roles.role_id WHERE ??.?? = ?",
          [table, col, answers.selectionPrompt],
          function (err, data) {
            if (err) throw err;
            console.table(data);
            init();
          }
        );
      });
  });
}

function addAnItem(selection) {
  switch (selection) {
    case "employees":
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Please enter the Employee's First Name",
          },
          {
            type: "input",
            name: "last_name",
            message: "Please enter the Employee's Last Name",
          },
          {
            type: "list",
            name: "title",
            message: "Please enter the Employee's Title",
            choices: roles,
          },
          {
            type: "list",
            name: "department",
            message: "Please enter the Employee's Department",
            choices: department,
          },
        ])
        .then(function (answers) {

          connection.query(
            "SELECT role_id FROM roles WHERE title='" + answers.title + "'",
            function (err, data) {
              if (err) throw err;
              countRole = parseInt(data[0].role_id);

              connection.query(
                "SELECT department_id FROM departments WHERE department='" +
                  answers.department +
                  "'",
                function (err, data) {
                  if (err) throw err;

                  countDept = parseInt(data[0].department_id);
 
                  connection.query(
                    "INSERT INTO employees(first_name, last_name, role_id, department_id) VALUES (?,?,?,?)",
                    [
                      answers.first_name,
                      answers.last_name,
                      countRole,
                      countDept,
                    ],
                    function (err, data) {
                      if (err) throw err;
                      console.log("Employee has been added!");
                      init();
                    }
                  );
                }
              );
            }
          );
        });
      break;
    case "roles":
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Please enter the name of the role",
          },
          {
            type: "number",
            name: "salary",
            message: "Please enter the salary of this role",
          },
          {
            type: "list",
            name: "department",
            message: "Please enter the department of this role",
            choices: department,
          },
        ])
        .then(function (answers) {
          let countDept;
          connection.query(
            "SELECT department_id FROM departments WHERE department='" +
              answers.department +
              "'",
            function (err, data) {
              if (err) throw err;
              countDept = parseInt(data[0].department_id);
              connection.query(
                "INSERT INTO roles(title, salary, department_id) VALUES (?,?,?)",
                [answers.title, answers.salary, countDept],
                function (err, data) {
                  if (err) throw err;
                  console.log("Role has been added!");
                  init();
                }
              );
            }
          );
        });
      break;
    case "departments":
      inquirer
        .prompt([
          {
            type: "input",
            name: "department",
            message: "Please enter the name of the department",
          },
        ])
        .then(function (answers) {
          connection.query(
            "INSERT INTO departments (department) VALUES (?)",
            [answers.department],
            function (err, res) {
              if (err) throw err;
              console.log("Department has been added!");
              init();
            }
          );
        });
      break;
  }
}

function remove(selection) {
  switch (selection) {
    case "employees":
      inquirer
        .prompt([
          {
            type: "list",
            name: "title",
            message: "Please enter the role that you would like to update/remove",
            choices: roles,
          },
        ])
        .then(function (answers) {
          connection.query(
            "DELETE FROM roles WHERE title=?",
            [answers.title],
            (err, res) => {
              if (err) throw err;
              console.log("Role has been updated!");
              init()
            }
          );
        });
      break;
  }
}