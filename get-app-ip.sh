#!/bin/bash

# Script to get DigitalOcean App Platform IP address

echo "🔍 Getting AtticCleaning App Platform Details..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Authenticate if needed
doctl auth init --access-token ${DIGITALOCEAN_TOKEN} 2>/dev/null

# Get app ID
APP_ID=$(doctl apps list --format ID,Spec.Name --no-header | grep "atticcleaning-website" | awk '{print $1}')

if [ -z "$APP_ID" ]; then
    echo "❌ App not found. Please run ./setup-digitalocean.sh first"
    exit 1
fi

echo "✅ Found App ID: $APP_ID"

# Get app details
echo ""
echo "📱 App Platform Details:"
doctl apps get $APP_ID --format LiveURL,DefaultIngress

echo ""
echo "🌐 DNS Configuration:"
echo "========================="
echo "If using A records at your registrar, use this IP:"
doctl apps get $APP_ID --format DefaultIngress --no-header

echo ""
echo "Your app URL will be:"
doctl apps get $APP_ID --format LiveURL --no-header

echo ""
echo "📝 Note: If you're using DigitalOcean nameservers,"
echo "   DNS will be configured automatically."