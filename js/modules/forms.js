/**
 * Forms Module - Handles form validation and submission
 */

import { apiClient } from './api.js';

// Form validation rules
const VALIDATION_RULES = {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s\-\(\)\+]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
    minLength: (value, length) => value.trim().length >= length,
    maxLength: (value, length) => value.trim().length <= length
};

// Form handler class
export class FormHandler {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            validateOnBlur: true,
            validateOnInput: false,
            submitHandler: null,
            ...options
        };
        
        this.fields = {};
        this.errors = {};
        
        this.init();
    }
    
    init() {
        // Prevent default form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Set up field validation
        this.setupFieldValidation();
    }
    
    setupFieldValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const name = input.name;
            if (!name) return;
            
            this.fields[name] = {
                element: input,
                rules: this.getFieldRules(input),
                touched: false
            };
            
            // Blur validation
            if (this.options.validateOnBlur) {
                input.addEventListener('blur', () => {
                    this.fields[name].touched = true;
                    this.validateField(name);
                });
            }
            
            // Input validation
            if (this.options.validateOnInput) {
                input.addEventListener('input', () => {
                    if (this.fields[name].touched) {
                        this.validateField(name);
                    }
                });
            }
        });
    }
    
    getFieldRules(input) {
        const rules = [];
        
        // Required
        if (input.hasAttribute('required')) {
            rules.push({
                type: 'required',
                message: 'This field is required'
            });
        }
        
        // Email
        if (input.type === 'email') {
            rules.push({
                type: 'email',
                message: 'Please enter a valid email address'
            });
        }
        
        // Phone
        if (input.type === 'tel') {
            rules.push({
                type: 'phone',
                message: 'Please enter a valid phone number'
            });
        }
        
        // Min length
        if (input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            rules.push({
                type: 'minLength',
                value: minLength,
                message: `Must be at least ${minLength} characters`
            });
        }
        
        // Max length
        if (input.hasAttribute('maxlength')) {
            const maxLength = parseInt(input.getAttribute('maxlength'));
            rules.push({
                type: 'maxLength',
                value: maxLength,
                message: `Must be no more than ${maxLength} characters`
            });
        }
        
        return rules;
    }
    
    validateField(name) {
        const field = this.fields[name];
        if (!field) return true;
        
        const value = field.element.value;
        const errors = [];
        
        // Check each rule
        field.rules.forEach(rule => {
            const validator = VALIDATION_RULES[rule.type];
            if (validator) {
                const isValid = rule.value !== undefined 
                    ? validator(value, rule.value)
                    : validator(value);
                
                if (!isValid) {
                    errors.push(rule.message);
                }
            }
        });
        
        // Update errors
        if (errors.length > 0) {
            this.errors[name] = errors;
            this.showFieldError(name, errors[0]);
        } else {
            delete this.errors[name];
            this.clearFieldError(name);
        }
        
        return errors.length === 0;
    }
    
    validateAll() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(name => {
            this.fields[name].touched = true;
            if (!this.validateField(name)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFieldError(name, message) {
        const field = this.fields[name];
        if (!field) return;
        
        // Add error class
        field.element.classList.add('error');
        
        // Find or create error message element
        let errorElement = field.element.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message form-help';
            field.element.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(name) {
        const field = this.fields[name];
        if (!field) return;
        
        // Remove error class
        field.element.classList.remove('error');
        
        // Remove error message
        const errorElement = field.element.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async handleSubmit() {
        // Validate all fields
        if (!this.validateAll()) {
            this.focusFirstError();
            return;
        }
        
        // Get form data
        const formData = this.getFormData();
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Call custom submit handler or default
            let result;
            if (this.options.submitHandler) {
                result = await this.options.submitHandler(formData);
            } else {
                result = await this.defaultSubmitHandler(formData);
            }
            
            // Handle success
            this.handleSuccess(result);
        } catch (error) {
            // Handle error
            this.handleError(error);
        } finally {
            // Remove loading state
            this.setLoadingState(false);
        }
    }
    
    getFormData() {
        const formData = {};
        
        Object.keys(this.fields).forEach(name => {
            formData[name] = this.fields[name].element.value;
        });
        
        return formData;
    }
    
    async defaultSubmitHandler(formData) {
        // Default behavior - submit lead
        return await apiClient.submitLead(formData);
    }
    
    handleSuccess(result) {
        // Show success message
        this.showMessage('success', result.message || 'Form submitted successfully!');
        
        // Reset form
        this.form.reset();
        
        // Clear touched state
        Object.keys(this.fields).forEach(name => {
            this.fields[name].touched = false;
        });
        
        // Trigger custom event
        this.form.dispatchEvent(new CustomEvent('formSubmitSuccess', {
            detail: result
        }));
    }
    
    handleError(error) {
        // Show error message
        this.showMessage('error', error.message || 'An error occurred. Please try again.');
        
        // Trigger custom event
        this.form.dispatchEvent(new CustomEvent('formSubmitError', {
            detail: error
        }));
    }
    
    showMessage(type, message) {
        // Find or create message container
        let messageContainer = this.form.querySelector('.form-message');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'form-message';
            this.form.insertBefore(messageContainer, this.form.firstChild);
        }
        
        // Set message
        messageContainer.className = `form-message ${type}`;
        messageContainer.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageContainer.remove();
        }, 5000);
    }
    
    setLoadingState(isLoading) {
        const submitButton = this.form.querySelector('[type="submit"]');
        if (!submitButton) return;
        
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.classList.add('btn-loading');
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('btn-loading');
        }
    }
    
    focusFirstError() {
        const firstErrorField = Object.keys(this.errors)[0];
        if (firstErrorField && this.fields[firstErrorField]) {
            this.fields[firstErrorField].element.focus();
        }
    }
}

// Initialize forms
export function initForms() {
    // Lead capture forms
    const leadForms = document.querySelectorAll('.js-lead-form');
    leadForms.forEach(form => {
        new FormHandler(form, {
            submitHandler: async (formData) => {
                // Add business ID from data attribute
                const businessId = form.dataset.businessId;
                if (businessId) {
                    formData.businessId = businessId;
                }
                
                return await apiClient.submitLead(formData);
            }
        });
    });
    
    // Contact forms
    const contactForms = document.querySelectorAll('.js-contact-form');
    contactForms.forEach(form => {
        new FormHandler(form);
    });
    
    // Newsletter forms
    const newsletterForms = document.querySelectorAll('.js-newsletter-form');
    newsletterForms.forEach(form => {
        new FormHandler(form, {
            submitHandler: async (formData) => {
                // Track newsletter signup
                apiClient.trackEvent('newsletter_signup', {
                    event_category: 'engagement'
                });
                
                return {
                    success: true,
                    message: 'Thank you for subscribing!'
                };
            }
        });
    });
}

// Export form utilities
export const FormUtils = {
    validate: VALIDATION_RULES,
    FormHandler
};