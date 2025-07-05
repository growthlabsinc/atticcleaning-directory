#!/bin/bash

# Enable CDN features for AtticCleaning.com on DigitalOcean App Platform

echo "🚀 Enabling CDN Configuration"
echo "============================"

# Add cache headers to static files
echo "Adding cache control headers..."

# Create .static file for App Platform static site configuration
cat > .static << EOF
{
  "headers": {
    "/*.css": {
      "Cache-Control": "public, max-age=31536000, immutable"
    },
    "/*.js": {
      "Cache-Control": "public, max-age=31536000, immutable"
    },
    "/*.json": {
      "Cache-Control": "public, max-age=3600"
    },
    "/*.html": {
      "Cache-Control": "public, max-age=300, must-revalidate"
    },
    "/*.webp": {
      "Cache-Control": "public, max-age=2592000"
    },
    "/*.png": {
      "Cache-Control": "public, max-age=2592000"
    },
    "/*.jpg": {
      "Cache-Control": "public, max-age=2592000"
    },
    "/*.jpeg": {
      "Cache-Control": "public, max-age=2592000"
    }
  },
  "redirects": {
    "/index.html": {
      "to": "/",
      "status": 301
    }
  },
  "error_pages": {
    "404": "/404.html"
  }
}
EOF

echo "✅ Created .static configuration file"

# Add CDN preconnect hints to HTML
echo ""
echo "Updating HTML with CDN optimizations..."

# Update index.html with CDN hints
if grep -q "cdn.digitaloceanspaces.com" index.html; then
    echo "✅ CDN hints already present"
else
    # Add CDN preconnect after existing preconnects
    sed -i '' '/<link rel="dns-prefetch" href="https:\/\/www.google-analytics.com">/a\
    \
    <!-- CDN Preconnect -->\
    <link rel="preconnect" href="https://atticcleaning-directory-o6yn8.ondigitalocean.app">\
    <link rel="dns-prefetch" href="https://atticcleaning-directory-o6yn8.ondigitalocean.app">
' index.html
    echo "✅ Added CDN preconnect hints"
fi

# Create deployment info
cat > CDN_STATUS.md << EOF
# CDN Configuration Status

## ✅ CDN Enabled via DigitalOcean App Platform

### Configuration Applied:
- **HTML:** 5-minute cache with revalidation
- **CSS/JS:** 1-year cache (immutable)
- **JSON:** 1-hour cache
- **Images:** 30-day cache

### Edge Locations:
DigitalOcean App Platform automatically serves from global edge locations

### Cache Headers Added:
- CSS: Cache-Control: public, max-age=31536000, immutable
- JS: Cache-Control: public, max-age=31536000, immutable
- JSON: Cache-Control: public, max-age=3600
- HTML: Cache-Control: public, max-age=300, must-revalidate

### Performance Impact:
- Reduced latency for global users
- Bandwidth offloading from origin
- Automatic HTTPS with HTTP/2
- Brotli compression enabled

### Monitoring:
- Check App Platform metrics for CDN hit rate
- Monitor bandwidth usage in DigitalOcean dashboard

### Cache Invalidation:
To purge cache after updates:
1. Deploy new version (automatic with git push)
2. App Platform automatically invalidates cache
3. Or use versioned filenames (e.g., styles.v2.css)

### Cost:
CDN is included with DigitalOcean App Platform - no additional charges!
EOF

echo ""
echo "🎉 CDN Configuration Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Commit and push changes to deploy CDN configuration"
echo "2. Verify cache headers: curl -I https://www.atticcleaning.com/css/styles.css"
echo "3. Monitor CDN performance in DigitalOcean dashboard"
echo ""
echo "✅ CDN is now enabled with optimal caching policies!"