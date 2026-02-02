/* 
    This is the js file that handles the product details page
    It creates and initializes the product details based on the selected product and works for any product.
*/



import { getParam, loadHeaderFooter } from "./utils.mjs"; // Import utility functions for URL parameters and loading header/footer
import ExternalServices from "./ExternalServices.mjs"; // Import the ProductData class to fetch product details
import ProductDetails from "./ProductDetails.mjs"; // Import the ProductDetails class to manage and display product details



loadHeaderFooter(); // Load the header and footer of the page



const productId = getParam("product"); // Get the product id from the URL

const dataSource = new ExternalServices(); // Create an instance of ExternalServices to fetch product details

const product = new ProductDetails(productId, dataSource); // Create an instance of ProductDetails with the productId and dataSource

product.init(); // Initialize the product details page

