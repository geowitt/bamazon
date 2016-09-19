    //NPM Dependencies for program to function
    var mysql =     require('mysql');
    var inquirer =  require('inquirer');
    var Table =     require('cli-table');
    var active =    require('mysql-active-record');

    //Creates a connection to bamazon database
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'bamazon'
    });

    //Provides status of SQL connection
    connection.connect(function(err) {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        appStart();
    });

    console.log('------------------------------------------------');
    console.log('Welcome to the Bamazon Executive Interface');
    console.log

    //Builds startup menu for executive interface
    var appStart = function() {
        inquirer.prompt([{
            name: "Menu",
            type: "rawlist",
            message: "What would you would like to do?",
            choices:['View merchandise sales by department', 'Create a new department','Exit']
        }]).then(function(answer) {

            //Switch for different options
            switch(answer.Menu) {
                case 'View merchandise sales by department':
                    totalSales();
                    break;
                case 'Create new department':
                    newDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }//End of switch

        });//End of inquirer prompt function
    }

    //Function to prompt user if they want to continue or end connection
    function appContinue() {
        inquirer.prompt({
            name: "continue",
            type: "confirm",
            message: "Would you like to go back to the main menu?",
        }).then(function(answer) {
            if (answer.continue == true) {
                appStart();
            } else {
                console.log("Ending session with Bamazon Executive Interface!");
                connection.end();
            }
        });
    };

    //Add a new department to the database
    function newDepartment() {
        inquirer.prompt([{
            name: "department",
            type: "input",
            message: "Type the name of the Department you want to add to Bamazon"
        },]).then(function (answers) {
            var DepartmentName = answers.departmentName;
            connection.query('INSERT INTO Departments (DepartmentName) VALUES (?)', [DepartmentName], function (err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('\nDepartment: ' + DepartmentName + ' added successfully!\n');
                    appContinue();
                }
            });
        });
    }
