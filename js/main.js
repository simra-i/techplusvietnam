document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the products page before running the product logic
    if (document.getElementById('product-list')) {
        loadProducts();
    }

    // Simple navigation highlighting (optional but good practice)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

let allProducts = [];

async function loadProducts() {
    try {
        // Fetch product data from the JSON file
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        
        // Initial rendering of all products
        renderProducts(allProducts);

       // Setup filter buttons
       // setupFilterButtons();
        
    } catch (e) {
        console.error("Could not load products:", e);
        document.getElementById('product-list').innerHTML = '<p>Error loading product catalog. Please try again later.</p>';
    }
}

function setupFilterButtons() {
    const filterContainer = document.getElementById('filter-buttons');
    if (!filterContainer) return;

    // Get unique categories from the product data
    const categories = ['All', ...new Set(allProducts.map(p => p.category))];

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.textContent = category;
        button.dataset.category = category;
        
        // Set 'All' as active by default
        if (category === 'All') {
            button.classList.add('active');
        }

        button.addEventListener('click', (e) => {
            // Remove 'active' from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Add 'active' to the clicked button
            e.target.classList.add('active');
            
            // Filter and render products
            filterProducts(category);
        });
        filterContainer.appendChild(button);
    });
}

function filterProducts(category) {
    let filteredProducts = allProducts;
    
    if (category !== 'All') {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    
    renderProducts(filteredProducts);
}

function renderProducts(products) {
    const listContainer = document.getElementById('product-list');
    listContainer.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        listContainer.innerHTML = '<p>No products found in this category.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        
        // Dynamically create the HTML for the product card
        card.innerHTML = `
            <img src="assets/images/${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='placeholder.jpg';">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="specs">
                    <span><strong>Category:</strong> ${product.category}</span>
                    <span><strong>Flow Rate:</strong> ${product.flow_rate}</span>
                    <span><strong>Ultimate Pressure:</strong> ${product.ultimate_pressure}</span>
                </div>
            <a href="contact.html" class="btn btn-details">Enquire Now</a>

            </div>
        `;
        listContainer.appendChild(card);
    });
}
//  redirect to Contact page 
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('btn-details')) {
        setTimeout(() => {
            window.location.href = 'contact.html';
        }, 800); // redirect ~0.8 sec 
    }
});

// Note: You would need to add an 'assets/images/placeholder.jpg' for the onerror function to work if images are missing.