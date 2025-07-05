/**
 * Main JavaScript Entry Point
 * AtticCleaning.com Directory
 */

// Import modules
import { initSearch } from './modules/search.js';
import { initAPI } from './modules/api.js';
import { initForms } from './modules/forms.js';
import { initLazyLoad } from './modules/lazyload.js';
import { initAnalytics } from './modules/analytics.js';
import { Navigation } from './modules/navigation.js';

// Application configuration
const APP_CONFIG = {
    debug: false, // Set to true for development
    api: {
        googleMaps: {
            apiKey: '' // TODO: Add API key from environment
        }
    }
};

// Initialize application
function initApp() {
    // Initialize analytics first
    initAnalytics({
        debug: APP_CONFIG.debug
    });
    
    // Initialize API client
    initAPI(APP_CONFIG.api);
    
    // Initialize search functionality
    initSearch();
    
    // Initialize form handling
    initForms();
    
    // Initialize lazy loading
    initLazyLoad();
    
    // Initialize UI components
    initUI();
    
    // Set up global error handling
    setupErrorHandling();
    
    if (APP_CONFIG.debug) {
        console.log('AtticCleaning.com Directory initialized');
    }
}

// Initialize UI components
function initUI() {
    // Initialize navigation (handles mobile menu)
    new Navigation();
    
    // Smooth scrolling
    initSmoothScroll();
    
    // Back to top button
    initBackToTop();
    
    // Dynamic copyright year
    updateCopyrightYear();
    
    // Load more functionality
    initLoadMore();
    
    // Get quotes modal
    initQuoteModal();
}


// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, '', targetId);
    });
}

// Back to top button
function initBackToTop() {
    // Create button if it doesn't exist
    let backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
    }
    
    // Show/hide based on scroll position
    let ticking = false;
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(toggleBackToTop);
            ticking = true;
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update copyright year
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.js-current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Load more functionality for business listings
function initLoadMore() {
    const loadMoreButtons = document.querySelectorAll('.js-load-more');
    
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const city = button.dataset.city;
            const currentCount = document.querySelectorAll('.business-card').length;
            
            // Show loading state
            button.classList.add('btn-loading');
            button.disabled = true;
            
            try {
                // Simulate loading more businesses
                // In production, this would fetch from an API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // For demo, just show a message
                button.textContent = 'No more businesses to load';
                button.disabled = true;
            } catch (error) {
                console.error('Error loading more businesses:', error);
                button.classList.remove('btn-loading');
                button.disabled = false;
            }
        });
    });
}

// Quote modal functionality
function initQuoteModal() {
    // Handle get quote button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.js-get-quotes')) {
            e.preventDefault();
            const city = e.target.dataset.city;
            
            // For now, scroll to business listings
            const businessSection = document.querySelector('.business-listings');
            if (businessSection) {
                businessSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Global error handling
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        
        // Track errors in analytics
        if (window.analytics) {
            window.analytics.trackError(e.error);
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Track errors in analytics
        if (window.analytics) {
            window.analytics.trackError(e.reason);
        }
    });
}

// Performance monitoring
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (window.analytics) {
                    window.analytics.trackTiming(
                        'Core Web Vitals',
                        'LCP',
                        lastEntry.startTime,
                        window.location.pathname
                    );
                }
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP not supported
        }
        
        // Monitor First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (window.analytics) {
                        window.analytics.trackTiming(
                            'Core Web Vitals',
                            'FID',
                            entry.processingStart - entry.startTime,
                            window.location.pathname
                        );
                    }
                });
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // FID not supported
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Monitor performance
monitorPerformance();

// Export for use in other scripts
window.AtticCleaning = {
    config: APP_CONFIG,
    initApp,
    analytics: window.analytics
};