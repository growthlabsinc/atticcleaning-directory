/**
 * Navigation Module
 * Handles mobile menu toggle and active navigation states
 */

export class Navigation {
    constructor() {
        this.menuToggle = document.querySelector('.js-menu-toggle');
        this.mobileNav = document.querySelector('.site-nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.mobileNav) return;
        
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.site-header') && !e.target.closest('.site-nav')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.menuToggle.focus();
            }
        });
        
        // Set active navigation state
        this.setActiveNav();
        
        // Handle window resize
        this.handleResize();
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.updateMenuState();
    }
    
    openMenu() {
        this.isOpen = true;
        this.updateMenuState();
    }
    
    closeMenu() {
        this.isOpen = false;
        this.updateMenuState();
    }
    
    updateMenuState() {
        this.menuToggle.setAttribute('aria-expanded', this.isOpen);
        this.mobileNav.classList.toggle('site-nav--mobile-open', this.isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
        
        // Trap focus in navigation when open
        if (this.isOpen) {
            this.trapFocus();
        }
    }
    
    trapFocus() {
        const focusableElements = this.mobileNav.querySelectorAll(
            'a, button, input, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Handle tab key
        this.mobileNav.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    setActiveNav() {
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Remove existing active class
            link.classList.remove('nav-link--active');
            link.removeAttribute('aria-current');
            
            // Add active class to current page
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '/') ||
                (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
                link.classList.add('nav-link--active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    handleResize() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            
            resizeTimer = setTimeout(() => {
                // Close mobile menu on desktop resize
                if (window.innerWidth >= 768 && this.isOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
    new Navigation();
}