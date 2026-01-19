import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors && item.Colors[0] ? item.Colors[0].ColorName : ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}



function getCartTotal() {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");
  const cartItems = getLocalStorage("so-cart") || [];
  const total = cartItems.reduce((total, item) => total + item.FinalPrice, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove("hide");
  return total;
}



renderCartContents();
getCartTotal();