// DOM Elements
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchBox = document.querySelector('.search-box input');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Cart functionality
let cart = JSON.parse(localStorage.getItem('ntzCart')) || [];

function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('ntzCart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(90deg, #00ffff, #ff00ff);
        color: #000;
        padding: 15px 25px;
        border-radius: 30px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Search functionality
searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.textContent.toLowerCase();
        
        productCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (productName.includes(filter) || productDescription.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Product card interactions
productCards.forEach(card => {
    const addToCartBtn = card.querySelector('.action-btn:last-child');
    const wishlistBtn = card.querySelector('.action-btn:first-child');
    const quickViewBtn = card.querySelector('.action-btn:nth-child(2)');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.current-price').textContent;
            const price = parseInt(priceText.replace('₹', '').replace(',', ''));
            
            addToCart(Date.now(), productName, price);
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            wishlistBtn.style.color = wishlistBtn.style.color === 'rgb(255, 80, 80)' ? '' : '#ff5050';
            showNotification(wishlistBtn.style.color === 'rgb(255, 80, 80)' ? 'Added to wishlist!' : 'Removed from wishlist!');
        });
    }
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', () => {
            showQuickView(card);
        });
    }
});

// Quick view functionality
function showQuickView(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    const productDescription = productCard.querySelector('p').textContent;
    const priceText = productCard.querySelector('.current-price').textContent;
    const originalPriceText = productCard.querySelector('.original-price')?.textContent || '';
    const productImage = productCard.querySelector('img').src;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="modal-info">
                    <h2>${productName}</h2>
                    <p>${productDescription}</p>
                    <div class="modal-price">
                        <span class="current-price">${priceText}</span>
                        ${originalPriceText ? `<span class="original-price">${originalPriceText}</span>` : ''}
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary add-to-cart-modal">Add to Cart</button>
                        <button class="btn-secondary buy-now-modal">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(255, 0, 255, 0.1));
        border: 1px solid #00ffff;
        border-radius: 20px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        backdrop-filter: blur(20px);
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Add to cart from modal
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        const price = parseInt(priceText.replace('₹', '').replace(',', ''));
        addToCart(Date.now(), productName, price);
        modal.remove();
    });
    
    // Buy now from modal
    modal.querySelector('.buy-now-modal').addEventListener('click', () => {
        showNotification('Redirecting to checkout...');
        setTimeout(() => modal.remove(), 1000);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .category-card, .package-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        padding: 30px;
    }
    
    .modal-image img {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }
    
    .modal-info h2 {
        color: #00ffff;
        margin-bottom: 15px;
    }
    
    .modal-info p {
        color: #b0b0b0;
        margin-bottom: 20px;
    }
    
    .modal-price {
        margin-bottom: 30px;
    }
    
    .modal-actions {
        display: flex;
        gap: 15px;
    }
    
    .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
        z-index: 1;
    }
    
    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
        }
        
        .modal-actions {
            flex-direction: column;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 20px;
        border-top: 1px solid #00ffff;
    }
    
    .nav-menu.active li {
        margin: 10px 0;
    }
`;

document.head.appendChild(style);

// Initialize cart count on page load
updateCartCount();

// Add loading states for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
            const originalText = this.textContent;
            this.innerHTML = '<span class="loading"></span>';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        }
    });
});

// Newsletter subscription (if implemented)
const newsletterForm = document.querySelector('#newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        showNotification(`Subscribed successfully with ${email}!`);
        e.target.reset();
    });
}

// Contact form handling
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully! We will get back to you soon.');
        e.target.reset();
    });
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.quick-view-modal');
        if (modal) modal.remove();
        
        const mobileMenu = document.querySelector('.nav-menu.active');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
});

console.log('Navodaya Trendz website loaded successfully! 🚀');
