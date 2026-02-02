/* This file handles the checkout process logic and validation */

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSubTotal() {
        // calculate and display the total dollar amount of the items in the cart, and the number of items.
        this.itemTotal = this.list.reduce((total, item) => total + item.price * item.quantity, 0);
        const itemTotal = document.querySelector(`${this.outputSelector} #cartTotal`);
        itemTotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
        // Tax: 6% of subtotal
        this.tax = this.itemTotal * 0.06;

        // Shipping: $10 for first item, $2 for each additional item
        let totalItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            this.shipping = 10 + (totalItems - 1) * 2;
        } else {
            this.shipping = 0;
        }

        // Order total
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        // display the totals.
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;

        const shipping = document.querySelector(`${this.outputSelector} #shipping`);
        if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;

        const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);
        if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
}