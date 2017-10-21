# Bamazon Marketplace

## Bamazon marketplace is a CLI application connected to a MySQL database with two key functions:
1. Allowing shoppers to view and purchase items
2. Allowing managers to view, add, and re-stock items

## Running bamazonCustomer.js file
#### For a shopper to enter the store they will need to run 'node bamazonCustomer.js'
##### Customer view and choices when entering the store
![Bamazom Store Front](/images/customer-storefront.PNG)

##### View of all items table including id, name, department, and price
###### Customer will select which item and how many they want.
###### CLI will tally the total cost for the customer and update the table to reduce the units from the store
![Bamazon all items](/images/customer-shopping.PNG)

###### If there are not enough items for the customer to purchase still in stock they will be prompted to continue shopping.
![Bamazon item low](/images/customer-units.PNG)


## Running bamazonManager.js file
### For a manager to enter the store the will need to run 'node bamazonManage.js'
#### Manager view and choices when entering the store
![Bamazon Manager Front](/images/manager-entry.PNG)


