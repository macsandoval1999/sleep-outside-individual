import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";    



// Load header and footer
loadHeaderFooter();



//Create an instance of CheckoutProcess with the order summary element and cart items
const checkoutProcess = new CheckoutProcess("#order-summary", getLocalStorage("cartItems") || []);
// Initialize the checkout process
checkoutProcess.init(); 



// Get the checkout form element
const formElement = document.getElementById("checkout-form"); 
formElement.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const myForm = document.forms[0];
    const chk_status = myForm.checkValidity();
    myForm.reportValidity();
    if (chk_status)
        await checkoutProcess.checkout();
});





