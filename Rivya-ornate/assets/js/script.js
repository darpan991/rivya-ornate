const bar = document.getElementById('bar')
const close = document.getElementById('close')
const nav = document.getElementById('navbar')

if (bar){
  bar.addEventListener('click', () => {
    nav.classList.add('active')
  })
 
 if (close) {
   close.addEventListener('click', () => {
     nav.classList.remove('active')
   })
 }
}


  // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('glamourgems_cart')) || [];
    const quantityElements = document.querySelectorAll('.quantity');
    
    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        quantityElements.forEach(qty => {
            qty.textContent = totalItems;
        });
        localStorage.setItem('glamourgems_cart', JSON.stringify(cart));
    }

    // Add to cart function with product details
    window.addToCart = function(productElement) {
        // Get the product element
        const proElement = productElement.closest('.pro');
        
        // Extract product details
        const productName = proElement.querySelector('h5').textContent;
        const productPrice = parseInt(proElement.dataset.price);
        const productImage = proElement.querySelector('img').src;
        const productCategory = proElement.dataset.category;
        const productMetal = proElement.dataset.metal;
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.name === productName);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                name: productName,
                quantity: 1
            });
        }
        
        // Save product details to localStorage
        let productDetails = JSON.parse(localStorage.getItem('glamourgems_product_details')) || {};
        productDetails[productName] = {
            image: productImage,
            price: productPrice,
            category: productCategory,
            metal: productMetal
        };
        localStorage.setItem('glamourgems_product_details', JSON.stringify(productDetails));
        
        // Save updated cart
        localStorage.setItem('glamourgems_cart', JSON.stringify(cart));
        
        updateCartCount();
        showNotification(`${productName} added to cart!`);
        
        // Add animation to the clicked button
        const button = event.target.closest('.add-to-cart');
        if (button) {
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 1000);
        }
    };

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Filter System Implementation
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize products
        const products = document.querySelectorAll('.pro');
        const productsGrid = document.getElementById('productsGrid');
        
        // Clone all products to shop section
        products.forEach(product => {
            const clone = product.cloneNode(true);
            
            // Update add to cart button to pass element
            const addToCartBtn = clone.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.setAttribute('onclick', 'addToCart(this)');
            }
            
            productsGrid.appendChild(clone);
        });
        
        // Filter elements
        const categoryFilters = document.querySelectorAll('.category-filter');
        const metalFilters = document.querySelectorAll('.metal-filter');
        const priceRange = document.getElementById('priceRange');
        const selectedPrice = document.getElementById('selectedPrice');
        const resetButton = document.getElementById('resetFilters');
        
        // Initialize price display
        selectedPrice.textContent = `₹0 - ₹${priceRange.value}`;
        
        // Update price display
        priceRange.addEventListener('input', function() {
            selectedPrice.textContent = `₹0 - ₹${this.value}`;
            filterProducts();
        });
        
        // Filter change events
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });
        
        metalFilters.forEach(filter => {
            filter.addEventListener('change', filterProducts);
        });
        
        // Reset filters
        resetButton.addEventListener('click', function() {
            categoryFilters.forEach(filter => filter.checked = true);
            metalFilters.forEach(filter => filter.checked = true);
            priceRange.value = 20000;
            selectedPrice.textContent = '₹0 - ₹20000';
            filterProducts();
        });
        
        // Filter function
        function filterProducts() {
            const maxPrice = parseInt(priceRange.value);
            const selectedCategories = Array.from(categoryFilters)
                .filter(filter => filter.checked)
                .map(filter => filter.value);
            
            const selectedMetals = Array.from(metalFilters)
                .filter(filter => filter.checked)
                .map(filter => filter.value);
            
            const shopProducts = productsGrid.querySelectorAll('.pro');
            
            shopProducts.forEach(product => {
                const productPrice = parseInt(product.dataset.price);
                const productCategory = product.dataset.category;
                const productMetal = product.dataset.metal;
                
                const priceMatch = productPrice <= maxPrice;
                const categoryMatch = selectedCategories.includes(productCategory);
                const metalMatch = selectedMetals.includes(productMetal);
                
                if (priceMatch && categoryMatch && metalMatch) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }
        
        // Initialize filter
        filterProducts();
        
        // Update cart count on page load
        updateCartCount();
        
        // Mobile menu toggle
        const bar = document.getElementById('bar');
        const close = document.getElementById('close');
        const nav = document.getElementById('navbar');
        
        if (bar) {
            bar.addEventListener('click', () => {
                nav.classList.add('active');
            });
        }
        
        if (close) {
            close.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        }
        
        // Also update all existing add-to-cart buttons in featured products
        document.querySelectorAll('#product1 .add-to-cart').forEach(button => {
            button.setAttribute('onclick', 'addToCart(this)');
        });
    });