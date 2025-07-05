# Source Tree Structure - AtticCleaning Directory

## Overview

This document describes the source tree organization for the AtticCleaning.com directory platform. The structure is designed for simplicity, maintainability, and optimal static site performance.

## Directory Structure

```
atticcleaning-directory/
├── index.html                    # Homepage
├── 404.html                     # Custom 404 error page
├── robots.txt                   # Search engine directives
├── sitemap.xml                  # XML sitemap for SEO
├── humans.txt                   # Credits and info
│
├── css/                         # Stylesheets
│   ├── styles.css              # Main combined stylesheet
│   ├── base/                   # Base styles
│   │   ├── reset.css          # CSS reset/normalize
│   │   ├── typography.css     # Font and text styles
│   │   └── variables.css      # CSS custom properties
│   ├── components/             # Reusable components
│   │   ├── buttons.css        # Button styles
│   │   ├── forms.css          # Form elements
│   │   ├── cards.css          # Business card styles
│   │   └── modals.css         # Modal dialogs
│   ├── layout/                 # Layout components
│   │   ├── grid.css           # Grid system
│   │   ├── header.css         # Site header
│   │   ├── navigation.css     # Navigation menus
│   │   └── footer.css         # Site footer
│   └── utilities/              # Utility classes
│       ├── helpers.css        # Helper utilities
│       └── responsive.css     # Responsive utilities
│
├── js/                         # JavaScript modules
│   ├── main.js                # Main entry point
│   ├── modules/               # ES6 modules
│   │   ├── search.js         # Search functionality
│   │   ├── api.js            # API integrations
│   │   ├── forms.js          # Form handling
│   │   ├── lazyload.js       # Lazy loading
│   │   ├── analytics.js      # Analytics tracking
│   │   └── maps.js           # Google Maps integration
│   └── vendor/                # Third-party scripts (if any)
│       └── .gitkeep          # Placeholder
│
├── data/                      # Static data files
│   ├── businesses.json       # Business listings data
│   ├── cities.json          # City information
│   └── services.json        # Service categories
│
├── images/                    # Image assets
│   ├── logo/                 # Logo variations
│   │   ├── logo.svg         # Primary logo
│   │   └── favicon.ico      # Favicon
│   ├── hero/                 # Hero images
│   │   ├── home-hero-mobile.webp
│   │   └── home-hero-desktop.webp
│   ├── cities/               # City-specific images
│   │   ├── dallas/
│   │   ├── houston/
│   │   └── austin/
│   └── icons/                # UI icons
│       ├── search.svg
│       ├── phone.svg
│       └── location.svg
│
├── pages/                     # Static HTML pages
│   ├── about.html            # About page
│   ├── contact.html          # Contact page
│   ├── privacy.html          # Privacy policy
│   ├── terms.html            # Terms of service
│   ├── states/               # State landing pages
│   │   ├── index.html       # States directory
│   │   ├── texas.html       # Texas state page
│   │   ├── california.html  # California state page
│   │   └── ...              # Other states
│   └── cities/               # City landing pages
│       ├── index.html       # Cities directory
│       ├── dallas.html      # Dallas city page
│       ├── houston.html     # Houston city page
│       └── ...              # Other cities
│
├── templates/                 # HTML templates
│   ├── partials/             # Reusable HTML parts
│   │   ├── header.html      # Site header
│   │   ├── footer.html      # Site footer
│   │   ├── navigation.html  # Navigation menu
│   │   ├── meta-tags.html   # SEO meta tags
│   │   └── analytics.html   # Analytics code
│   └── layouts/              # Page layouts
│       ├── base.html        # Base layout
│       ├── city-page.html   # City page template
│       └── state-page.html  # State page template
│
├── api/                       # API endpoints (future)
│   └── .gitkeep              # Placeholder
│
├── .do/                       # DigitalOcean config
│   ├── app.yaml              # App Platform config
│   └── deploy.template.yaml  # Deployment template
│
├── scripts/                   # Build/utility scripts
│   ├── generate-sitemap.js   # Sitemap generator
│   ├── optimize-images.sh    # Image optimization
│   └── validate-html.sh      # HTML validation
│
├── docs/                      # Documentation
│   ├── README.md             # Project readme
│   ├── prd.md                # Product requirements
│   ├── architecture.md       # Architecture overview
│   ├── architecture/         # Architecture details
│   │   ├── coding-standards.md
│   │   ├── tech-stack.md
│   │   └── source-tree.md
│   └── stories/              # User stories
│       ├── 1.1.story.md
│       ├── 1.2.story.md
│       └── ...
│
├── tests/                     # Test files (future)
│   └── .gitkeep              # Placeholder
│
├── .github/                   # GitHub config
│   └── workflows/            # GitHub Actions
│       └── deploy.yml        # Deployment workflow
│
├── security/                  # Security configs
│   └── headers.json          # Security headers
│
├── .static                    # DigitalOcean static config
├── .gitignore                # Git ignore file
├── .editorconfig             # Editor configuration
└── package.json              # NPM config (dev tools only)
```

## File Organization Principles

### 1. Flat Structure Where Possible
Keep the directory structure as flat as reasonable to minimize path complexity and improve performance.

### 2. Logical Grouping
Related files are grouped together:
- All CSS in `/css`
- All JavaScript in `/js`
- All static pages in `/pages`
- All data in `/data`

### 3. Clear Naming Conventions
- HTML files: `kebab-case.html`
- CSS files: `kebab-case.css`
- JS files: `kebab-case.js`
- Images: `context-description-size.format`
  - Example: `dallas-hero-mobile.webp`

### 4. Template Organization
Templates are separated from final pages to enable reuse:
- `/templates/partials/` - Small reusable components
- `/templates/layouts/` - Full page layouts
- `/pages/` - Final compiled pages

## Key Files Explained

### Root Files

#### `index.html`
The homepage optimized for "attic cleaning" keyword. Contains:
- Hero section with search
- Featured cities
- Service categories
- Trust signals

#### `404.html`
Custom error page that:
- Maintains site branding
- Provides search functionality
- Suggests popular pages
- Tracks 404s in analytics

#### `robots.txt`
```
User-agent: *
Allow: /
Sitemap: https://atticcleaning.com/sitemap.xml

# Block admin areas (if any)
Disallow: /api/
Disallow: /scripts/
```

#### `.static`
DigitalOcean static site configuration for headers and redirects.

### CSS Organization

#### `css/styles.css`
Main stylesheet that imports all other styles in correct order:
```css
/* Base */
@import 'base/reset.css';
@import 'base/variables.css';
@import 'base/typography.css';

/* Layout */
@import 'layout/grid.css';
@import 'layout/header.css';
@import 'layout/footer.css';

/* Components */
@import 'components/buttons.css';
@import 'components/forms.css';
@import 'components/cards.css';

/* Utilities */
@import 'utilities/helpers.css';
```

### JavaScript Modules

#### `js/main.js`
Entry point that initializes all modules:
```javascript
import { initSearch } from './modules/search.js';
import { initForms } from './modules/forms.js';
import { initLazyLoad } from './modules/lazyload.js';
import { initAnalytics } from './modules/analytics.js';

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    initSearch();
    initForms();
    initLazyLoad();
    initAnalytics();
}
```

### Data Files

#### `data/businesses.json`
Primary business data:
```json
{
  "businesses": [
    {
      "id": "unique-slug",
      "name": "Business Name",
      "location": {...},
      "services": [...],
      "contact": {...}
    }
  ]
}
```

#### `data/cities.json`
City metadata for SEO pages:
```json
{
  "cities": [
    {
      "slug": "dallas",
      "name": "Dallas",
      "state": "TX",
      "metaDescription": "...",
      "content": {...}
    }
  ]
}
```

### Page Organization

#### State Pages (`/pages/states/`)
Landing pages for each state targeting "attic cleaning [state]" keywords.

#### City Pages (`/pages/cities/`)
Landing pages for cities targeting "attic cleaning [city]" keywords.

## Build Process

While we avoid build tools for the code, some tasks benefit from scripts:

### Sitemap Generation
`scripts/generate-sitemap.js` creates sitemap.xml from existing pages.

### Image Optimization
`scripts/optimize-images.sh` compresses images before deployment.

### HTML Validation
`scripts/validate-html.sh` checks all HTML files for errors.

## Development Workflow

### Local Development
1. Edit files directly - no build process
2. Use a simple HTTP server for testing
3. Test on real mobile devices

### Version Control
- Feature branches for new functionality
- Direct commits to main for hotfixes
- Pull requests for review

### Deployment
- Push to main branch
- DigitalOcean automatically deploys
- CDN cache cleared if needed

## Security Considerations

### Sensitive Files
Never commit:
- API keys
- `.env` files
- Database credentials
- Analytics secrets

### Public vs Private
- `/api/` - Future API endpoints (protected)
- `/scripts/` - Build scripts (not deployed)
- `/docs/` - Documentation (not deployed)
- Everything else is public

## Performance Optimizations

### Asset Organization
- Images organized by context and size
- CSS split for easier caching
- JavaScript modules for code splitting

### Critical Path
Essential files for first render:
1. `index.html`
2. `css/styles.css` (critical portion inlined)
3. `js/main.js` (deferred)

### Caching Strategy
- HTML: Cache for 1 hour
- CSS/JS: Cache for 1 year (versioned)
- Images: Cache for 1 month
- Data: Cache for 1 day

## Future Expansion

### Planned Additions
- `/api/` - Serverless functions
- `/tests/` - Automated tests
- `/pwa/` - Progressive Web App files
- More city/state pages

### Scalability
Current structure supports:
- 50+ state pages
- 500+ city pages
- 10,000+ business listings
- Multiple service categories

## Maintenance Guidelines

### Adding New Pages
1. Create HTML file in appropriate directory
2. Update navigation if needed
3. Add to sitemap
4. Test mobile responsiveness
5. Verify SEO tags

### Modifying Styles
1. Edit component CSS file
2. Test across breakpoints
3. Verify no conflicts
4. Check performance impact

### Adding Features
1. Create new JavaScript module
2. Import in main.js
3. Ensure progressive enhancement
4. Add feature detection

## Conclusion

This source tree structure provides:
- Clear organization for maintainability
- Optimal performance with minimal complexity
- Scalability for future growth
- Security through simplicity

The structure supports our core principle: use web standards to build a fast, maintainable directory that ranks #1 for "attic cleaning" searches.