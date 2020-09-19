var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "elboban003",
  database: "employeeDb"
});

connection.connect(function(err) {
    if (err) throw err;
    startApp();
  });

function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View departments",
        "View roles",
        "Add department",
        "Add role",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "EXIT"
      ]
    })
.then(function(answer) {
    switch (answer.action) {
    case "View All Employees":
      viewEmployees();
      break;

    case "View All Employees By Department":
      viewEmployeesByDept();
      break;

    case "View departments":
      viewDept();
      break;
    
    case "View roles":
      viewRoles();
      break;

    case "Add Employee":
      addEmployee();
      break;
  
    case "Add department":
      addDept();
      break;
    
    case "Add role":
      addRole();
      break;

    case "Remove Employee":
      removeEmployee();
      break;
    
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    
    case "EXIT":
      process.exit();
    }
  });
}

function viewEmployees() {
    var query = `SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id 
    LEFT JOIN departments on role.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;
    connection.query(query, function(err, query){
        console.table(query);
        startApp();
    });
};

function viewEmployeesByDept() {
    var query =`SELECT departments.name AS department, employees.id, employees.first_name, employees.last_name, role.title FROM employees LEFT JOIN role on 
    employees.role_id = role.id LEFT JOIN departments departments on role.department_id = departments.id WHERE departments.id;`;
    connection.query(query, function(err, query){
      console.table(query);
      startApp();
});
};

function viewDept() {
  var query = `select id AS Dept_ID, name AS departments from departments;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};

function viewRoles() {
  var query = `select id AS Role_ID, title from role;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};

function addEmployee() {
  inquirer
    .prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter employee's first name:"
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter employee's last name:"
    },
    {
      name: "role_id",
      type: "number",
      message: "Enter employee's role_id number:"
    },
    {
      name: "manager_id",
      type: "number",
      message: "Enter employee's manager_id number:"
    },
    {
      name: "department_id",
      type: "number",
      message: "Enter employee's department_id number:"
    },

  ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
          department_id: answer.department_id
        },
        function(err) {
          if (err) throw err;
          console.log("Employee " + answer.firstName + "" + answer.lastName + " successfully added!");
          startApp();
        }
      );
    });
};

function addDept() {
  inquirer
    .prompt([
    {
      name: "dept",
      type: "input",
      message: "Enter new department's name:"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO departments SET ?",
      {
        name: answer.dept
      },
      function(err) {
        if (err) throw err;
        console.log("Department " + answer.dept + " successfully added!");
        startApp();
      }
    );
  });
};

function addRole() {
  inquirer
  .prompt([
  {
    name: "title",
    type: "input",
    message: "Enter new role's name:"
  },
  {
    name: "salary",
    type: "input",
    message: "Enter new role's salary:"
  },
  {
    name: "department_id",
    type: "input",
    message: "Enter new role's department id number:"
  },
])
.then(function(answer) {
  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: answer.department_id
    },
    function(err) {
      if (err) throw err;
      console.log("New role " + answer.title + " successfully added!");
      startApp();
    }
  );
});
};

function removeEmployee() {
  inquirer
    .prompt([
    {
      name: "delete",
      type: "input",
      message: "Enter employee's id you would like to removed:"
    }
  ])
  .then(function(answer) {
    connection.query(
      "DELETE FROM employees WHERE ?",
      {
        id: answer.delete
      },
      function(err) {
        if (err) throw err;
        console.log("Employee successfully removed!");
        startApp();
      }
    );
  });

};

function updateEmployeeRole() {

};

