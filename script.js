// List of products
const products = [
    { id: 1, name: 'M10 BUDS', price: 297, description: 'High-quality product designed for your needs.', image: 'images/product1.jpg' },
    { id: 2, name: 'Product 2', price: 200, description: 'Another great product to meet your expectations.', image: 'https://via.placeholder.com/150' }
];

// Function to get the cart from localStorage
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

// Function to save the cart to localStorage
const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

// Function to render products (Home Page)
const renderProducts = () => {
    const productList = document.getElementById('product-list');
    if (productList) {
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-4 product-card';
            card.innerHTML = `
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-muted">৳${product.price}</p> <!-- Updated currency symbol -->
                        <a href="product-${product.id}.html" class="btn btn-info">View Details</a>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });

        // Add event listener for dynamically added "Add to Cart" buttons
        productList.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) {
                    const cart = getCart();
                    cart.push(product);
                    saveCart(cart);
                    alert(`${product.name} has been added to your cart!`);
                }
            }
        });
    }
};

// Function to render cart (Cart Page)
const renderCart = () => {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('total-price');
    if (cartList && totalPriceElement) {
        const cart = getCart();
        cartList.innerHTML = ''; // Clear current cart items
        let totalPrice = 0;

        // Populate cart
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item.name} - ৳${item.price} <!-- Updated currency symbol -->
                <button class="btn btn-sm btn-danger remove-from-cart" data-id="${item.id}">&times;</button>
            `;
            cartList.appendChild(li);
            totalPrice += item.price;
        });

        // Update total price
        totalPriceElement.textContent = `৳${totalPrice}`; // Updated currency symbol
    }
};

// Handle Checkout Form Submission (Checkout Page)
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const cart = getCart();

        if (cart.length === 0) {
            alert('Your cart is empty. Please add some products before checking out.');
            return;
        }

        // Send data to the server
        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, address, cart })
            });

            if (response.ok) {
                alert('Order placed successfully! Your details have been sent via email.');
                localStorage.removeItem('cart'); // Clear the cart
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Display the "Under Construction" Popup
window.addEventListener('load', () => {
    const popup = document.getElementById('construction-popup');
    const closeButton = document.getElementById('close-popup');

    // Show the popup when the page loads
    popup.style.display = 'block';

    // Hide the popup when the "Close" button is clicked
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});

// Initialize the appropriate page
if (document.getElementById('product-list')) {
    renderProducts(); // Home Page
}
if (document.getElementById('cart-list')) {
    renderCart(); // Cart Page
}
