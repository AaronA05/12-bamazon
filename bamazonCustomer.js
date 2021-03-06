var mysql = require("mysql");

var inq = require("inquirer");

var Table = require("cli-table");

//create credentials for connection to mySQL database
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "-----",
	database: "bamazon"
});

//connect to mySQL database, run function to start CLI
connection.connect(function(err){
	if(err) throw err;
	goShopping();
});


//function to start CLI 
function goShopping(){
	//first round of questions for customer to decide on action, Look will display all items in table, Leave will end connection
	inq.prompt([
		{
			type: "list",
			name: "choice",
			message: "================ \n Welcome to the Bamazon Marketplace!\n==============\n What would you like to do?",
			choices: ["Look at all items", "Leave the store"]
		}


	]).then(function(data){
		//logs what the user selected in inquirer in variable to use later for if statements
		var userChoice = data.choice;

		if(userChoice === "Look at all items"){
			//connect to mySQL database and get all items returned in data object
			connection.query("SELECT * FROM products", function(err, data){
				if(err) throw err;
				//using the npm cli-table to create a user friendly CLI Table
				//this is called in the connection query each time to clear the table, not a global array
				var table = new Table({
					//column headers
					head: ["ID", "Name", "Dept", "Price"],
					//width of each column
					colWidths: [5, 20, 20, 10]
				});

				//loop through the array returned with the data and push to CLI table
				for(var i = 0; i < data.length; i++){
					table.push(
						[data[i].item_id, data[i].prod_name, data[i].dept_name, data[i].price]
					);
				}
				//CLI table function to make table look good from array
				console.log(table.toString());
				//start prompt for what exactly the customer wants to order
				inq.prompt([
					{
						type: "prompt",
						name: "select",
						message: "What is the ID of the item you would like to purchase?"
					},
					{
						type: "prompt",
						name: "count",
						message: "How many units would you like to purchase?"
					}
					]).then(function(prompt){
						//id of the item customer selected
						var item = prompt.select;
						//number of units customer wants to purchase
						var unit = prompt.count;

						//create connection and find all product information for the item the customer selected
						connection.query("SELECT * FROM products WHERE item_id = ?", [item], function(err, data){
							//created a variable to hold the item information to utilize with other calls later
							var customerItem = data[0];
							//assesses if customer has requested TOO many units, if so, error message shows and customer will continue shopping
							if(customerItem.quantity < parseFloat(unit)){
								console.log("Sorry, looks we only have " + customerItem.quantity + " left. Pick another item or lower your order. \n");
								goShopping();

							}else{
								//if customer order can be fulfilled show the cost of their order
								var customerPrice = parseFloat(unit) * customerItem.price;
								console.log("Your " + unit + " units of " + customerItem.prod_name + " will cost " + customerPrice + " dollars \n");

								//ensure customer wants to purchase their order
								inq.prompt([
									{
										type: "confirm",
										name: "purchase",
										message: "Continue with purchase?"
									}

								]).then(function(confirm){
									//if customer wants to purchase update the quantity of their chosen item in the database table
									if(confirm.purchase){
										var newQuantity = customerItem.quantity - parseFloat(unit);
										connection.query("UPDATE products SET quantity = ? WHERE item_id = ?", [newQuantity, item]);
										goShopping();
									}else{
										//if customer does not want to purchase, encourage them to keep shopping
										console.log("Sorry to hear that. Please continue shopping!\n");
										goShopping();
									}
									
								});
								
							}
	
						});
	
					})
	
			})
		}

		//allows to customer to disconnect from mySQL
		if(userChoice === "Leave the store"){
			console.log("Thanks for visiting the store!");
			connection.end();
		}

	});
}