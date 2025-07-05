# Technology Stack - AtticCleaning Directory

## Overview

This document defines the technology stack for AtticCleaning.com directory platform. Our stack is intentionally minimal, focusing on proven web standards rather than frameworks, to achieve maximum performance and maintainability.

## Core Philosophy

**"Use the platform"** - We leverage native web platform capabilities instead of abstracting them away with frameworks. This approach ensures:
- Zero dependencies to manage
- Maximum performance (no framework overhead)
- Future-proof code that won't break with framework updates
- Easier onboarding for any web developer
- Lower hosting costs

## Technology Stack Summary

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend** | HTML5 | Living Standard | Semantic, accessible markup |
| **Styling** | CSS3 | Living Standard | Modern CSS with custom properties |
| **Scripting** | JavaScript | ES6+ | Native modules, no transpilation |
| **Data Format** | JSON | RFC 8259 | Simple, universal data exchange |
| **Hosting** | DigitalOcean App Platform | Current | Static site hosting with CDN |
| **CDN** | DigitalOcean Spaces CDN | Current | Global edge caching |
| **Analytics** | Google Analytics 4 | Current | Free, comprehensive metrics |
| **Maps** | Google Maps JavaScript API | v3 | Industry standard mapping |
| **Version Control** | Git/GitHub | Current | Source control and CI/CD |

## Frontend Technologies

### HTML5
**Usage**: Structure and content
**Features Used**:
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Form validation attributes (`required`, `pattern`, `type="tel"`)
- Microdata/JSON-LD for structured data
- Progressive enhancement base

**Example**:
```html
<article class="business-card" itemscope itemtype="https://schema.org/LocalBusiness">
    <h2 itemprop="name">ABC Attic Cleaning</h2>
    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="addressLocality">Dallas</span>,
        <span itemprop="addressRegion">TX</span>
    </div>
</article>
```

### CSS3
**Usage**: Styling and layout
**Features Used**:
- CSS Custom Properties for theming
- CSS Grid for layout
- Flexbox for components
- Media queries for responsive design
- CSS animations (sparingly)
- `@supports` for progressive enhancement

**Not Used**:
- CSS preprocessors (Sass, Less)
- CSS-in-JS
- CSS frameworks (Bootstrap, Tailwind)

**Example**:
```css
.business-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

@supports (container-type: inline-size) {
    .business-card {
        container-type: inline-size;
    }
}
```

### JavaScript (ES6+)
**Usage**: Interactivity and enhancements
**Features Used**:
- ES6 Modules
- Async/Await
- Fetch API
- IntersectionObserver
- Service Workers (future PWA)
- Local Storage for caching

**Not Used**:
- Transpilation (Babel)
- Bundlers (Webpack, Vite)
- Framework (React, Vue, Angular)
- jQuery or similar libraries

**Example**:
```javascript
// modules/search.js
export async function searchBusinesses(query) {
    try {
        const response = await fetch('/data/businesses.json');
        const businesses = await response.json();
        return businesses.filter(b => 
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.city.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}
```

## Data Layer

### JSON
**Usage**: Business data storage
**Structure**:
```json
{
    "businesses": [
        {
            "id": "abc-attic-cleaning-dallas",
            "name": "ABC Attic Cleaning",
            "phone": "(214) 555-0123",
            "email": "info@abcattic.com",
            "address": {
                "street": "123 Main St",
                "city": "Dallas",
                "state": "TX",
                "zip": "75201",
                "coordinates": {
                    "lat": 32.7767,
                    "lng": -96.7970
                }
            },
            "services": ["insulation", "rodent-removal", "sanitization"],
            "serviceAreas": ["Dallas", "Fort Worth", "Arlington"],
            "rating": 4.8,
            "reviewCount": 127
        }
    ]
}
```

### Client-Side Storage
- **LocalStorage**: Search preferences, recently viewed
- **SessionStorage**: Temporary form data
- **Cache API**: Static asset caching (future PWA)

## Infrastructure

### DigitalOcean App Platform
**Type**: Static Site Hosting
**Features**:
- Automatic HTTPS/SSL
- Git-based deployments
- Built-in CDN
- Custom domains
- Automatic builds on push

**Configuration** (`.do/app.yaml`):
```yaml
name: atticcleaning-directory
static_sites:
- name: atticcleaning-web
  source_dir: /
  github:
    repo: atticcleaning/directory
    branch: main
    deploy_on_push: true
  routes:
  - path: /
```

### DigitalOcean Spaces CDN
**Usage**: Global content delivery
**Configuration**:
- Origin: DigitalOcean App Platform
- Cache Headers: Aggressive for static assets
- Compression: Gzip/Brotli enabled

## External Services

### Google Analytics 4
**Measurement ID**: G-PT65W6PKKF
**Implementation**: gtag.js
**Events Tracked**:
- Page views
- Search queries
- Business profile views
- Phone number clicks
- Email clicks
- External link clicks

### Google Maps JavaScript API
**Usage**: Business location display
**Implementation**: Lazy-loaded on business pages
**Features**:
- Markers for business locations
- Info windows with business details
- Directions link

### Google Places API (Future)
**Usage**: Business data enrichment
**Implementation**: Server-side proxy to hide API key
**Data Retrieved**:
- Business hours
- Photos
- Reviews
- Updated contact info

## Development Tools

### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting
- **GitHub Actions**: CI/CD pipeline

### Code Quality
- **ESLint**: JavaScript linting (optional)
- **W3C Validators**: HTML/CSS validation
- **Lighthouse**: Performance auditing
- **WAVE**: Accessibility testing

### Testing
- **Manual Testing**: Primary approach
- **BrowserStack**: Cross-browser testing
- **Real Devices**: Mobile testing

## Performance Tools

### Monitoring
- **Google Search Console**: SEO monitoring
- **PageSpeed Insights**: Performance scoring
- **WebPageTest**: Detailed performance analysis
- **Core Web Vitals**: Real user metrics

### Optimization
- **ImageOptim**: Image compression
- **SVGO**: SVG optimization
- **Critical**: Critical CSS extraction
- **PurgeCSS**: Unused CSS removal

## Security Measures

### Headers
```json
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://www.google-analytics.com;
```

## Browser Support

### Target Browsers
- Chrome 90+ (including Android)
- Safari 14+ (including iOS)
- Firefox 88+
- Edge 90+

### Progressive Enhancement
- Core functionality works in all browsers
- Enhanced features for modern browsers
- No polyfills - use native alternatives

## Deployment Pipeline

### Local Development
```bash
# No build step needed!
# Use any local server
python -m http.server 8000
# or
npx serve
```

### Staging
- Branch: `staging`
- URL: `staging-atticcleaning.ondigitalocean.app`
- Purpose: Final testing before production

### Production
- Branch: `main`
- URL: `atticcleaning.com`
- Deployment: Automatic on merge to main

## Cost Analysis

### Monthly Costs
- DigitalOcean App Platform: $0 (Static sites free tier)
- Domain: ~$1/month (annual purchase)
- Google APIs: $0 (within free tier)
- Total: <$5/month

### Scaling Costs
- 10,000 visitors/month: ~$5
- 100,000 visitors/month: ~$20
- 1,000,000 visitors/month: ~$50

## Future Considerations

### Potential Additions (Phase 2)
- Service Worker for offline functionality
- WebP image format with fallbacks
- HTTP/2 Server Push for critical resources
- Edge Functions for API proxying

### Avoided Technologies
These technologies were considered but rejected:
- **React/Vue/Angular**: Unnecessary complexity
- **Node.js Backend**: Static site sufficient
- **Database**: JSON files adequate for <10k listings
- **Build Tools**: Direct file editing preferred
- **TypeScript**: Overhead without benefit at this scale

## Conclusion

Our technology stack is intentionally boring and proven. By using web standards instead of frameworks, we achieve:
- Superior performance (no framework overhead)
- Long-term maintainability (standards don't change rapidly)
- Lower costs (minimal infrastructure needs)
- Easier hiring (any web developer can contribute)

This approach aligns perfectly with our goal of creating a fast, SEO-optimized directory that can be maintained by a solo developer while achieving top search rankings.