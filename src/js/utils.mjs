/*
=========================================
 Utility functions for DOM manipulation and localStorage operations
These functions are designed to simplify common tasks such as selecting elements, managing localStorage, and handling events.
Other modules can import and use these functions as needed. 
=========================================
*/



export function qs(selector, parent = document) {
// wrapper for querySelector...returns matching element
// =============================
// This function uses querySelector to find the first element that matches the given selector within the specified parent element.
// If no parent is specified, it defaults to the document.
// Typically used to quickly select a single element from the DOM.
// Takes a CSS selector string and an optional parent element to search within.
// Returns the first matching element, or null if no match is found.
// USED IN: constructor of ProductDetails class to select elements for rendering product details.
// ============================

  return parent.querySelector(selector);
}




export function getLocalStorage(key) {
// retrieve data from localstorage
// =============================
// Takes a key as a parameter and retrieves the corresponding value from localStorage.
// The value is parsed from JSON before being returned.
// Returns the parsed value, or null if the key does not exist.
// USED IN: addProductToCart in cart.js to get cart items, normalizeCartItems in cart.js to update cart items after normalization.
  // ============================
  
  return JSON.parse(localStorage.getItem(key));
}




export function setLocalStorage(key, data) {
/*=============================
Description:
Save data to local storage
Takes a key and a data object as parameters and saves the data to localStorage.
The data is stringified to JSON before being stored. This means that complex data structures like objects and arrays can be stored as strings. When retrieving the data, it should be parsed back into its original form. We have a corresponding getLocalStorage function for this purpose.
Parameters:
  - key: The key under which the data will be stored in localStorage.
  - data: The data object to be stored in localStorage.
Returns:
  - None
// USED IN: addProductToCart in cart.js to save cart items, normalizeCartItems in cart.js to update cart items after normalization.
=============================*/
  
  localStorage.setItem(key, JSON.stringify(data));
}




export function setClick(selector, callback) {
/*=============================
Description:
Set a listener for both touchend and click
This function sets up event listeners for both touchend and click events on a specified element.
It ensures that the callback is triggered for both types of interactions, providing a consistent experience across touch and non-touch devices.
Takes a CSS selector string and a callback function to be executed when the element is interacted with.

Parameters:
  - selector: A CSS selector string identifying the element to attach the event listeners to.
  - callback: A function to be executed when the element is interacted with.
Returns:
  - None.
// USED IN: N/A
=============================*/
  
  qs(selector).addEventListener("touchend", (event) => { // Using the qs utility function, we select the element and add a touchend event listener. A touchend event is triggered when a touch point is removed from the touch surface. This means the user has finished touching the element.
    event.preventDefault(); // When a touchend event occurs, we prevent the default behavior to avoid triggering a click event immediately after by using the built-in preventDefault method which stops the default action associated with the event.
    callback(); // After preventing the default behavior, we execute the callback function provided by the user.
  });
  qs(selector).addEventListener("click", callback); // We also add a click event listener to ensure the callback is triggered on non-touch devices.
}



export function getParam(param) {
// get the product id from the query string
// =============================
// This function retrieves the value of a specified query parameter from the URL's query string.
// The reason why this works is because we have product pages with query parameters in the URL.
// For example, a URL like "product.html?id=123" would allow us to retrieve the value "123" for the "id" parameter. If the URL does not contain the specified parameter, the function will return null.
// Takes the name of the query parameter as a string.
// Returns the value of the query parameter, or null if the parameter does not exist.
// USED IN: constructor of ProductDetails class to get the product ID from the URL.
// ============================

  const queryString = window.location.search; // Get the query string from the current URL
  const urlParams = new URLSearchParams(queryString); // Create a URLSearchParams object from the query string
  const product = urlParams.get(param); // Get the value of the specified query parameter
  return product; // Return the value of the query parameter, or null if it does not exist
}




export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
/*==================================
Description: Renders a list of items using a provided template function
Parameters:
- templateFn: A function that takes an item and returns an HTML string.
- parentElement: The DOM element where the list will be rendered.
- list: An array of items to render.
- position: Optional. Specifies where to insert the HTML (default is "afterbegin" which means the beginning of the parent element).
- clear: Optional. Specifies whether to clear the parent element before rendering (default is false).
Returns/Purpose: 
- void
- Inserts the generated HTML into the parent element at the specified position.
USED IN: renderList method of ProductList class to render the product list.
==================================*/

  const htmlStrings = list.map(templateFn); // Generate HTML strings for each item in the list using the provided template function
  if (clear) { // If the clear flag is true, clear the parent element's content before rendering
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join("")); // Insert the generated HTML into the parent element at the specified position
};



export function countCartItems() {
// Update the cart item count badge in the header
// =============================
// This function calculates the total quantity of items in the cart and updates the cart count badge in the header accordingly.
// It retrieves the cart items from local storage, sums their quantities, and updates the DOM elements that display the cart count.
// If there are no items in the cart, it hides the cart count badge.
// USED IN: loadHeaderFooter in utils.mjs to update the cart item count badge, renderCartContents in cart.js to refresh the cart item count after changes.
  // ============================
  
  const cartCountBadge = document.querySelector(".cart-count-badge"); // Select the cart count badge element from the DOM
  const cartCount = document.querySelector(".cart-count"); // Select the cart count element from the DOM
  const cartItems = getLocalStorage("so-cart") || []; // Retrieve the cart items from local storage, or initialize an empty array if none exist
  if (!cartCountBadge || !cartCount) { // If either the cart count badge or cart count element is not found, exit the function
    return; // Exit the function early if elements are not found
  }
  const totalQty = cartItems.reduce( // Calculate the total quantity of items in the cart
    (total, item) => total + (Number(item.Quantity) || 1), // Sum the quantities of each item, defaulting to 1 if Quantity is not defined
    0, // Initial value for the total quantity
  );
  if (totalQty === 0) { // If the total quantity is zero, hide the cart count badge
    cartCountBadge.classList.add("hide");
  } else { // If there are items in the cart, update the cart count and show the badge
    cartCount.textContent = totalQty;
    cartCountBadge.classList.remove("hide");
  }
}



export function renderWithTemplate(template, parentElement, data, callback) {
/*==================================
Description: Renders HTML content using a template string and inserts it into a parent element
Parameters:
- template: A string containing HTML markup.
- parentElement: The DOM element where the HTML will be inserted.
- data: An optional data object to be passed to the callback function.
- callback: An optional function to be executed after rendering.
Returns/Purpose: 
- void
- Replaces the content of the parent element with the generated HTML.
- Executes the callback function with the provided data, if specified.
// USED IN: loadHeaderFooter in utils.mjs to render the header and footer templates into the main document.
==================================*/
  
  parentElement.innerHTML = template; // Set the innerHTML of the parent element to the provided template string
  if (callback) { // If a callback function is provided, execute it with the data object
    callback(data);
  }
};



async function loadTemplate(url) {
  /* 
  Description: Loads an HTML template from a specified URL
  Parameters:
    - url: A string representing the URL of the HTML template to be loaded.
  Returns/Purpose:
    - A promise that resolves to the loaded HTML template as a string.
    - Fetches the HTML content from the specified URL and returns it as a string for further processing or rendering.
  USED IN: loadHeaderFooter in utils.mjs to fetch header and footer templates.
  ============================= */

  const result = await fetch(url); // Fetch the HTML template from the specified URL
  const template = await result.text(); // Read the response as text to get the HTML content
  return template; // Return the loaded HTML template as a string
}



export async function loadHeaderFooter() {
  /* 
  =============================
  Description: Loads and renders header and footer templates into the main document
  Parameters:
    - None
  Returns/Purpose:
    - void
    - Fetches the header and footer HTML templates from specified URLs.
    - Renders the fetched templates into the designated header and footer elements in the main document.
    - Updates the cart item count badge in the header to reflect the current state of the cart.
  USED IN: Function is actually called outside of functions in product.js, checkout.js, main.js, product-listing.js and cart.js to load the header and footer on those pages.
  ============================= */

  const headerTemplate = await loadTemplate(new URL("../public/partials/header.html", import.meta.url)); // Load the header template from the specified URL
  const footerTemplate = await loadTemplate(new URL("../public/partials/footer.html", import.meta.url)); // Load the footer template from the specified URL
  const headerElement = document.getElementById("main-header"); // Select the header element in the main document
  const footerElement = document.getElementById("main-footer"); // Select the footer element in the main document

  renderWithTemplate(headerTemplate, headerElement,); // Render the header template into the header element
  renderWithTemplate(footerTemplate, footerElement,); // Render the footer template into the footer element
  countCartItems(); // Update the cart item count badge in the header
}



export function alertMessage(message, scroll = true, duration = 3000) {
/* Display an alert message at the top of the main content area
 =============================
Description:
Display an alert message at the top of the main content area
Parameters:
  - message: The message to be displayed in the alert.
  - scroll: Optional. A boolean indicating whether to scroll to the top of the window (default is true).
  - duration: Optional. The duration in milliseconds for which the alert should be displayed (default is 3000ms).
Returns/Purpose:
  - void
  - Creates an alert element with the specified message and prepends it to the main content area.
  - If the scroll parameter is true, scrolls the window to the top to ensure the alert is visible.
  - The alert can be dismissed by clicking on the "X" span within it.
USED IN: CheckoutProcess class to display success or error messages during the checkout process.
=============================*/
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="close-alert">X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
}



export function removeAllAlerts() {
/* Remove all alert messages from the main content area
 =============================
Description:
Remove all alert messages from the main content area
Parameters:
  - None
Returns/Purpose:
  - void
  - Selects all elements with the class "alert" within the main content area and removes them from the DOM.
USED IN: CheckoutProcess class to clear existing alerts before displaying new ones during the checkout process.
=============================*/
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}