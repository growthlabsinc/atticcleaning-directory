// Vanilla JavaScript - No dependencies
// Attic Cleaning Directory Search Functionality

(function() {
    'use strict';
    
    // DOM Elements
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // Basic search functionality
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('Please enter a city or ZIP code');
            return;
        }
        
        // For MVP, redirect to location page
        // Future: Client-side search implementation
        console.log('Searching for:', query);
    }
    
    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Performance: Lazy load images
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
})();