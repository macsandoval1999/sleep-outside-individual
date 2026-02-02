/* This js file handles the product listing used for the product listing page 
It creates and initializes the product listing based on the selected category and works for any category */

import ExternalServices from "./ExternalServices.mjs"; // Import the ProductData class
import ProductList from "./ProductList.mjs"; // Import the ProductList class
import { loadHeaderFooter, getParam } from "./utils.mjs"; // Import utility functions

loadHeaderFooter(); // Load header and footer

const category = getParam("category"); // Create an instance of ProductList for the specified category

const dataSource = new ExternalServices(); // Create an instance of ExternalServices to fetch product details

const element = document.querySelector(".product-list"); // Get the HTML element where the product list will be rendered

const listing = new ProductList(category, dataSource, element); // Create an instance of ProductList to render the product list

listing.init(); // Initialize and render the product list with its method init
