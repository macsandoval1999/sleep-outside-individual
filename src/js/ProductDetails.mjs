/*
====================================
This module provides a ProductDetails class to manage and display product details.
The ProductDetails class allows fetching a specific product by its ID and rendering its details on the page.
It also provides functionality to add the product to a shopping cart stored in local storage.
The only exported entity from this module is the ProductDetails class, which contains the following:
- A constructor to initialize the product ID and data source.
- An init method to fetch product details and set up event listeners.
- An addProductToCart method to add the product to the cart.
- A renderProductDetails method to display product details on the page.
====================================
*/



import { countCartItems, getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs"; // Import utility functions for managing local storage and cart item count



export default class ProductDetails {
/*====================================
Product Details Template class
Description: 
This class provides a template for rendering product details on the page.
It updates the DOM elements with the product brand, name, image, price, color, and description.
Takes a product object as input and updates the corresponding DOM elements.
Constructor Parameters:
    - productId: The ID of the product to be rendered.
    - dataSource: The data source to fetch product details from.
Constructor Variables:
    - product (the product object to be rendered)
    - productId (the ID of the product to be rendered)
    - dataSource (the data source to fetch product details from)
Methods:
    - init(): Fetches product details and sets up event listeners.
    - addProductToCart(): Adds the product to the cart.
    - renderProductDetails(): Displays product details on the page.
====================================*/
    
    constructor(productId, dataSource) { // Initialize the ProductDetails class with a product ID and data source
        this.productId = productId; // The ID of the product to be rendered
        this.product = {}; // The product object to be rendered
        this.dataSource = dataSource; // The data source to fetch product details from
    }

    async init() {
    /*
    Description:
    This method initializes the ProductDetails class by fetching product details and setting up event listeners.
    Methods:
        - Fetches product details using the data source.
        - Renders the product details on the page.
        - Sets up an event listener for the "Add to Cart" button.
    USED IN: ProductDetails class to initialize the product details page.
    ==================================== */
        
        this.product = await this.dataSource.findProductById(this.productId); // Fetch product details using the data source
        this.renderProductDetails(); // Render the product details using the template function method
        const addToCartBtn = document.getElementById('addToCart'); // Add event listener to Add to Cart button
        if (addToCartBtn) { // if the add to cart button exists...
            addToCartBtn.addEventListener('click', this.addProductToCart.bind(this)); // Bind the addProductToCart method to the current instance. binding ensures 'this' refers to the class instance. This means when the event listener is triggered, 'this' inside addProductToCart refers to the ProductDetails instance.
        }
    }

    addProductToCart() {
    /*
    Description:
    This method adds the current product to the shopping cart stored in local storage.
    It checks if the product already exists in the cart and updates the quantity accordingly.
    If the product is not in the cart, it adds it with the specified quantity.
    Finally, it updates the local storage and refreshes the cart item count.
    Parameters:
        - None
    Returns:
        - None
    USED IN: ProductDetails class to handle adding products to the cart.
    ==================================== */
        
        const cartItems = getLocalStorage("so-cart") || []; // Retrieve existing cart items from local storage or initialize an empty array
        const quantityInput = document.getElementById("productQuantity"); // Get the quantity input element
        const quantity = Math.max(1, parseInt(quantityInput?.value, 10) || 1); // Get the quantity value, ensuring it's at least 1. Math.max(1, ...) prevents negative or zero quantities. parseInt(..., 10) converts a value to base-10 integer. In this case, it converts the input value taken from the element with id productQuantity to an integer. quantityInput?.value uses optional chaining (?.) to safely access the value property of quantityInput. If quantityInput is null or undefined, it won't throw an error; instead, it will return undefined, and the || 1 part will ensure that the default quantity is 1.
        const existingItem = cartItems.find((item) => item.Id === this.product.Id); // Check if the product already exists in the cart

        if (existingItem) { // If the product exists...
            existingItem.Quantity = (Number(existingItem.Quantity) || 1) + quantity; // Increment the quantity of the existing item
        } else { // If the product does not exist...
            cartItems.push({ ...this.product, Quantity: quantity }); // Add the new product to the cart with the specified quantity. This is also where we add the custom Quantity property to each cart item to track how many of that item are in the cart. ...this.product creates a shallow copy of the product object to avoid mutating the original product data. push(...) adds the new product object to the cartItems array. In summarym this line adds the current product to the cart with the specified quantity if it is not already present in the cart. If it is already present, it increments the quantity of the existing item. Check local storage "so-cart" to see the structure of the cart items.
        }

        setLocalStorage("so-cart", cartItems); // Update local storage with the new cart items array
        alertMessage("Product added to cart!"); // Show an alert message indicating the product was added to the cart
        countCartItems(); // Update the cart item count badge in the header
        document.querySelector(".cart").setAttribute("style", "animation: cart-animation 2s infinite"); // Add bounce animation to cart icon
        setTimeout(() => {
            document.querySelector(".cart").removeAttribute("style"); // Remove bounce animation after 1 second
        }, 2000);
    }

    renderProductDetails() {
    /*
    Description:
    This method renders the product details on the page using the productDetailsTemplate function.
    Parameters:
        - None
    Returns:
        - None
    USED IN: ProductDetails class to display product details on the page.
    ==================================== */
        
        productDetailsTemplate(this.product); // Render product details using the productDetailsTemplate function declared below
    }
}



function productDetailsTemplate(product) {
    /* Product Details Template function.
    =============================
    Description:
    Used in the ProductDetails class to render product details on the page.
    This function updates the DOM elements with the product details.
    Parameters:
        - product: The product object containing details to be rendered.
    Returns:
        - None
    USED IN: renderProductDetails method of ProductDetails class to display product details on the page.
    ============================= */

    // The following values are taken from the product object and inserted into the corresponding DOM elements. To check the structure of the product object, refer to the sample-product.json file in the data folder.
    document.querySelector('h2').textContent = product.Brand.Name; // Set brand name
    document.querySelector('h3').textContent = product.NameWithoutBrand; // Set product name
 
    const productImage = document.getElementById('productImage'); // Set product image
    productImage.src = product.Images.PrimaryExtraLarge; // Set the source of the product image to the primary extra large image URL
    productImage.alt = product.NameWithoutBrand; // Set the alt text of the product image to the product name without brand

    document.getElementById('productPrice').textContent = product.FinalPrice; // Set product price
    document.getElementById('productColor').textContent = product.Colors[0].ColorName; // Set product color
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple; // Set product description (using innerHTML to render HTML content)

    document.getElementById('addToCart').dataset.id = product.Id; // Set the data-id attribute of the add to cart button to the product ID
}
