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
    console.log('Welcome to the Bamazon Manager Interface');
    console.log('------------------------------------------------\n');

    //Builds startup menu for management interface
    var appStart = function() {
        inquirer.prompt([{
            name: "Menu",
            type: "rawlist",
            message: "What would you would like to do?",
            choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
        }]).then(function(answer) {

            //Switch for different options

            switch(answer.Menu) {
                case 'View Products for Sale':
                    productsForSale();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
            //End of switch

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
                console.log("Ending session with Bamazon Manager Interface!");
                connection.end();
            }
        });
    };

    //Lists the products for sale
    function productsForSale() {
        connection.query('SELECT * FROM Products', function(err, res) {
            console.log('---------------------------------');
            console.log('Bamazon Merchandise List');
            console.log('---------------------------------\n');

            // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
            for (var i=0; i < res.length; i++) {
                var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
                table.push(productArray);
            }
            console.log(table.toString());
            appStart();
        });
    }
    //List the Products and then filters based on inventory < 5
    function lowInventory() {
        connection.query('SELECT * FROM Products', function(err, res) {
            console.log('---------------------------------');
            console.log('Bamazon Merchandise - Low Inventory');
            console.log('---------------------------------\n');

            // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
            for (var i=0; i < res.length; i++) {
                if (res[i].StockQuantity < 5) {
                    var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
                    table.push(productArray);
                }
            }
            console.log(table.toString());
            appStart();
        });
    }

    //Function to add inventory to database
    function addInventory() {
        connection.query('SELECT * FROM Products', function(err, res) {
            // New Table instance to format returned sql data
            var table = new Table({
                head: ['ItemID', 'ProductName', 'Price', 'Quantity'],
                colWidths: [10, 40, 10, 10]
            });
            for (var i=0; i < res.length; i++) {
                var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
                table.push(productArray);
            }
            console.log('\n\n\n');
            console.log(table.toString());
            console.log('\n');
        });
        inquirer.prompt([{
            name:'ItemID',
            type:'input',
            message: '\n\nEnter the ID of the Product you want to increase the inventory of'
        }, {
            name: 'qty',
            type:'input',
            message: 'Enter the quantity you want to add to inventory'
        }]).then(function(answer) {
            var addAmount = (parseInt(answer.qty));

            //Queries the database to retrieve the current StockQuantity to perform the addition
            connection.query("SELECT * FROM Products WHERE ?", [{ItemID: answer.ItemID}], function(err, res) {
                if(err) {
                    throw err;
                } else {
                    var updateQty = (parseInt(res[0].StockQuantity) + addAmount);
                }

                //Updates the database with new quantity
                connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [updateQty, answer.ItemID], function(err, results) {
                    if(err) {
                        throw err;
                    } else {
                        console.log('New Inventory Added!\n');
                        appContinue();
                    }
                });

            });



        });
    }

    //Add a new product to the database
    function newProduct() {
        inquirer.prompt([{
            name: "product",
            type: "input",
            message: "Type the name of the Product you want to add to Bamazon"
        }, {
            name: "department",
            type: "input",
            message: "Type the Department name of the Product you want to add to Bamazon"
        }, {
            name: "price",
            type: "input",
            message: "Enter the price of the product without currency symbols"
        }, {
            name: "quantity",
            type: "input",
            message: "Enter the amount you want to add to the inventory"
        }]).then(function(answers) {
            var ProductName = answers.product;
            var DepartmentName = answers.department;
            var Price = answers.price;
            var StockQuantity = answers.quantity;
            connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?)', [ProductName, DepartmentName, Price, StockQuantity], function(err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('\n\nProduct: ' + ProductName + ' added successfully!\n\n');
                    appContinue();
                }
            });
        });
    }








