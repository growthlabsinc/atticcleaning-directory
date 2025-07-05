/**
 * Analytics Module - Handles Google Analytics event tracking
 */

// Analytics configuration
const ANALYTICS_CONFIG = {
    measurementId: 'G-PT65W6PKKF',
    debug: false,
    trackingEvents: {
        // Page interactions
        search: 'search',
        filter: 'filter_results',
        
        // Business interactions
        viewBusiness: 'view_business',
        getQuote: 'generate_lead',
        callBusiness: 'contact_business',
        getDirections: 'get_directions',
        
        // User engagement
        shareContent: 'share',
        printPage: 'print',
        newsletter: 'newsletter_signup',
        
        // Scroll tracking
        scrollDepth: 'scroll_depth'
    }
};

// Analytics class
export class Analytics {
    constructor(config = {}) {
        this.config = { ...ANALYTICS_CONFIG, ...config };
        this.isInitialized = false;
        this.scrollDepths = new Set();
        
        this.init();
    }
    
    init() {
        // Check if gtag is available
        if (typeof window.gtag !== 'function') {
            console.warn('Google Analytics not loaded');
            return;
        }
        
        this.isInitialized = true;
        
        // Set up automatic tracking
        this.setupAutoTracking();
        
        // Debug mode
        if (this.config.debug) {
            window.gtag('config', this.config.measurementId, {
                debug_mode: true
            });
        }
    }
    
    setupAutoTracking() {
        // Track outbound links
        this.trackOutboundLinks();
        
        // Track phone clicks
        this.trackPhoneClicks();
        
        // Track email clicks
        this.trackEmailClicks();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track print
        this.trackPrint();
        
        // Track form interactions
        this.trackForms();
        
        // Track business card interactions
        this.trackBusinessCards();
    }
    
    // Generic event tracking
    track(eventName, parameters = {}) {
        if (!this.isInitialized) return;
        
        if (this.config.debug) {
            console.log('Analytics Event:', eventName, parameters);
        }
        
        window.gtag('event', eventName, parameters);
    }
    
    // Track search queries
    trackSearch(searchTerm, resultCount = 0) {
        this.track(this.config.trackingEvents.search, {
            search_term: searchTerm,
            results_count: resultCount,
            event_category: 'engagement'
        });
    }
    
    // Track business view
    trackBusinessView(businessId, businessName) {
        this.track(this.config.trackingEvents.viewBusiness, {
            business_id: businessId,
            business_name: businessName,
            event_category: 'engagement'
        });
    }
    
    // Track lead generation
    trackLeadGeneration(businessId, businessName, leadType = 'quote') {
        this.track(this.config.trackingEvents.getQuote, {
            business_id: businessId,
            business_name: businessName,
            lead_type: leadType,
            event_category: 'conversion',
            value: 1
        });
    }
    
    // Track outbound links
    trackOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.href;
            if (!href) return;
            
            // Check if external link
            try {
                const url = new URL(href);
                const currentHost = window.location.hostname;
                
                if (url.hostname !== currentHost && url.protocol.startsWith('http')) {
                    this.track('click', {
                        event_category: 'outbound',
                        event_label: href,
                        transport_type: 'beacon'
                    });
                }
            } catch (error) {
                // Invalid URL, ignore
            }
        });
    }
    
    // Track phone clicks
    trackPhoneClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="tel:"]');
            if (!link) return;
            
            const phoneNumber = link.href.replace('tel:', '');
            const businessCard = link.closest('.business-card');
            const businessId = businessCard?.dataset.businessId;
            
            this.track(this.config.trackingEvents.callBusiness, {
                phone_number: phoneNumber,
                business_id: businessId || 'unknown',
                event_category: 'engagement'
            });
        });
    }
    
    // Track email clicks
    trackEmailClicks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="mailto:"]');
            if (!link) return;
            
            const email = link.href.replace('mailto:', '');
            
            this.track('contact', {
                method: 'email',
                email_address: email,
                event_category: 'engagement'
            });
        });
    }
    
    // Track scroll depth
    trackScrollDepth() {
        const depths = [25, 50, 75, 90, 100];
        let ticking = false;
        
        const checkScrollDepth = () => {
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrolled / height) * 100);
            
            depths.forEach(depth => {
                if (scrollPercent >= depth && !this.scrollDepths.has(depth)) {
                    this.scrollDepths.add(depth);
                    
                    this.track(this.config.trackingEvents.scrollDepth, {
                        percent_scrolled: depth,
                        event_category: 'engagement'
                    });
                }
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(checkScrollDepth);
                ticking = true;
            }
        });
    }
    
    // Track print
    trackPrint() {
        window.addEventListener('beforeprint', () => {
            this.track(this.config.trackingEvents.printPage, {
                page_location: window.location.href,
                event_category: 'engagement'
            });
        });
    }
    
    // Track form interactions
    trackForms() {
        // Track form starts
        document.addEventListener('focusin', (e) => {
            const form = e.target.closest('form');
            if (!form || form.dataset.trackingStarted) return;
            
            form.dataset.trackingStarted = 'true';
            
            const formName = form.dataset.formName || form.className || 'unknown';
            
            this.track('form_start', {
                form_name: formName,
                event_category: 'engagement'
            });
        });
        
        // Track form submissions (via custom event)
        document.addEventListener('formSubmitSuccess', (e) => {
            const form = e.target;
            const formName = form.dataset.formName || form.className || 'unknown';
            
            this.track('form_submit', {
                form_name: formName,
                event_category: 'conversion'
            });
        });
    }
    
    // Track business card interactions
    trackBusinessCards() {
        // Track "Get Quote" clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.js-get-quote')) {
                const businessId = e.target.dataset.businessId;
                const businessCard = e.target.closest('.business-card');
                const businessName = businessCard?.querySelector('.business-name')?.textContent;
                
                this.trackLeadGeneration(businessId, businessName, 'quote_button');
            }
        });
        
        // Track "View Details" clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="/business/"]');
            if (!link || !link.closest('.business-card')) return;
            
            const businessCard = link.closest('.business-card');
            const businessId = businessCard.dataset.businessId;
            const businessName = businessCard.querySelector('.business-name')?.textContent;
            
            this.trackBusinessView(businessId, businessName);
        });
    }
    
    // Track custom timing
    trackTiming(category, variable, value, label) {
        if (!this.isInitialized) return;
        
        window.gtag('event', 'timing_complete', {
            event_category: category,
            name: variable,
            value: Math.round(value),
            event_label: label
        });
    }
    
    // Track exceptions
    trackError(error, fatal = false) {
        if (!this.isInitialized) return;
        
        window.gtag('event', 'exception', {
            description: error.message || error,
            fatal: fatal
        });
    }
}

// Create singleton instance
export const analytics = new Analytics();

// Export initialization function
export function initAnalytics(config = {}) {
    Object.assign(analytics.config, config);
    return analytics;
}

// Export utilities
export const AnalyticsUtils = {
    Analytics,
    trackPageView: () => {
        if (window.gtag) {
            window.gtag('event', 'page_view');
        }
    }
};