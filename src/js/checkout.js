import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";    


const checkoutProcess = new CheckoutProcess( // Create an instance of CheckoutProcess
  "#order-summary",
  getLocalStorage("cartItems") || []
);

checkoutProcess.init(); // Initialize the checkout process

const formElement = document.getElementById("checkout-form"); // Get the checkout form element

formElement.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  await checkoutProcess.checkout(); // Call the checkout method to submit the order
});



loadHeaderFooter();

