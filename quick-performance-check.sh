#!/bin/bash

echo "🚀 Quick Performance Check for www.atticcleaning.com"
echo "===================================================="

# Test page load time
echo ""
echo "⏱️  Page Load Time Test:"
time curl -s -o /dev/null -w "Connect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://www.atticcleaning.com

# Check response headers
echo ""
echo "📋 Response Headers:"
curl -I https://www.atticcleaning.com 2>/dev/null | grep -E "(HTTP|Content-Type|Content-Encoding|Cache-Control|Server)"

# Check page size
echo ""
echo "📦 Page Size:"
curl -s https://www.atticcleaning.com | wc -c | awk '{print "HTML Size: " $1 " bytes (" int($1/1024) " KB)"}'

# Manual testing links
echo ""
echo "🔗 Manual Performance Testing Links:"
echo "1. PageSpeed Insights (Mobile): https://pagespeed.web.dev/report?url=https://www.atticcleaning.com"
echo "2. GTmetrix: https://gtmetrix.com/"
echo "3. WebPageTest: https://www.webpagetest.org/"
echo ""
echo "⚠️  IMPORTANT: Check the MOBILE tab in PageSpeed Insights for the required 95+ score"