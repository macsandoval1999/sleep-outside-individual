/* This is the JavaScript file that manages the shopping cart page. It handles displaying cart items, updating quantities, removing items, and calculating the total price.
 */

import {
  countCartItems,
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs"; // Import utility functions for managing local storage, cart item count, and loading header/footer

loadHeaderFooter(); // Load the header and footer of the page

function combineDuplicateItems(items) {
  /* Function to normalize cart items by combining quantities of identical items
Description:
This function takes an array of cart items and combines items with the same ID by summing their quantities.
It returns a new array with unique items, each having the total quantity.
Parameters:
    - items: An array of cart item objects, each containing at least an Id and Quantity property.
Returns:
    - An array of cart item objects with unique Ids and combined Quantities.
USED IN: Used in the cart management to ensure that the cart displays unique items with correct quantities.
==================================== */

  const byId = new Map(); // Create an empty Map to store items by their ID
  items.forEach((item) => {
    // Iterate over each item in the input array and do the following:
    const quantity = Number(item.Quantity) || 1; // Get the quantity of the current item, defaulting to 1 if not specified or invalid. We use Number(...) to convert the Quantity to a number. If Quantity is undefined, null, or cannot be converted to a number, it defaults to 1 using the || operator. Quantity is a custom property we added to each cart item to track how many of that item are in the cart. It was added when items were added to the cart in the ProductDetails.mjs file.
    const existing = byId.get(item.Id); // Check if an item with the same ID already exists in the Map
    if (existing) {
      // If it exists...
      existing.Quantity += quantity; // Increment the quantity of the existing item
    } else {
      // If it does not exist...
      byId.set(item.Id, { ...item, Quantity: quantity }); // Add the new item to the Map with its quantity
    }
  });
  return Array.from(byId.values()); // Convert the Map values back to an array and return it
}

function renderCartContents() {
  /* Function to render the contents of the shopping cart
Description:
This function retrieves the cart items from local storage, combines duplicate items, and generates the HTML to display each item in the cart.
It updates the cart display area in the DOM with the generated HTML.
Parameters:
    - None
Returns:
    - None
USED IN: Used to update the cart display whenever there are changes to the cart contents.
==================================== */

  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []); // Retrieve cart items from local storage and combine duplicate items
  setLocalStorage("so-cart", cartItems); // Update local storage with the normalized cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item)); // Generate HTML for each cart item using the cartItemTemplate function
  document.querySelector(".product-list").innerHTML = htmlItems.join(""); // Update the cart display area in the DOM with the generated HTML
  checkoutButton(); // Update the state of the checkout button based on the cart total
}

function cartItemTemplate(item) {
  /* Cart Item Template function
=====================================
Description:
This function generates the HTML template for a cart item.
It takes a cart item object as input and returns an HTML string representing the cart item.
Parameters:
   - item: The cart item object containing details such as ID, name, image, price, and quantity.
Returns:
    - An HTML string representing the cart item.
USED IN: renderCartContents function to render each item in the shopping cart.
====================================*/

  // Determine the image source, falling back to default if necessary
  const imageSrc =
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    item.Image ||
    "/images/camping-products.jpg";
  // Generate the HTML template for the cart item
  const newItem = `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${imageSrc}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : ""}</p>
    <p class="cart-card__quantity">qty:
      <input
        class="cart-card__quantity-input"
        type="number"
        min="1"
        value="${item.Quantity || 1}"
        data-id="${item.Id}"
      />
    </p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <span class="cart-card__remove" data-id="${item.Id}">❌</span>
  </li>
`;
  return newItem; // Return the generated HTML template
}

function getCartTotal() {
  /* Function to calculate and display the total price of items in the cart
Description:
This function retrieves the cart items from local storage, combines duplicate items, and calculates the total price based on item prices and quantities.
It updates the total price display in the cart footer.
Parameters:
    - None
Returns:
    - The total price of items in the cart.
USED IN: Used to update the total price display whenever there are changes to the cart contents.
==================================== */

  const cartFooter = document.querySelector(".cart-footer"); // Get the cart footer element
  const cartTotal = document.querySelector(".cart-total"); // Get the cart total display element
  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []); // Retrieve cart items from local storage and combine duplicate items
  const finalTotal = cartItems.reduce(
    (total, item) => total + item.FinalPrice * (Number(item.Quantity) || 1),
    0, // Calculate the total price by summing the product of item price and quantity for each item
  );
  cartTotal.textContent = `Total: $${finalTotal.toFixed(2)}`; // Update the cart total display with the calculated total price, formatted to two decimal places
  if (finalTotal === 0) {
    // If the cart is empty, hide the cart footer
    cartFooter.classList.add("hide");
  } else {
    // If the cart has items, show the cart footer
    cartFooter.classList.remove("hide");
  }
  return finalTotal; // Return the calculated total price
}

function removeFromCart(itemId) {
  /* Remove an item from the cart by its ID
=====================================
Description:
This function removes an item from the shopping cart based on its ID.
It updates the cart in local storage, re-renders the cart contents, updates the total price, and updates the cart item count.
Parameters:
    - itemId: The ID of the item to be removed from the cart.
Returns:
    - None
USED IN: Used to handle the removal of items from the cart when the user clicks the remove button.
==================================== */

  const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []); // Retrieve cart items from local storage and combine duplicate items
  const updatedCart = cartItems.filter((item) => item.Id !== itemId); // Filter out the item with the specified ID
  setLocalStorage("so-cart", updatedCart); // Update local storage with the updated cart items
  renderCartContents(); // Re-render the cart contents to reflect the removal
  getCartTotal(); // Update the total price display
  countCartItems(); // Update the cart item count badge in the header
}

function checkoutButton() {
  /* Function to enable or disable the checkout button based on cart total
=====================================
Description:
This function checks the total price of items in the cart and enables or disables the checkout button accordingly.
If the cart total is greater than zero, the checkout button is no longer hidden and is enabled; otherwise, it is disabled.
Parameters:
    - None  
Returns:
    - None
USED IN: Used to manage the state of the checkout button based on cart contents.
==================================== */
  const checkoutBtn = document.getElementById("checkout-btn"); // Get the checkout button element
  const total = getCartTotal(); // Get the current total price of items in the cart
  if (total > 0) {
    // If the cart total is greater than zero...
    checkoutBtn.classList.remove("hide"); // Show the checkout button
  } else {
    // If the cart total is zero...
    checkoutBtn.classList.add("hide"); // Hide the checkout button
  }
}

document.addEventListener("click", (event) => {
  /* Event listener for handling remove item clicks in the cart
=====================================
Description:
This event listener listens for click events on the document.
If the clicked element has the class "cart-card__remove", it retrieves the item ID from the data attribute and calls the removeFromCart function to remove the item from the cart.
Parameters:
    - event: The click event object.
Returns:
    - None
USED IN: Used to handle user interactions for removing items from the cart.
==================================== */

  if (event.target.classList.contains("cart-card__remove")) {
    // If the clicked element has the class "cart-card__remove"...
    const itemId = event.target.dataset.id; // Get the item ID from the data-id attribute
    removeFromCart(itemId); // Call the removeFromCart function to remove the item from the cart
  }
});

document.addEventListener("change", (event) => {
  /* Event listener for handling quantity input changes in the cart
=====================================
Description:
This event listener listens for change events on the document.
If the changed element has the class "cart-card__quantity-input", it retrieves the item ID and new quantity from the input,
updates the quantity of the corresponding item in the cart, and updates the cart display and totals accordingly.
Parameters:
    - event: The change event object.
Returns:
    - None
USED IN: Used to handle user interactions for changing item quantities in the cart.
==================================== */

  if (event.target.classList.contains("cart-card__quantity-input")) {
    // If the changed element has the class "cart-card__quantity-input"...
    const itemId = event.target.dataset.id; // Get the item ID from the data-id attribute
    const quantity = Math.max(1, parseInt(event.target.value, 10) || 1); // Get the new quantity, ensuring it's at least 1
    const cartItems = combineDuplicateItems(getLocalStorage("so-cart") || []); // Retrieve cart items from local storage and combine duplicate items
    const item = cartItems.find((cartItem) => cartItem.Id === itemId); // Find the item with the specified ID
    if (item) {
      // If the item exists...
      item.Quantity = quantity; // Update the item's quantity
      setLocalStorage("so-cart", cartItems); // Update local storage with the updated cart items
      renderCartContents(); // Re-render the cart contents to reflect the quantity change
      getCartTotal(); // Update the total price display
      countCartItems(); // Update the cart item count badge in the header
    }
  }
});

renderCartContents(); // Render the initial cart contents

getCartTotal(); // Update the initial total price
