/* This is the main JavaScript file that initializes the website by loading the header and footer. Currently, it only handles the header and footer loading as there isnt much else needed for the main page */



import { loadHeaderFooter, alertMessage } from "./utils.mjs";

loadHeaderFooter();

// Show order success alert if redirected from checkout
const orderSuccessMessage = sessionStorage.getItem("orderSuccess");
if (orderSuccessMessage) {
	alertMessage(orderSuccessMessage);
	sessionStorage.removeItem("orderSuccess");
}
