/*******************************************************************************
 * Filename:    main.js
 * Purpose:     Phone shop example using regular JavaScript. 
 *              Generates the phone shop using live data from the Best Buy API.
 *              If the API is not available, cached data is provided instead.
 *******************************************************************************/

// localStorage.clear();

// Retrieve selected shopping cart items from localstorage as localBasketData
let basket = JSON.parse(localStorage.getItem("localBasketData")) || [];

document.addEventListener("DOMContentLoaded", function () {

    let shop = document.getElementById('shop');

    let shopItemsData = [];

    // Generate the shop with images, title, price, buttons, and operating system
    let generateShop = () => {
        return (shop.innerHTML = shopItemsData
            .map((x) => {
                let { sku, albumTitle, regularPrice, mobileOperatingSystem, image } = x;
                let search = basket.find((x) => x.sku === String(sku)) || [];
                return `
                <div id=product-id-${sku} class="item">
                    <img height="275" width="220" src=${image} alt="">
                    <div class="details">
                        <h3>${albumTitle}</h3>
                        <p>${mobileOperatingSystem}</p>
                        <div class="price-quantity">
                            <h2>$ ${(regularPrice).toFixed(0)}</h2>
                            <div class="buttons">
                                <i onclick="decrement('${sku}')" class="bi bi-dash-lg"></i>
                                <div id=${sku} class="quantity">
                                    ${search.item === undefined ? 0 : search.item}
                                </div>
                                <i onclick="increment('${sku}')" class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            }).join(""))
    };

    // Generate live data from the Best Buy API in JSON format using an API key that was posted on the internet
	// Aug 2024 - Disabled the API key to demonstrate cached data after some products were removed from the live database.
	//fetch("https://api.bestbuy.com/v1/products(condition=new&regularPrice>100.00&inStoreAvailability=true&(categoryPath.id=pcmcat209400050001))?apiKey=qhqws47nyvgze2mq3qx4jadt&pageSize=100&format=json")
	fetch("https://api.bestbuy.com/v1/products(condition=new&regularPrice>100.00&inStoreAvailability=true&(categoryPath.id=pcmcat209400050001))?apiKey=disabledToDemonstrateCachedData&pageSize=100&format=json")
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            // Check if "products" array exists in the response
            if (data && data.products) {
                // Push only the "products" array into shopItemsData
                shopItemsData.push(...data.products);

                // Store the "shopItemsData" array in localstorage
                localStorage.setItem('localShopItemsData', JSON.stringify(shopItemsData));

                // Log the content of shopItemsData to the console
                //console.log("shopItemsData:", shopItemsData);
                generateShop();
            } else {
                console.error("Products array not found in the response");
            }
        })
        .catch((error) => {
            console.error("FETCH ERROR:", error);
            // Use cached data from data.js if the API is not available
            shopItemsData = fallbackData;
            generateShop();
        });
});

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
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Decrease the selected product item quantity by 1
let decrement = (sku) => {
    let selectedItem = sku;
    let search = basket.find((x) => x.sku === selectedItem);

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }

    update(selectedItem);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("localBasketData", JSON.stringify(basket));
};

// Update the displayed quantity of each selected product
let update = (sku) => {
    let search = basket.find((x) => x.sku === sku);
    document.getElementById(sku).innerHTML = search.item;
    calculation();
};

// Calculate the total quantity of all products in the basket
let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();
