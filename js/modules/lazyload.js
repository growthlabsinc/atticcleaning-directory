/**
 * Lazy Load Module - Handles lazy loading of images and content
 */

// LazyLoader class
export class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.01,
            loadedClass: 'loaded',
            loadingClass: 'loading',
            errorClass: 'error',
            ...options
        };
        
        this.observer = null;
        this.init();
    }
    
    init() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback - load all images immediately
            this.loadAllImages();
            return;
        }
        
        // Create observer
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );
        
        // Start observing
        this.observeImages();
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
            }
        });
    }
    
    loadElement(element) {
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        } else if (element.tagName === 'IFRAME') {
            this.loadIframe(element);
        } else {
            this.loadBackgroundImage(element);
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (!src) return;
        
        // Add loading class
        img.classList.add(this.options.loadingClass);
        
        // Create temporary image to load
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Set actual image attributes
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            // Remove data attributes
            delete img.dataset.src;
            delete img.dataset.srcset;
            
            // Update classes
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.loadedClass);
            
            // Stop observing
            if (this.observer) {
                this.observer.unobserve(img);
            }
        };
        
        tempImg.onerror = () => {
            // Handle error
            img.classList.remove(this.options.loadingClass);
            img.classList.add(this.options.errorClass);
            
            // Set fallback image if available
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }
            
            // Stop observing
            if (this.observer) {
                this.observer.unobserve(img);
            }
        };
        
        // Start loading
        if (srcset) tempImg.srcset = srcset;
        tempImg.src = src;
    }
    
    loadIframe(iframe) {
        const src = iframe.dataset.src;
        
        if (!src) return;
        
        // Set iframe source
        iframe.src = src;
        
        // Remove data attribute
        delete iframe.dataset.src;
        
        // Add loaded class
        iframe.classList.add(this.options.loadedClass);
        
        // Stop observing
        if (this.observer) {
            this.observer.unobserve(iframe);
        }
    }
    
    loadBackgroundImage(element) {
        const bgImage = element.dataset.bgImage;
        
        if (!bgImage) return;
        
        // Add loading class
        element.classList.add(this.options.loadingClass);
        
        // Create temporary image to load
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Set background image
            element.style.backgroundImage = `url(${bgImage})`;
            
            // Remove data attribute
            delete element.dataset.bgImage;
            
            // Update classes
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.loadedClass);
            
            // Stop observing
            if (this.observer) {
                this.observer.unobserve(element);
            }
        };
        
        tempImg.onerror = () => {
            // Handle error
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.errorClass);
            
            // Stop observing
            if (this.observer) {
                this.observer.unobserve(element);
            }
        };
        
        // Start loading
        tempImg.src = bgImage;
    }
    
    observeImages() {
        // Find all lazy load elements
        const lazyElements = document.querySelectorAll('[data-src], [data-srcset], [data-bg-image]');
        
        lazyElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    loadAllImages() {
        // Fallback for browsers without IntersectionObserver
        const lazyElements = document.querySelectorAll('[data-src], [data-srcset], [data-bg-image]');
        
        lazyElements.forEach(element => {
            this.loadElement(element);
        });
    }
    
    // Public method to add new elements
    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        } else {
            // No observer, load immediately
            this.loadElement(element);
        }
    }
    
    // Public method to refresh observations
    refresh() {
        this.observeImages();
    }
}

// Create placeholder image
export function createPlaceholder(width, height, text = '') {
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                ${text || `${width}×${height}`}
            </text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Initialize lazy loading
export function initLazyLoad(options = {}) {
    const lazyLoader = new LazyLoader(options);
    
    // Re-observe when new content is added
    document.addEventListener('contentAdded', () => {
        lazyLoader.refresh();
    });
    
    return lazyLoader;
}

// Export utilities
export const LazyLoadUtils = {
    createPlaceholder,
    LazyLoader
};