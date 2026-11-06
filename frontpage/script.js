
// GET HTML ELEMENTS

const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const cartBtn = document.getElementById("cartBtn");

const cartOverlay = document.getElementById("cartOverlay");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");


// VARIABLES

let products = [];

let cart = [];


// FORMAT PRICE

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


// FETCH PRODUCTS FROM JSON FILE

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    }

    catch (error) {

        productContainer.innerHTML =
            '<p class="no-products">Unable to load products. Please run the project using Live Server.</p>';

        console.error(error);

    }

}


// DISPLAY PRODUCTS DYNAMICALLY

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            '<p class="no-products">No products found!</p>';

        return;

    }

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ⭐ ${product.rating} / 5
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-btn"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;

        productContainer.appendChild(productCard);

    });

}


// ADD TO CART

function addToCart(productId) {

    const selectedProduct = products.find(
        product => product.id === productId
    );

    if (!selectedProduct) return;

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    }

    else {

        cart.push({
            ...selectedProduct,
            quantity: 1
        });

    }

    updateCart();

}


// UPDATE CART

function updateCart() {

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    displayCart();

}


// DISPLAY CART ITEMS

function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';

        cartTotal.textContent = formatPrice(0);

        return;

    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>
                    ${formatPrice(item.price)}
                    × ${item.quantity}
                </p>

            </div>

            <button
                class="remove-btn"
                data-id="${item.id}"
            >
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    cartTotal.textContent = formatPrice(total);

}


// REMOVE PRODUCT FROM CART

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();

}


// SEARCH PRODUCTS

function searchProducts() {

    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||

            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);

}


// EVENT LISTENERS


// Add product to cart

productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-btn")) {

        const productId = Number(event.target.dataset.id);

        addToCart(productId);

        event.target.textContent = "Added ✓";

        setTimeout(() => {

            event.target.textContent = "Add to Cart";

        }, 800);

    }

});


// Remove product from cart

cartItems.addEventListener("click", function(event) {

    if (event.target.classList.contains("remove-btn")) {

        const productId = Number(event.target.dataset.id);

        removeFromCart(productId);

    }

});


// Search button

searchBtn.addEventListener("click", searchProducts);


// Search while typing

searchInput.addEventListener("input", searchProducts);


// Open cart

cartBtn.addEventListener("click", function() {

    cartOverlay.classList.add("active");

});


// Close cart

closeCart.addEventListener("click", function() {

    cartOverlay.classList.remove("active");

});


// Close cart when clicking outside

cartOverlay.addEventListener("click", function(event) {

    if (event.target === cartOverlay) {

        cartOverlay.classList.remove("active");

    }

});


// CHECKOUT BUTTON

checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

    }

    else {

        alert("Thank you for shopping at ShopZone! Your demo order is ready.");

        cart = [];

        updateCart();

        cartOverlay.classList.remove("active");

    }

});


// LOAD PRODUCTS WHEN WEBSITE STARTS

loadProducts();
