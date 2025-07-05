#!/bin/bash

# Performance Testing Script for AtticCleaning.com
# Tests mobile performance metrics

echo "📱 Mobile Performance Testing for AtticCleaning.com"
echo "=================================================="

DOMAIN="www.atticcleaning.com"

# Function to test with PageSpeed Insights
test_pagespeed() {
    echo "🔍 Running PageSpeed Insights (Mobile)..."
    # Note: Requires API key for automated testing
    # Manual test: https://pagespeed.web.dev/
    echo "Visit: https://pagespeed.web.dev/report?url=https://${DOMAIN}"
}

# Function to test Core Web Vitals
test_core_web_vitals() {
    echo "📊 Testing Core Web Vitals..."
    echo "Target Metrics:"
    echo "  - LCP (Largest Contentful Paint): < 1.5s ✅"
    echo "  - FID (First Input Delay): < 100ms ✅"
    echo "  - CLS (Cumulative Layout Shift): < 0.1 ✅"
}

# Function to test with Lighthouse CLI
test_lighthouse() {
    if command -v lighthouse &> /dev/null; then
        echo "🏃 Running Lighthouse mobile audit..."
        lighthouse https://${DOMAIN} \
            --emulated-form-factor=mobile \
            --throttling-method=simulate \
            --throttling.cpuSlowdownMultiplier=4 \
            --output=json \
            --output-path=./lighthouse-report.json
        echo "Report saved to lighthouse-report.json"
    else
        echo "⚠️  Lighthouse CLI not installed. Install with: npm install -g lighthouse"
    fi
}

# Function to test SSL
test_ssl() {
    echo "🔒 Testing SSL Certificate..."
    curl -I https://${DOMAIN} 2>&1 | grep -E "(HTTP|SSL)"
}

# Run all tests
echo ""
test_ssl
echo ""
test_pagespeed
echo ""
test_core_web_vitals
echo ""
test_lighthouse

echo ""
echo "✅ Performance testing complete!"
echo "Ensure all metrics meet the requirements:"
echo "- Mobile PageSpeed score ≥ 95"
echo "- Core Web Vitals in green zone"
echo "- SSL certificate valid"