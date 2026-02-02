import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";



const services = new ExternalServices();



function formDataToJSON(formElement) {
    // Convert form data to a JSON object
    // Description:
    // This function takes a form element as input, extracts its data using the FormData API,
    // and converts it into a JSON object where each form field name is a key and its value is the corresponding value.
    // Parameters:
    //   - formElement: The HTML form element containing the input fields.
    // Returns:
    //   - A JSON object representing the form data.
    // USED IN: CheckoutProcess class to prepare order data for submission during checkout.
    // =============================
    const formData = new FormData(formElement); // Create a FormData object from the provided form element
    const convertedJSON = {}; // Initialize an empty object to hold the converted JSON data
    formData.forEach((value, key) => { // Iterate over each key-value pair in the FormData object...
        convertedJSON[key] = value; // ...and add it to the convertedJSON object
    });
    return convertedJSON; // Return the resulting JSON object
}



function packageItems(items) {
    /* Package items for order submission
    =====================================
    Description:
    This function takes an array of item objects and transforms them into a simplified format suitable for order submission.
    Parameters:
        - items: An array of item objects, each containing detailed product information.
    Returns:
        - An array of simplified item objects, each containing only the id, price, name, and quantity.
    USED IN: CheckoutProcess class to prepare the list of items for the order during checkout.
    =====================================*/
    const simplifiedItems =
        items.map((item) => { // Map each item to a simplified object...
            return { // ...containing only these properties
                id: item.Id,
                price: item.FinalPrice,
                name: item.Name,
                quantity: 1,
            };
        });
    return simplifiedItems; // Return the array of simplified item objects
}



export default class CheckoutProcess {
    /*=============================
    Checkout Process class
    Description:
    This class manages the checkout process, including calculating totals and submitting the order.
    Constructor Parameters:
        - key: The local storage key where the cart items are stored.
        - outputSelector: The CSS selector for the output area where totals will be displayed.
    Constructor Variables:
        - list: The list of items in the cart.
        - itemTotal: The total amount of the items in the cart.
        - shipping: The calculated shipping cost.
        - tax: The calculated tax amount.
        - orderTotal: The final order total including items, shipping, and tax.
    Methods:
        - init(): Initializes the checkout process by loading cart items and calculating the item summary.
        - calculateItemSummary(): Calculates and displays the total amount of items in the cart.
        - calculateOrderTotal(): Calculates shipping, tax, and the final order total.
        - displayOrderTotals(): Displays the calculated totals in the output area.
        - checkout(): Gathers form data and submits the order to the server.
    ==============================*/



    constructor(key, outputSelector) {
        /* Constructor to initialize the CheckoutProcess class
        =============================
        Parameters:
            - key: The local storage key where the cart items are stored.
            - outputSelector: The CSS selector for the output area where totals will be displayed.
        =============================
        */
        this.key = key; // Local storage key for cart items
        this.outputSelector = outputSelector; // CSS selector for output area
        this.list = []; // List of items in the cart
        this.itemTotal = 0; // Total amount of items in the cart
        this.shipping = 0; // Calculated shipping cost
        this.tax = 0; // Calculated tax amount
        this.orderTotal = 0; // Final order total including items, shipping, and tax
    }



    init() {
        // Always use the same key as the cart page
        this.list = getLocalStorage("so-cart") || [];
        this.calculateItemSummary();
        this.calculateOrderTotal();
    }



    calculateItemSummary() {
        // Calculate total quantity and subtotal
        const summaryElement = document.querySelector(this.outputSelector + " #cartTotal");
        const itemNumElement = document.querySelector(this.outputSelector + " #num-items");
        if (!this.list || this.list.length === 0) {
            summaryElement.innerText = "$0.00";
            itemNumElement.innerText = "0";
            this.itemTotal = 0;
            this.totalQuantity = 0;
            return;
        }
        // Sum all quantities and subtotal
        let totalQuantity = 0;
        let subtotal = 0;
        this.list.forEach(item => {
            const qty = Number(item.Quantity) || 1;
            totalQuantity += qty;
            subtotal += (Number(item.FinalPrice) || 0) * qty;
        });
        this.itemTotal = subtotal;
        this.totalQuantity = totalQuantity;
        itemNumElement.innerText = totalQuantity;
        summaryElement.innerText = `$${subtotal.toFixed(2)}`;
    }



    calculateOrderTotal() {
        // Calculate tax as 6% of the subtotal
        this.tax = this.itemTotal * 0.06;
        // Shipping: $10 for first item, $2 for each additional item
        if (this.totalQuantity > 0) {
            this.shipping = 10 + (this.totalQuantity - 1) * 2;
        } else {
            this.shipping = 0;
        }
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }



    displayOrderTotals() {
        /* Display the order totals
        =============================
        Description:
        This method updates the HTML elements to display the calculated tax, shipping,
        and order total amounts.
        =============================
        */
        // Get the HTML elements for displaying tax, shipping, and order total
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);
        // Update the elements with the calculated amounts, formatted to two decimal places
        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }



    async checkout() {
        /* Submit the order
        =============================
        Description:
        This method gathers the form data from the checkout form, prepares the order object,
        and submits it to the server using the ExternalServices class.
        =============================
        */
        const formElement = document.forms["checkout-form"]; // Get the checkout form element
        const order = formDataToJSON(formElement); // Convert the form data to a JSON object

        order.orderDate = new Date().toISOString(); // Add the current date as the order date
        order.orderTotal = this.orderTotal; // Add the order total amount
        order.tax = this.tax; // Add the tax amount
        order.shipping = this.shipping; // Add the shipping amount
        order.items = packageItems(this.list); // Package the items for the order

        try { // Attempt to submit the order to the server
            const response = await services.checkout(order); // Submit the order using the ExternalServices class
            console.log("Order submitted successfully:", response); // Log the successful submission response
        } catch (err) { // Log any errors that occur during submission
            console.log(err); // Log any errors that occur during submission
        }
    }
}