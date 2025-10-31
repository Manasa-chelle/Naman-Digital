// Sample products
const products = [
  { id: 1, name: "Smartphone", price: 499.99, category: "electronics", img: "https://via.placeholder.com/150" },
  { id: 2, name: "Laptop", price: 899.99, category: "electronics", img: "https://via.placeholder.com/150" },
  { id: 3, name: "T-Shirt", price: 19.99, category: "clothing", img: "https://via.placeholder.com/150" },
  { id: 4, name: "Jeans", price: 49.99, category: "clothing", img: "https://via.placeholder.com/150" },
  { id: 5, name: "Sunglasses", price: 29.99, category: "accessories", img: "https://via.placeholder.com/150" },
];

// Cart State
let cart = [];

// DOM elements
const productGrid = document.getElementById("product-grid");
const cartDrawer = document.getElementById("cart-drawer");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("checkout-modal");
const checkoutTotal = document.getElementById("checkout-total");

// Render Products
function renderProducts(items) {
  productGrid.innerHTML = "";
  items.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

// Add to Cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  toggleCart(true);
}

// Update Cart UI
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <p>${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });
  cartCount.textContent = count;
  cartTotal.textContent = total.toFixed(2);
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Toggle Cart Drawer
function toggleCart(forceOpen = false) {
  if (forceOpen) {
    cartDrawer.classList.add("active");
  } else {
    cartDrawer.classList.toggle("active");
  }
}

// Apply Filters
function applyFilters() {
  const searchQuery = document.getElementById("search-box").value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

// Checkout
function checkout() {
  checkoutTotal.textContent = cartTotal.textContent;
  modal.classList.add("active");
}

// Close Modal
function closeModal() {
  modal.classList.remove("active");
  document.getElementById("payment-status").textContent = "";
}

// Mock Payment Processing
function processPayment() {
  const cardNum = document.getElementById("card-number").value;
  const status = document.getElementById("payment-status");

  if (!cardNum || cardNum.length < 8) {
    status.textContent = "Invalid card details!";
    status.style.color = "red";
    return;
  }

  status.textContent = "Processing payment...";
  status.style.color = "blue";

  setTimeout(() => {
    if (parseInt(cardNum.slice(-1)) % 2 === 0) {
      status.textContent = "Payment Successful! 🎉";
      status.style.color = "green";
      cart = [];
      updateCart();
    } else {
      status.textContent = "Payment Failed. Try again.";
      status.style.color = "red";
    }
  }, 1500);
}

// Initial render
renderProducts(products);
