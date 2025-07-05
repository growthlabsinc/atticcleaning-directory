/**
 * Search Module - Handles business search functionality
 */

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search class
export class Search {
    constructor(options = {}) {
        this.options = {
            searchInputSelector: '.js-search-input',
            searchFormSelector: '.js-search-form',
            resultsContainerSelector: '.js-business-grid',
            debounceTime: 300,
            minSearchLength: 2,
            ...options
        };
        
        this.businessData = null;
        this.init();
    }
    
    async init() {
        // Load business data
        await this.loadBusinessData();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    async loadBusinessData() {
        try {
            const response = await fetch('/data/businesses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.businessData = data.businesses || [];
        } catch (error) {
            console.error('Error loading business data:', error);
            this.businessData = [];
        }
    }
    
    setupEventListeners() {
        // Search input listeners
        const searchInputs = document.querySelectorAll(this.options.searchInputSelector);
        searchInputs.forEach(input => {
            input.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, this.options.debounceTime));
        });
        
        // Form submit listeners
        const searchForms = document.querySelectorAll(this.options.searchFormSelector);
        searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector(this.options.searchInputSelector);
                if (input) {
                    this.handleSearch(input.value);
                }
            });
        });
    }
    
    handleSearch(query) {
        query = query.trim().toLowerCase();
        
        if (query.length < this.options.minSearchLength) {
            this.displayAllBusinesses();
            return;
        }
        
        const results = this.searchBusinesses(query);
        this.displayResults(results);
    }
    
    searchBusinesses(query) {
        if (!this.businessData || !Array.isArray(this.businessData)) {
            return [];
        }
        
        return this.businessData.filter(business => {
            // Search in business name
            if (business.name && business.name.toLowerCase().includes(query)) {
                return true;
            }
            
            // Search in city
            if (business.address?.city && business.address.city.toLowerCase().includes(query)) {
                return true;
            }
            
            // Search in services
            if (business.services && Array.isArray(business.services)) {
                return business.services.some(service => 
                    service.toLowerCase().includes(query)
                );
            }
            
            // Search in service areas
            if (business.serviceAreas && Array.isArray(business.serviceAreas)) {
                return business.serviceAreas.some(area => 
                    area.toLowerCase().includes(query)
                );
            }
            
            // Search in ZIP code
            if (business.address?.zip && business.address.zip.includes(query)) {
                return true;
            }
            
            return false;
        });
    }
    
    displayResults(results) {
        const container = document.querySelector(this.options.resultsContainerSelector);
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }
        
        const resultsHTML = results.map(business => 
            this.getBusinessCardHTML(business)
        ).join('');
        
        container.innerHTML = resultsHTML;
        
        // Trigger custom event for results update
        container.dispatchEvent(new CustomEvent('searchResultsUpdated', {
            detail: { results, query: this.currentQuery }
        }));
    }
    
    displayAllBusinesses() {
        const container = document.querySelector(this.options.resultsContainerSelector);
        if (!container || !this.businessData) return;
        
        const html = this.businessData.map(business => 
            this.getBusinessCardHTML(business)
        ).join('');
        
        container.innerHTML = html;
    }
    
    getBusinessCardHTML(business) {
        const { id, name, phone, email, address, services, rating, reviewCount } = business;
        const stars = this.getStarsHTML(rating);
        const serviceTags = services ? services.map(service => 
            `<span class="service-tag">${service}</span>`
        ).join('') : '';
        
        return `
            <article class="business-card" data-business-id="${id}">
                <div class="card-header">
                    <h3 class="business-name">
                        <a href="/business/${id}">${this.escapeHTML(name)}</a>
                    </h3>
                    <div class="business-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-text">${rating} (${reviewCount} reviews)</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="business-info">
                        ${address ? `
                            <div class="info-item">
                                <svg class="icon icon-location" width="16" height="16">
                                    <use href="/images/icons/location.svg#location"></use>
                                </svg>
                                <span>${this.escapeHTML(address.city)}, ${address.state}</span>
                            </div>
                        ` : ''}
                        
                        ${phone ? `
                            <div class="info-item">
                                <svg class="icon icon-phone" width="16" height="16">
                                    <use href="/images/icons/phone.svg#phone"></use>
                                </svg>
                                <a href="tel:${phone}">${this.escapeHTML(phone)}</a>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${serviceTags ? `
                        <div class="services-tags">
                            ${serviceTags}
                        </div>
                    ` : ''}
                </div>
                
                <div class="card-footer">
                    <div class="card-action">
                        <button class="btn btn-primary js-get-quote" data-business-id="${id}">
                            Get Quote
                        </button>
                    </div>
                    <div class="card-action">
                        <a href="/business/${id}" class="btn btn-outline">
                            View Details
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);
        
        let html = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += '<svg class="star" width="16" height="16"><use href="/images/icons/star.svg#star-full"></use></svg>';
        }
        
        // Half star
        if (hasHalfStar) {
            html += '<svg class="star" width="16" height="16"><use href="/images/icons/star.svg#star-half"></use></svg>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<svg class="star empty" width="16" height="16"><use href="/images/icons/star.svg#star-empty"></use></svg>';
        }
        
        return html;
    }
    
    getNoResultsHTML() {
        return `
            <div class="no-results">
                <h3>No businesses found</h3>
                <p>Try adjusting your search terms or browse by location.</p>
            </div>
        `;
    }
    
    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// Export initialization function
export function initSearch(options) {
    return new Search(options);
}