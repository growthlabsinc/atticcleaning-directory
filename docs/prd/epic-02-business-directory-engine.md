# Epic 2: Business Directory Engine

## Overview

Create the core directory functionality enabling users to search for attic cleaning businesses by location and service type. This epic delivers a functional business listing system using static JSON data with client-side search capabilities, laying the foundation for comprehensive directory features and user engagement.

## Business Value

- Enable users to find attic cleaning services
- Create foundation for business listings
- Establish search and filtering capabilities
- Provide value to both homeowners and businesses
- Generate organic traffic through business profiles

## Success Criteria

- Functional search by location (city, state, ZIP)
- Service type filtering with multiple selections
- Business profiles accessible via direct URLs
- Mobile-responsive search interface
- Sub-100ms search response time
- Zero server dependencies (client-side only)

## Technical Approach

- **Data Storage**: Static JSON files in Git repository
- **Search**: Client-side JavaScript with pre-built index
- **Filtering**: Real-time DOM manipulation
- **Performance**: LocalStorage caching for search data
- **SEO**: Individual HTML pages for each business

## User Stories

### Story 2.1: Business Listing Data Structure

**As a** platform administrator  
**I want** JSON data structure for storing business listings  
**So that** attic cleaning companies can be organized and displayed to users effectively

**Acceptance Criteria:**
1. JSON schema supports business name, address, phone, email, and website fields
2. Service categories array allows multiple selections (insulation, pest control, mold remediation, air duct cleaning)
3. Geographic data fields support state, city, latitude/longitude, and service radius information
4. Business status field enables active/inactive listing management
5. Manual JSON file editing workflow allows business listing creation and management

**Technical Requirements:**
- Schema validation for data integrity
- Unique ID generation system
- Coordinate validation for mapping
- Phone number formatting consistency

### Story 2.2: Location-Based Search Functionality

**As a** homeowner  
**I want to** search for attic cleaning services by my location  
**So that** I can find qualified professionals in my area quickly

**Acceptance Criteria:**
1. JavaScript search form accepts city, state, or ZIP code input for location targeting
2. Client-side algorithm calculates distance and displays businesses within specified radius
3. Results show business name, location, primary services, and contact information
4. Search functionality works on both desktop and mobile devices without server dependency
5. No results message provides helpful guidance when no businesses match search criteria

**Technical Requirements:**
- Fuzzy matching for city names
- ZIP code to coordinate mapping
- Distance calculation using Haversine formula
- Search results caching
- Mobile-optimized search UI

### Story 2.3: Service Type Filtering

**As a** homeowner  
**I want to** filter businesses by specific attic services  
**So that** I can find specialists for my particular attic problems

**Acceptance Criteria:**
1. JavaScript filter options include insulation services, pest/rodent control, mold remediation, and air duct cleaning
2. Multiple service filters can be selected simultaneously using client-side logic
3. Filter results update dynamically without page reload using DOM manipulation
4. Filter selections are clearly indicated in search results with visual feedback
5. Clear filters option resets all active filters and refreshes display

**Technical Requirements:**
- Checkbox UI for multiple selections
- AND/OR logic for filter combinations
- Visual indication of active filters
- Filter state persistence in URL
- Accessibility compliance for filters

### Story 2.4: Basic Business Profile Display

**As a** homeowner  
**I want to** view basic business information and contact details  
**So that** I can evaluate and contact attic cleaning professionals

**Acceptance Criteria:**
1. Business profile page displays company name, address, phone number, and website
2. Services offered are clearly listed with brief descriptions
3. Service area coverage is displayed (cities or radius served)
4. Contact information includes clickable phone numbers and email links
5. Business profile pages are accessible via direct URLs for SEO purposes

**Technical Requirements:**
- SEO-friendly URLs (/business/company-name-city)
- Schema.org LocalBusiness markup
- Click tracking for analytics
- Mobile-optimized layout
- Print-friendly styling

## Dependencies

- Story 1.2: Static Site Foundation (HTML/CSS structure)
- Story 1.3: Directory Site Structure (navigation)
- Business data collection process
- Service category definitions

## Data Schema

```json
{
  "businesses": [
    {
      "id": "abc-attic-cleaning-dallas",
      "name": "ABC Attic Cleaning",
      "slug": "abc-attic-cleaning",
      "status": "active",
      "contact": {
        "phone": "(214) 555-0123",
        "email": "info@abcattic.com",
        "website": "https://abcattic.com"
      },
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
      "services": [
        "insulation",
        "rodent-removal",
        "mold-remediation",
        "air-duct-cleaning"
      ],
      "serviceAreas": {
        "cities": ["Dallas", "Fort Worth", "Arlington"],
        "radius": 30,
        "counties": ["Dallas County", "Tarrant County"]
      },
      "businessInfo": {
        "yearsInBusiness": 15,
        "license": "TACLA12345",
        "insured": true,
        "employees": "10-50"
      },
      "rating": {
        "average": 4.8,
        "count": 127,
        "source": "google"
      }
    }
  ]
}
```

## Search Algorithm

### Location Search
1. Parse user input (city, state, ZIP)
2. Geocode if necessary (using static lookup)
3. Calculate distance to all businesses
4. Filter by service radius
5. Sort by distance
6. Display results

### Performance Optimization
- Pre-build search index on page load
- Cache in LocalStorage
- Use Web Workers for heavy calculations
- Virtual scrolling for large result sets

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Large dataset performance | High | Medium | Implement pagination and lazy loading |
| Search accuracy issues | Medium | Medium | Implement fuzzy matching and suggestions |
| Data maintenance burden | Medium | High | Create admin tools for JSON editing |
| Mobile performance | High | Low | Optimize search algorithm for mobile |

## Definition of Done

- [ ] All stories complete and tested
- [ ] Search returns results in <100ms
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed
- [ ] Accessibility audit passed
- [ ] SEO implementation verified
- [ ] Documentation updated
- [ ] Performance benchmarks met

## Metrics

- Search Response Time: <100ms
- Results Accuracy: 95%+
- Mobile Usability Score: 100
- Zero JavaScript Errors
- Search Conversion Rate: Track

## Timeline

- Story 2.1: 2-3 days
- Story 2.2: 3-4 days
- Story 2.3: 2-3 days
- Story 2.4: 2-3 days
- **Total**: 9-13 days

## Future Enhancements

- Advanced search filters
- Business claiming/verification
- Review integration
- Favorite businesses
- Search history
- Location autocomplete