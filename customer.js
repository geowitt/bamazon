var mysql = require('mysql');
var prompt = require('prompt');

var con = mysql.createConnection({
    host: 'localhost',
    port: '8888',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

con.connect(function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log('Connection established');
});


con.query('SELECT itemID, productName, departmentName, price FROM Products',function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);

    prompt.start();

    console.log("To start shopping enter the item ID number and quantity of your desired product.");

    prompt.get(['itemID', 'quantity'], function (err, result) {

        var ID = result.itemID;
        var quantity = result.quantity;
        console.log(ID);
        console.log(quantity);

        if (quantity <= "'stockQuantity WHERE itemID =' + ID") {
            con.query('Update products Set stockQuantity =' + result.Quantity + ' Where itemID =' + result.ID);
        }
        else {
            console.log("Insufficient funds")
        }

    });


});



//Ask customer for item and quantity




