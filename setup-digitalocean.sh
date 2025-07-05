#!/bin/bash

# DigitalOcean Setup Script for AtticCleaning.com
# This script helps set up the infrastructure

echo "🚀 AtticCleaning.com DigitalOcean Setup"
echo "======================================="

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI not found. Please install it first:"
    echo "   brew install doctl (macOS)"
    echo "   Or visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Authenticate with DigitalOcean
echo "🔐 Authenticating with DigitalOcean..."
doctl auth init --access-token ${DIGITALOCEAN_TOKEN}

# Create App Platform app
echo "📱 Creating App Platform application..."
doctl apps create --spec .do/app.yaml

# Create Spaces bucket for CDN
echo "📦 Creating Spaces bucket for CDN..."
doctl spaces create atticcleaning-cdn --region nyc3 --acl public-read

# Enable CDN for the Space
echo "🌐 Enabling CDN..."
# Note: CDN endpoint will be: atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update DNS records to point to DigitalOcean"
echo "2. Configure SSL certificate in App Platform"
echo "3. Upload static files to the repository"
echo "4. Test deployment pipeline"