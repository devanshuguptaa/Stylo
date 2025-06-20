document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const getElement = (id) => document.getElementById(id);
    const querySelector = (selector) => document.querySelector(selector);

    const apiUrl = 'http://localhost:3000/api';
    const productGrid = getElement('category-product-grid');
    const categoryTitle = getElement('category-title');
    const searchBar = getElement('search-bar');
    
    // Modals & Auth are handled globally but we need product modal logic here
    const productModal = getElement('product-modal');
    const productDetailContent = getElement('product-detail-content');
    const similarProductsGrid = getElement('similar-products-grid');

    let allProducts = [];
    let currentCategoryProducts = [];

    // --- Core Functions ---

    const getCategoryFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('category');
    };

    const fetchProductsForCategory = async (category) => {
        if (!productGrid || !categoryTitle) return;

        categoryTitle.textContent = category || 'All Products';
        
        try {
            const response = await fetch(`${apiUrl}/products?category=${encodeURIComponent(category)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            // We need all products for the "similar products" feature
            const allProductsResponse = await fetch(`${apiUrl}/products`);
            allProducts = await allProductsResponse.json();
            
            currentCategoryProducts = await response.json();
            renderProducts(currentCategoryProducts);
        } catch (error) {
            console.error(`Failed to fetch products for category ${category}:`, error);
            productGrid.innerHTML = '<p>Could not load products for this category.</p>';
        }
    };

    const renderProducts = (productsToRender) => {
        if (!productGrid) return;
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>No products found in this category.</p>';
        } else {
            productGrid.innerHTML = productsToRender.map(renderProductCard).join('');
        }
        addProductCardEventListeners();
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
            addProductCardEventListeners(); // Re-add listeners for similar products
            querySelector('.similar-products').style.display = 'block';
        } else {
            querySelector('.similar-products').style.display = 'none';
        }
    };
    
    // This function is now shared from script.js, but we need it here for the product modal
    const setupProductModalClose = () => {
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

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredProducts = currentCategoryProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    };


    // --- Initialization ---

    const init = () => {
        const category = getCategoryFromURL();
        if (category) {
            fetchProductsForCategory(category);
        } else {
             if (categoryTitle) categoryTitle.textContent = "Category not found";
             if (productGrid) productGrid.innerHTML = "";
        }
        
        if (searchBar) {
            searchBar.addEventListener('input', handleSearch);
        }
        
        // Setup the close button for the product modal specifically on this page
        setupProductModalClose();
    };

    init();
}); 