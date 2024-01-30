/*******************************************************************************
 * Filename:    cart.js
 * Purpose:     Shopping cart example using regular JavaScript. 
 *              Generates the shopping cart with data from from localstorage.
 *******************************************************************************/

let label = document.getElementById("label");

let shoppingCart = document.getElementById("shopping-cart");

// Retrieve selected shopping cart items from localstorage as localBasketData
let basket = JSON.parse(localStorage.getItem("localBasketData")) || [];

// Retrieve item shop database from localstorage as localShopItemsData 
const shopItemsData = JSON.parse(localStorage.getItem('localShopItemsData'));

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

// Generate the shopping cart with images, title, price, buttons, and total price
let generateCartItems = () => {
    if (basket.length !== 0) {
        return shoppingCart.innerHTML = basket
            .map((x) => {
                let { sku, item } = x;
                let search = shopItemsData.find((y) => String(y.sku) === String(sku)) || [];
                let { image, albumTitle, regularPrice } = search;
                return `
                    <div class="cart-item">
                        <img width="100" src=${image} alt="">
                        <div class="details">

                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${albumTitle}</p>
                                    <p class="cart-item-price">$ ${(regularPrice).toFixed(0)}</p>
                                </h4>
                                <i onclick="removeItem('${sku}')" class="bi bi-x-lg"></i>
                            </div>

                            <div class="buttons">
                                <i onclick="decrement('${sku}')" class="bi bi-dash-lg"></i>
                                <div id=${sku} class="quantity">${item}</div>
                                <i onclick="increment('${sku}')" class="bi bi-plus-lg"></i>
                            </div>

                            <h3>$ ${(item * regularPrice).toFixed(0)}</h3>
                        </div>
                    </div>
                `;
            }).join("");
    } else {
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
            <h2>Cart is Empty</h2>
            <a href="index.html">
                <button class="HomeBtn">Back to home</button>
            </a>
        `;
    }
};

generateCartItems();

// Increase the selected product item quantity by 1
let increment = (sku) => {
    let selectedItem = sku;
    let search = basket.find((x) => x.sku === selectedItem);

    if (search === undefined) {
        basket.push({
            sku: selectedItem,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    update(selectedItem);
    generateCartItems();
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Decrease the selected product item quantity by 1
let decrement = (sku) => {
    let selectedItem = sku;
    let search = basket.find((x) => x.sku === selectedItem);

    if (search.item === 0 ||
        search === undefined) return;
    else {
        search.item -= 1;
    }

    update(selectedItem);
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Update the displayed values for each selected product
let update = (sku) => {
    let search = basket.find((x) => x.sku === sku);
    document.getElementById(sku).innerHTML = search.item;
    calculation();
    totalAmount();
};

// Remove 1 selected product from the basket
let removeItem = (sku) => {
    let selectedItem = sku;
    basket = basket.filter((x) => x.sku !== selectedItem);
    generateCartItems();
    calculation();
    totalAmount();
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Remove all products from the basket
let clearCart = () => {
    basket = [];
    generateCartItems();
    calculation();
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Calculate the total cost for all products in the basket
let totalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket.map((x) => {
            let { item, sku } = x;
            let search = shopItemsData.find((y) => String(y.sku) === String(sku)) || [];
            return item * search.regularPrice;
        }).reduce((x, y) => x + y, 0);
        label.innerHTML = `
            <h2>Total Bill : $ ${(amount).toFixed(0)}</h2>
            <button class="checkout">Checkout</button>
            <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        `;
    } else return;
};

totalAmount();
