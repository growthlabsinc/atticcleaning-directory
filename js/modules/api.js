/**
 * API Module - Handles API integrations (Google Maps, Places, etc.)
 */

// API configuration
const API_CONFIG = {
    googleMaps: {
        apiKey: 'AIzaSyA0avFG5U5_eVK-Aw9Nsnl8HfyYJcyjEWM', // Google Maps API key
        libraries: ['places', 'geometry'],
        region: 'US',
        language: 'en'
    }
};

// Google Maps loader
export class MapsLoader {
    constructor() {
        this.isLoaded = false;
        this.loadPromise = null;
    }
    
    async load(apiKey) {
        if (this.isLoaded) {
            return window.google;
        }
        
        if (this.loadPromise) {
            return this.loadPromise;
        }
        
        this.loadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${API_CONFIG.googleMaps.libraries.join(',')}&region=${API_CONFIG.googleMaps.region}&language=${API_CONFIG.googleMaps.language}`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                this.isLoaded = true;
                resolve(window.google);
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Maps'));
            };
            
            document.head.appendChild(script);
        });
        
        return this.loadPromise;
    }
}

// API client class
export class APIClient {
    constructor(config = {}) {
        this.config = { ...API_CONFIG, ...config };
        this.mapsLoader = new MapsLoader();
    }
    
    // Load Google Maps
    async loadGoogleMaps() {
        if (!this.config.googleMaps.apiKey) {
            console.error('Google Maps API key not configured');
            return null;
        }
        
        try {
            return await this.mapsLoader.load(this.config.googleMaps.apiKey);
        } catch (error) {
            console.error('Error loading Google Maps:', error);
            return null;
        }
    }
    
    // Create a map instance
    async createMap(element, options = {}) {
        const google = await this.loadGoogleMaps();
        if (!google) return null;
        
        const defaultOptions = {
            center: { lat: 32.7767, lng: -96.7970 }, // Dallas, TX
            zoom: 10,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true
        };
        
        return new google.maps.Map(element, { ...defaultOptions, ...options });
    }
    
    // Add marker to map
    async addMarker(map, position, options = {}) {
        const google = await this.loadGoogleMaps();
        if (!google || !map) return null;
        
        const defaultOptions = {
            position,
            map,
            animation: google.maps.Animation.DROP
        };
        
        return new google.maps.Marker({ ...defaultOptions, ...options });
    }
    
    // Create info window
    async createInfoWindow(content, options = {}) {
        const google = await this.loadGoogleMaps();
        if (!google) return null;
        
        return new google.maps.InfoWindow({
            content,
            ...options
        });
    }
    
    // Geocode address
    async geocodeAddress(address) {
        const google = await this.loadGoogleMaps();
        if (!google) return null;
        
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng(),
                        formatted_address: results[0].formatted_address,
                        place_id: results[0].place_id
                    });
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    }
    
    // Get directions URL
    getDirectionsURL(destination, origin = null) {
        const baseURL = 'https://www.google.com/maps/dir/';
        const params = [];
        
        if (origin) {
            params.push(encodeURIComponent(origin));
        }
        
        params.push(encodeURIComponent(destination));
        
        return baseURL + params.join('/');
    }
    
    // Fetch business data from local JSON (placeholder for future API)
    async fetchBusinessData(businessId) {
        try {
            const response = await fetch('/data/businesses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const business = data.businesses.find(b => b.id === businessId);
            
            if (!business) {
                throw new Error('Business not found');
            }
            
            return business;
        } catch (error) {
            console.error('Error fetching business data:', error);
            throw error;
        }
    }
    
    // Submit lead form (placeholder for future implementation)
    async submitLead(formData) {
        // Validate form data
        const requiredFields = ['name', 'email', 'phone', 'businessId'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // In production, this would send to a real API endpoint
        // For now, we'll simulate a successful submission
        console.log('Lead submission:', formData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Track in analytics
        if (window.gtag) {
            window.gtag('event', 'generate_lead', {
                event_category: 'engagement',
                event_label: formData.businessId,
                value: 1
            });
        }
        
        return {
            success: true,
            message: 'Your request has been submitted successfully!'
        };
    }
    
    // Track analytics event
    trackEvent(eventName, parameters = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }
    }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export initialization function
export function initAPI(config = {}) {
    Object.assign(apiClient.config, config);
    return apiClient;
}