#!/bin/bash

# DigitalOcean Spaces CDN Setup Script
# This script automates CDN configuration for AtticCleaning.com

set -e

echo "🚀 DigitalOcean Spaces CDN Setup"
echo "================================"

# Check for required tools
check_requirements() {
    echo "Checking requirements..."
    
    if ! command -v doctl &> /dev/null; then
        echo "❌ doctl not found. Install with: brew install doctl"
        exit 1
    fi
    
    if ! command -v s3cmd &> /dev/null; then
        echo "❌ s3cmd not found. Install with: pip install s3cmd"
        exit 1
    fi
    
    echo "✅ All requirements met"
}

# Create Space
create_space() {
    echo ""
    echo "Creating Spaces bucket..."
    
    if doctl compute spaces list | grep -q "atticcleaning-cdn"; then
        echo "✅ Space 'atticcleaning-cdn' already exists"
    else
        doctl compute spaces create atticcleaning-cdn \
            --region nyc3 \
            --acl private
        echo "✅ Space created successfully"
    fi
}

# Configure CORS
setup_cors() {
    echo ""
    echo "Configuring CORS..."
    
    cat > /tmp/cors-config.xml << EOF
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://atticcleaning.com</AllowedOrigin>
    <AllowedOrigin>https://www.atticcleaning.com</AllowedOrigin>
    <AllowedOrigin>http://localhost:*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
EOF
    
    s3cmd setcors /tmp/cors-config.xml s3://atticcleaning-cdn
    rm /tmp/cors-config.xml
    echo "✅ CORS configured"
}

# Upload assets
upload_assets() {
    echo ""
    echo "Uploading assets to CDN..."
    
    # CSS files with aggressive caching
    if [ -d "./css" ]; then
        s3cmd sync ./css/ s3://atticcleaning-cdn/css/ \
            --acl-public \
            --add-header="Cache-Control:public, max-age=31536000, immutable" \
            --add-header="Content-Type:text/css" \
            --exclude="*.map"
        echo "✅ CSS files uploaded"
    fi
    
    # JavaScript files
    if [ -d "./js" ]; then
        s3cmd sync ./js/ s3://atticcleaning-cdn/js/ \
            --acl-public \
            --add-header="Cache-Control:public, max-age=31536000, immutable" \
            --add-header="Content-Type:application/javascript" \
            --exclude="*.map"
        echo "✅ JS files uploaded"
    fi
    
    # Data files with shorter cache
    if [ -d "./data" ]; then
        s3cmd sync ./data/ s3://atticcleaning-cdn/data/ \
            --acl-public \
            --add-header="Cache-Control:public, max-age=3600" \
            --add-header="Content-Type:application/json"
        echo "✅ Data files uploaded"
    fi
    
    # Images (when added)
    if [ -d "./images" ]; then
        s3cmd sync ./images/ s3://atticcleaning-cdn/images/ \
            --acl-public \
            --add-header="Cache-Control:public, max-age=2592000" \
            --exclude=".DS_Store"
        echo "✅ Images uploaded"
    fi
}

# Update HTML files
update_html() {
    echo ""
    echo "Updating HTML to use CDN..."
    
    CDN_URL="https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com"
    
    # Create CDN-enabled versions
    cp index.html index-cdn.html
    cp 404.html 404-cdn.html
    
    # Update URLs in HTML files
    sed -i '' "s|href=\"/css/|href=\"${CDN_URL}/css/|g" index-cdn.html
    sed -i '' "s|src=\"/js/|src=\"${CDN_URL}/js/|g" index-cdn.html
    sed -i '' "s|href=\"/css/|href=\"${CDN_URL}/css/|g" 404-cdn.html
    
    echo "✅ Created CDN-enabled HTML files:"
    echo "   - index-cdn.html"
    echo "   - 404-cdn.html"
}

# Main execution
main() {
    check_requirements
    
    # Load environment variables
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Authenticate with DigitalOcean
    doctl auth init --access-token ${DIGITALOCEAN_TOKEN} 2>/dev/null || true
    
    # Configure s3cmd if not already done
    if [ ! -f ~/.s3cfg ]; then
        echo ""
        echo "⚠️  s3cmd not configured. Please run: s3cmd --configure"
        echo "Use your DigitalOcean Spaces access keys"
        exit 1
    fi
    
    create_space
    setup_cors
    upload_assets
    update_html
    
    echo ""
    echo "🎉 CDN Setup Complete!"
    echo "======================"
    echo "CDN URL: https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com"
    echo ""
    echo "Next steps:"
    echo "1. Test CDN URLs in browser"
    echo "2. Update production HTML to use CDN URLs"
    echo "3. Monitor bandwidth usage in DigitalOcean console"
    echo ""
    echo "To deploy updates: ./deploy-to-cdn.sh"
}

# Run main function
main