# Coding Standards - AtticCleaning Directory

## Overview

This document defines the coding standards for the AtticCleaning.com directory platform. Given our zero-dependency, pure HTML/CSS/JavaScript approach, these standards emphasize simplicity, performance, and maintainability.

## Core Principles

1. **Zero Dependencies**: No frameworks, libraries, or build tools
2. **Mobile-First**: Every decision prioritizes mobile performance
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Performance Obsessed**: Every byte counts toward our 95+ PageSpeed score
5. **SEO-Driven**: Code structure supports search engine optimization

## HTML Standards

### Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - AtticCleaning.com</title>
    <!-- Critical CSS inline -->
    <style>/* Critical styles here */</style>
    <!-- Non-critical CSS deferred -->
    <link rel="preload" href="/css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/styles.css"></noscript>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

### Semantic HTML
- Use HTML5 semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy: Only one `<h1>` per page, sequential `<h2>`, `<h3>`, etc.
- Descriptive `alt` attributes for all images
- ARIA labels where semantic HTML isn't sufficient

### SEO Requirements
- Unique, descriptive `<title>` tags (50-60 characters)
- Meta descriptions (150-160 characters)
- Open Graph and Twitter Card meta tags
- Structured data using JSON-LD

### Performance Rules
- Minimize HTML - no unnecessary whitespace or comments in production
- Inline critical CSS in `<head>`
- Defer non-critical CSS and JavaScript
- Use `loading="lazy"` for below-fold images
- Preconnect to external domains

## CSS Standards

### File Organization
```
css/
├── base/
│   ├── reset.css      # Minimal reset/normalize
│   ├── typography.css # Font definitions
│   └── variables.css  # CSS custom properties
├── components/
│   ├── buttons.css    # Button styles
│   ├── forms.css      # Form elements
│   └── cards.css      # Card components
├── layout/
│   ├── grid.css       # Grid system
│   ├── header.css     # Header styles
│   └── footer.css     # Footer styles
└── utilities/
    └── helpers.css    # Utility classes
```

### Mobile-First Approach
```css
/* Mobile styles (default) */
.element {
    padding: 1rem;
    font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .element {
        padding: 1.5rem;
        font-size: 1.125rem;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .element {
        padding: 2rem;
        font-size: 1.25rem;
    }
}
```

### CSS Custom Properties
```css
:root {
    /* Colors */
    --color-primary: #2c5282;
    --color-secondary: #3182ce;
    --color-text: #2d3748;
    --color-background: #ffffff;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --spacing-xl: 4rem;
    
    /* Typography */
    --font-family: system-ui, -apple-system, sans-serif;
    --line-height: 1.5;
}
```

### Performance Guidelines
- Use CSS custom properties for repeated values
- Minimize specificity - prefer classes over IDs
- Avoid `!important` except for utility classes
- Group media queries at component level
- Use shorthand properties where appropriate
- Minimize CSS file size - combine similar rules

### Naming Conventions
- Use BEM methodology for components: `.block__element--modifier`
- Utility classes: `.u-text-center`, `.u-mt-1`
- State classes: `.is-active`, `.has-error`
- JavaScript hooks: `.js-toggle` (never style these)

## JavaScript Standards

### ES6 Modules
```javascript
// modules/search.js
export class Search {
    constructor(options) {
        this.options = options;
        this.init();
    }
    
    init() {
        // Implementation
    }
}

// main.js
import { Search } from './modules/search.js';
```

### Progressive Enhancement
```javascript
// Check for feature support
if ('IntersectionObserver' in window) {
    // Use IntersectionObserver for lazy loading
} else {
    // Fallback for older browsers
}

// Ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

### Performance Patterns
```javascript
// Debounce for search input
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

// Lazy loading for images
const lazyImages = document.querySelectorAll('img[data-src]');
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
lazyImages.forEach(img => imageObserver.observe(img));
```

### Event Handling
```javascript
// Use event delegation for dynamic content
document.addEventListener('click', (e) => {
    if (e.target.matches('.js-search-trigger')) {
        handleSearch(e);
    }
});

// Remove event listeners when not needed
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Later: controller.abort();
```

### Error Handling
```javascript
try {
    const response = await fetch('/api/businesses');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.error('Error fetching businesses:', error);
    // Graceful fallback
    return [];
}
```

### Code Style
- Use `const` and `let`, never `var`
- Prefer arrow functions for callbacks
- Use template literals for string concatenation
- Destructure objects and arrays where appropriate
- Always use strict equality (`===`)
- Add JSDoc comments for functions

## File Naming

- HTML files: `kebab-case.html`
- CSS files: `kebab-case.css`
- JavaScript files: `kebab-case.js`
- Images: `descriptive-name-size.webp` (e.g., `dallas-hero-mobile.webp`)

## Comments

### HTML Comments
```html
<!-- Section: Hero Banner -->
<section class="hero">
    <!-- Content -->
</section>
<!-- End Section: Hero Banner -->
```

### CSS Comments
```css
/* ==========================================================================
   Component: Search Form
   ========================================================================== */

/* Search input styles */
.search-form__input {
    /* ... */
}
```

### JavaScript Comments
```javascript
/**
 * Initializes the search functionality
 * @param {Object} options - Configuration options
 * @param {string} options.selector - DOM selector for search input
 * @param {number} options.debounceTime - Debounce delay in ms
 */
function initSearch(options) {
    // Implementation
}
```

## Testing Requirements

### HTML Validation
- All pages must pass W3C HTML validator
- No errors, warnings should be justified

### CSS Validation
- Must pass W3C CSS validator
- Custom properties are allowed

### JavaScript Linting
- Use ESLint with ES6 configuration
- No console.log in production code
- No unused variables

### Performance Testing
- PageSpeed Insights: 95+ mobile score
- WebPageTest: First Contentful Paint < 1.5s
- Total page weight < 100KB (excluding images)

## Security Guidelines

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://www.google-analytics.com;
">
```

### Input Sanitization
```javascript
// Always sanitize user input
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
```

### HTTPS Only
- All resources must be loaded over HTTPS
- No mixed content warnings

## Accessibility Standards

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements
- Focus indicators visible
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Skip navigation links
- Form labels and error messages

## Version Control

### Commit Messages
```
feat: Add city landing page template
fix: Correct mobile navigation toggle
style: Format CSS according to standards
docs: Update coding standards
perf: Optimize image loading
```

### Branch Naming
- `feature/description`
- `fix/issue-description`
- `docs/what-updated`

## Performance Budget

- HTML: < 14KB per page
- CSS: < 50KB total (< 14KB critical)
- JavaScript: < 30KB total
- Images: < 200KB per image (optimized)
- Web fonts: 0KB (system fonts only)
- Total page weight: < 100KB (excluding images)

## Review Checklist

Before any code is merged:
- [ ] Passes HTML validation
- [ ] Passes CSS validation
- [ ] No JavaScript errors
- [ ] PageSpeed score 95+
- [ ] Accessibility audit passed
- [ ] Security headers configured
- [ ] Mobile tested on real devices
- [ ] Cross-browser tested