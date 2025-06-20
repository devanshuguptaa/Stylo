document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    const apiUrl = 'http://localhost:3000/api';
    const productGrid = querySelector('#featured .product-grid');
    const categoryGrid = querySelector('.category-grid');
    const authContainer = querySelector('.nav-auth');

    // Product Modal
    const productModal = getElement('product-modal');
    const productDetailContent = getElement('product-detail-content');
    const similarProductsGrid = getElement('similar-products-grid');

    let allProducts = [];

    // --- Core Functions ---

    const fetchAndRenderProducts = async () => {
        if (!productGrid) return;
        try {
            const response = await fetch(`${apiUrl}/products`);
            if (!response.ok) throw new Error('Network response was not ok');
            allProducts = await response.json();
            
            const featuredProducts = allProducts.slice(0, 4);
            productGrid.innerHTML = featuredProducts.map(renderProductCard).join('');
            addProductCardEventListeners();
        } catch (error) {
            console.error("Failed to fetch products:", error);
            if(productGrid) productGrid.innerHTML = '<p>Could not load featured products.</p>';
        }
    };

    const fetchAndRenderCategories = async () => {
        if (!categoryGrid) return;
        try {
            const response = await fetch(`${apiUrl}/categories`);
            if (!response.ok) throw new Error('Network response was not ok');
            const categories = await response.json();
            categoryGrid.innerHTML = categories.map(category => `
                <a href="/category.html?category=${encodeURIComponent(category.name)}" class="category-card-link">
                    <div class="category-card" style="background-image: url('${category.imageUrl}')">
                        <h3>${category.name}</h3>
                    </div>
                </a>
            `).join('');
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            if(categoryGrid) categoryGrid.innerHTML = '<p>Could not load categories.</p>';
        }
    };

    const renderProductCard = (product) => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            </div>
        </div>
    `;

    // --- Event Listeners & Modal Logic ---

    const addProductCardEventListeners = () => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                if (productId) openProductModal(productId);
            });
        });
    };

    const openProductModal = (productId) => {
        const product = allProducts.find(p => p.id == productId);
        if (!product || !productModal) return;

        productDetailContent.innerHTML = `
            <div class="product-detail-layout">
                <div class="product-detail-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <p class="description">${product.description}</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        renderSimilarProducts(product.category, product.id);
        productModal.style.display = 'block';
    };

    const renderSimilarProducts = (category, currentProductId) => {
        const similar = allProducts.filter(p => p.category === category && p.id != currentProductId).slice(0, 3);
        if (similar.length > 0) {
            similarProductsGrid.innerHTML = similar.map(renderProductCard).join('');
            addProductCardEventListeners();
            querySelector('.similar-products').style.display = 'block';
        } else {
            querySelector('.similar-products').style.display = 'none';
        }
    };

    const setupProductModalEvents = () => {
        if (!productModal) return;
        
        const closeBtn = productModal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => productModal.style.display = 'none');
        }
        productModal.addEventListener('click', (event) => {
            if (event.target === productModal) {
                productModal.style.display = 'none';
            }
        });
    };
    
    // --- Authentication ---
    const updateAuthState = async () => {
        if (!authContainer) return;
        
        try {
            const response = await fetch('/api/auth/status');
            const data = await response.json();
            
            if (data.loggedIn) {
                authContainer.innerHTML = `
                    <div class="user-profile">
                        <div class="user-avatar">
                            <img src="https://img.icons8.com/color/48/000000/user-male-circle.png" alt="User Avatar">
                        </div>
                        <div class="user-info">
                            <span class="user-name">${data.user.name}</span>
                            <button onclick="logoutUser()" class="logout-btn">Logout</button>
                        </div>
                    </div>
                `;
            } else {
                authContainer.innerHTML = `
                    <a href="signin.html" class="auth-button" id="login-btn">Login</a>
                    <a href="signup.html" class="auth-button" id="signup-btn">Sign Up</a>
                `;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            authContainer.innerHTML = `
                <a href="signin.html" class="auth-button" id="login-btn">Login</a>
                <a href="signup.html" class="auth-button" id="signup-btn">Sign Up</a>
            `;
        }
    };

    const logoutUser = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                // Clear any client-side tokens
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                
                // Redirect to logout page
                window.location.href = '/logout.html';
            } else {
                showMessage('Logout failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, clear the token and redirect
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/logout.html';
        }
    };

    const showMessage = (message, type = 'info') => {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        if (type === 'success') {
            messageEl.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = '#ef4444';
        } else {
            messageEl.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    };

    // Make logout function globally available
    window.logoutUser = logoutUser;

    // --- Initialization ---
    const init = () => {
        fetchAndRenderProducts();
        fetchAndRenderCategories();
        setupProductModalEvents();
        updateAuthState();
    };

    init();

    // --- Responsive Navigation ---
    const hamburger = querySelector('.hamburger');
    const navLinks = querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }
}); 