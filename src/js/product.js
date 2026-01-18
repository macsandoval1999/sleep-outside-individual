import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Get the product id from the URL
const productId = getParam("product");

// Create an instance of ProductData for the correct category
const dataSource = new ProductData("tents");

// Create an instance of ProductDetails with the productId and dataSource
const product = new ProductDetails(productId, dataSource);
product.init();
