#!/bin/bash

# Check DigitalOcean App Status

echo "🔍 Checking AtticCleaning App Status..."
echo ""

# Check DNS resolution
echo "📡 DNS Resolution Check:"
echo "========================"
nslookup atticcleaning.com
echo ""
nslookup www.atticcleaning.com
echo ""

# Check SSL certificate
echo "🔒 SSL Certificate Check:"
echo "========================"
echo "Checking atticcleaning.com..."
openssl s_client -connect atticcleaning.com:443 -servername atticcleaning.com < /dev/null 2>/dev/null | grep -A 2 "subject\|issuer" || echo "SSL certificate not ready yet"
echo ""

echo "Checking www.atticcleaning.com..."
openssl s_client -connect www.atticcleaning.com:443 -servername www.atticcleaning.com < /dev/null 2>/dev/null | grep -A 2 "subject\|issuer" || echo "SSL certificate not ready yet"
echo ""

# Check HTTP status
echo "🌐 HTTP Status Check:"
echo "===================="
echo "Checking HTTP redirect..."
curl -I http://atticcleaning.com 2>/dev/null | head -n 5
echo ""

# Ping test
echo "🏓 Connectivity Check:"
echo "====================="
ping -c 3 atticcleaning.com 2>/dev/null || echo "Ping failed - this is normal if ICMP is blocked"
echo ""

echo "📝 Notes:"
echo "========="
echo "1. SSL certificates can take 15-30 minutes to provision after app creation"
echo "2. If you see 'SSL certificate not ready yet', wait and try again"
echo "3. The app appears to be deployed based on your build logs"
echo "4. Try accessing http://atticcleaning.com (without HTTPS) temporarily"