/* 
====================================
This module provides a ProductData class to fetch and manage product data from JSON files.
The ProductData class allows fetching all products or finding a specific product by its ID.
This module is designed to simplify the process of working with product data in a structured and consistent manner.
The only exported entity from this module is the ProductData class, which contains the following:
- A constructor to initialize the category and JSON path.
- A getData method to fetch all product data from the JSON file.
- A findProductById method to find a specific product by its ID.
====================================
*/



const baseURL = import.meta.env.VITE_SERVER_URL || ""; // Base URL for the server, taken from environment variable or default to empty string. This allows flexibility in different deployment environments. This is useful for switching between development and production servers without changing the code. 



async function convertToJson(res) {
// Utility function to convert fetch response to JSON
// =============================
// Description:
// This function checks if the fetch response is OK (status in the range 200-299).
// If the response is OK, it converts the response to JSON.
// If the response is not OK, it throws an error with the message "Bad Response".
// Takes a fetch response object as input and returns a promise that resolves to JSON data or rejects with an error.
// Returns a promise that resolves to JSON data or rejects with an error.
//Parameters:
//   - res: The fetch response object to be converted to JSON.
// Returns:
//   - A promise that resolves to JSON data or rejects with an error.
// USED IN: ProductData class methods to handle fetch responses when retrieving product data.
// =============================
  const data = await res.json();
  if (res.ok) { // If the response is OK (status in the range 200-299)...
    return data; // Convert the response to JSON
  } else { // Otherwise...
    throw {name: "servicesError", message: data }; // Throw a service error with the message "Bad Response"
  }
}




export default class ExternalServices {
/*=============================
Product Data class
Description:
This class provides methods to fetch all products or find a specific product by its ID.
Constructor Parameters:
    - None
Constructor Variables:
    - None
Methods:
    - getData(): Fetches all product data from the JSON file.
    - findProductById(id): Finds a specific product by its ID.
==============================*/
  
  constructor() { // Initialize the ProductData class
  }
  
  async getData(category) {
  // Method to fetch all product data from the JSON file
  // =============================
  // Description:
  // This method fetches all product data for the specified category from the server.
  // It constructs the URL using the baseURL and category, makes a fetch request, and converts the response to JSON.
  // Parameters:
  //   - category: The category of products to be fetched (e.g., "tents", "sleeping-bags").
  // Returns:
  //   - A promise that resolves to an array of product objects.
  // USED IN: ProductList and ProductDetails classes to retrieve product data for rendering.
  // =============================
  
    const response = await fetch(`${baseURL}products/search/${category}`); // Fetch product data for the specified category from the server
    const data = await convertToJson(response); // Convert the response to JSON
    return data.Result; // Return the array of product objects
  }

  async findProductById(id) { 
  // Method to find a specific product by its ID
  // =============================
  // Description:
  // This method fetches product data for a specific product ID from the server.
  // It constructs the URL using the baseURL and product ID, makes a fetch request, and converts the response to JSON.
  // Parameters:
  //   - id: The ID of the product to be found.
  // Returns:
  //   - A promise that resolves to the product object with the specified ID.
  // USED IN: ProductDetails class to retrieve details of a specific product for rendering.
    // =============================
    
    const response = await fetch(`${baseURL}product/${id}`); // Fetch product data for the specified product ID from the server
    const data = await convertToJson(response); // Convert the response to JSON
    return data.Result; // Return the product object with the specified ID
  }

  async checkout(submission) {
  /* Submit the order
  =============================
  Description:
  This method submits the order data to the server.
  Parameters:
      - submission: The order data to be submitted.
  Returns:
      - A promise that resolves to the server's response.
  USED IN: CheckoutProcess class to submit the order during checkout.
  =============================*/
    const options = {
      method: "POST", // HTTP method for the request
      headers: {
        "Content-Type": "application/json", // Specify that the request body is in JSON format
      },
      body: JSON.stringify(submission), // Convert the submission object to a JSON string for the request body
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson); // Send a POST request to the server with the order data
  }
}



/*async recap:
 The async keyword is used to declare an asynchronous function.
 An asynchronous function returns a promise.
 The await keyword is used to wait for a promise to resolve.
 In the findProductById method, await is used to wait for the getData method to fetch all products before finding the product by ID.
 async operations run without blocking the main thread, allowing other code to execute while waiting for the promise to resolve.
 This is particularly useful for fetching data from external sources, such as JSON files or APIs, without freezing the user interface.
 In summary, async/await provides a way to write asynchronous code that is easier to read and understand, while still being non-blocking.
 */