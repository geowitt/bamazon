    //NPM Dependencies for program to function
    var mysql =     require('mysql');
    var inquirer =  require('inquirer');
    var Table =     require('cli-table');
    var active =    require('mysql-active-record');

    //creates a connection to bamazon database
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

    //builds startup menu for executive interface
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
                    departmentName();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            } // end of switch

        }); // end of inquirer prompt function
    }