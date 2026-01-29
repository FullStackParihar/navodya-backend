const API_URL = '/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let stripe = null;
let elements = null;
let currentPaymentIntent = null;

// Initialize Stripe (Replace with your public key if not using env injection, usually frontend needs public key)
// Since this is a test, I'll assume we can get it or hardcode a test key for "viewing" purposes, 
// but in reality we need the publishable key. 
// For this demo, user needs to put their publishable key here or we fetch it.
const STRIPE_PK = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Standard Test PK
try {
    stripe = Stripe(STRIPE_PK);
} catch (e) {
    console.warn('Stripe not initialized');
}

// Auth Headers
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Init
function init() {
    if (token) {
        document.getElementById('auth-forms').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('user-email').textContent = currentUser?.email;
        document.getElementById('user-role').textContent = currentUser?.role;
        
        if (currentUser?.role === 'admin') {
            document.getElementById('admin-controls').classList.remove('hidden');
        }

        fetchProducts();
    }
}

// Navigation
function showSection(id) {
    ['products', 'cart', 'orders'].forEach(s => {
        document.getElementById(`${s}-section`).classList.add('hidden');
    });
    document.getElementById(`${id}-section`).classList.remove('hidden');

    if (id === 'products') fetchProducts();
    if (id === 'cart') fetchCart();
    if (id === 'orders') fetchOrders();
}

// Auth Functions
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
            token = data.data.token;
            currentUser = data.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            location.reload();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Login failed');
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}

// Product Functions
async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    const container = document.getElementById('products-list');
    
    if (data.success) {
        container.innerHTML = data.data.products.map(p => `
            <div class="product-card">
                <h4>${p.name}</h4>
                <p>₹${p.sale_price || p.price}</p>
                <div style="font-size: 0.8em; color: #888;">${p.description}</div>
                <br>
                <button class="btn-small" onclick="addToCart('${p.id}', '${p.sizes[0]?.size || 'M'}')">Add to Cart</button>
            </div>
        `).join('');
    }
}

async function createProduct() {
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const slug = document.getElementById('prod-slug').value;
    const catId = document.getElementById('prod-cat').value;

    // Minimal create
    const payload = {
        name, slug, price: Number(price), description: 'Test desc', 
        categoryId: catId,
        images: [],
        sizes: [{size: 'M', stock: 100}]
    };

    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message);
    fetchProducts();
}

// Cart Functions
async function addToCart(productId, size) {
    if (!token) return alert('Login first');
    
    const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productId, size, quantity: 1, color: 'Blue' }) // Hardcoded for test
    });
    const data = await res.json();
    alert(data.message);
}

async function fetchCart() {
    if (!token) return;
    const res = await fetch(`${API_URL}/cart`, { headers: getHeaders() });
    const data = await res.json();
    
    if (data.success) {
        const { items, summary } = data.data;
        document.getElementById('cart-items').innerHTML = items.map(i => `
            <div style="padding: 1rem; border-bottom: 1px solid #333; display: flex; justify-content: space-between;">
                <div>
                    <b>${i.products.name}</b> x ${i.quantity}
                    <br>
                    <small>${i.size} | ₹${i.products.sale_price || i.products.price}</small>
                </div>
                <button class="btn-small btn-danger" onclick="removeFromCart('${i._id}')">Remove</button>
            </div>
        `).join('');
        
        document.getElementById('order-summary').innerHTML = `
            <p>Subtotal: ₹${summary.subtotal}</p>
            <p>Total Items: ${summary.totalQuantity}</p>
        `;
    }
}

async function removeFromCart(id) {
    await fetch(`${API_URL}/cart/remove/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    fetchCart();
}

// Checkout & Payment
async function initiateCheckout() {
    const couponCode = document.getElementById('coupon-code').value;
    
    const res = await fetch(`${API_URL}/orders/create-payment-intent`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            couponCode,
            shippingAddress: {
                street: 'Test St',
                city: 'Test City',
                state: 'TS',
                zip_code: '123456',
                country: 'India'
            }
        })
    });
    
    const data = await res.json();
    
    if (data.success) {
        currentPaymentIntent = data.data.paymentIntentId;
        const secret = data.data.clientSecret;
        
        // Show payment UI
        document.getElementById('payment-area').classList.remove('hidden');
        
        elements = stripe.elements({ clientSecret: secret, appearance: { theme: 'night' } });
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
        
        // Update summary
        document.getElementById('order-summary').innerHTML += `<p style="color: green">Total to Pay: ₹${data.data.pricing.total}</p>`;
    } else {
        alert(data.message);
    }
}

async function confirmPayment() {
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Return URL not used in this single page test often, but required
            return_url: window.location.href, // Redirects, we handle "redirect" status if needed
        },
        redirect: 'if_required'
    });

    if (error) {
        document.getElementById('payment-message').innerText = error.message;
    } else {
        // Payment success, create order
        await createOrder(currentPaymentIntent);
    }
}

async function createOrder(piId) {
    const res = await fetch(`${API_URL}/orders/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            paymentIntentId: piId,
            shippingAddress: {
                street: 'Test St',
                city: 'Test City',
                state: 'TS',
                zip_code: '123456',
                country: 'India'
            }
        })
    });
    
    const data = await res.json();
    if (data.success) {
        alert('Order Placed Successfully!');
        document.getElementById('payment-area').classList.add('hidden');
        showSection('orders');
    }
}

// Orders
async function fetchOrders() {
    const res = await fetch(`${API_URL}/orders`, { headers: getHeaders() });
    const data = await res.json();
    
    document.getElementById('orders-list').innerHTML = data.data.map(o => `
        <div class="card" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between;">
                <b>Order #${o._id.substr(-6)}</b>
                <span>${o.status}</span>
            </div>
            <p>Total: ₹${o.pricing.total}</p>
            <div style="font-size: 0.9em; padding-left: 1rem;">
                ${o.items.map(i => `<div>${i.name} x ${i.quantity}</div>`).join('')}
            </div>
        </div>
    `).join('');
}

init();
