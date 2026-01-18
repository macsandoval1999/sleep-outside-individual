// Utility function to convert fetch response to JSON
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}



// ProductData class to fetch and manage product data
export default class ProductData {
  // Constructor to initialize category and JSON path. category object will have two properties: category name and path
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  // Method to fetch product data from JSON file
  getData() {
    return fetch(this.path).then(convertToJson).then((data) => data); // fetch product data, then convert to JSON, then return the data
  }
  // Method to find a product by its ID
  async findProductById(id) { // find a product by its ID
    const products = await this.getData(); // fetch all products 
    return products.find((item) => item.Id === id); // find and return the product with the matching ID
  }
}
