import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    // Method to perform any setup required before using the class
    async init() {
        // Fetch product details using the data source
        this.product = await this.dataSource.findProductById(this.productId);
        // Render the product details
        this.renderProductDetails();
        // Add event listener to Add to Cart button
        
        const addToCartBtn = document.getElementById('addToCart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', this.addProductToCart.bind(this));
        }
    }

    // Method to add the current product to the cart
    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    // Method to render product details to the page
    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}



function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;

    document.getElementById('productPrice').textContent = product.FinalPrice;
    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    document.getElementById('addToCart').dataset.id = product.Id;
}