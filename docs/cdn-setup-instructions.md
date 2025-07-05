# DigitalOcean Spaces CDN Configuration Guide

## Overview
DigitalOcean Spaces CDN provides global content delivery for static assets. This guide covers setting up Spaces CDN for AtticCleaning.com.

## Prerequisites
- DigitalOcean account with billing enabled
- Access to DigitalOcean API token
- Domain verified in DigitalOcean

## Step 1: Create a Space

### Via DigitalOcean Console:
1. Log into https://cloud.digitalocean.com
2. Navigate to **Spaces** → **Create a Space**
3. Configure:
   - **Region:** NYC3 (same as app)
   - **Name:** `atticcleaning-cdn`
   - **File Listing:** Restrict (more secure)
   - **CDN:** Enable CDN
4. Click **Create Space**

### Via Command Line:
```bash
# Using doctl
doctl compute spaces create atticcleaning-cdn \
  --region nyc3 \
  --acl private
```

## Step 2: Configure CORS (Cross-Origin Resource Sharing)

Create `cors-config.xml`:
```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://atticcleaning.com</AllowedOrigin>
    <AllowedOrigin>https://www.atticcleaning.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

Apply CORS configuration:
```bash
# Using s3cmd
s3cmd setcors cors-config.xml s3://atticcleaning-cdn
```

## Step 3: Upload Static Assets

### Directory Structure:
```
atticcleaning-cdn/
├── css/
│   └── styles.css
├── js/
│   └── search.js
├── images/
│   └── (future images)
└── data/
    └── businesses.json
```

### Upload Commands:
```bash
# Install s3cmd if needed
pip install s3cmd

# Configure s3cmd
s3cmd --configure
# Enter your Spaces access key and secret

# Upload assets with proper headers
s3cmd sync ./css/ s3://atticcleaning-cdn/css/ \
  --acl-public \
  --add-header="Cache-Control:public, max-age=31536000" \
  --add-header="Content-Encoding:gzip"

s3cmd sync ./js/ s3://atticcleaning-cdn/js/ \
  --acl-public \
  --add-header="Cache-Control:public, max-age=31536000"

s3cmd sync ./data/ s3://atticcleaning-cdn/data/ \
  --acl-public \
  --add-header="Cache-Control:public, max-age=3600"
```

## Step 4: Configure CDN Settings

### Cache Configuration:
1. In DigitalOcean console, go to your Space
2. Click **Settings** → **CDN**
3. Configure:
   - **TTL:** 1 year for CSS/JS, 1 hour for JSON
   - **Gzip:** Enabled
   - **Custom Domain:** cdn.atticcleaning.com (optional)

### Edge Locations:
DigitalOcean CDN automatically serves from:
- North America: NYC, SFO, TOR
- Europe: AMS, FRA, LON
- Asia: SGP, BLR
- Australia: SYD

## Step 5: Update HTML to Use CDN

Update `index.html`:
```html
<!-- Old: Local CSS -->
<link rel="stylesheet" href="/css/styles.css">

<!-- New: CDN CSS -->
<link rel="stylesheet" href="https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com/css/styles.css">

<!-- Old: Local JS -->
<script async src="/js/search.js"></script>

<!-- New: CDN JS -->
<script async src="https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com/js/search.js"></script>
```

## Step 6: Custom CDN Domain (Optional)

### Add CNAME Record:
```
cdn.atticcleaning.com CNAME atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com
```

### Enable in Spaces:
1. Go to Space settings
2. Add custom subdomain
3. Wait for SSL provisioning

## Step 7: Automation Script

Create `deploy-to-cdn.sh`:
```bash
#!/bin/bash

# Deploy assets to CDN
echo "🚀 Deploying to CDN..."

# CSS files
s3cmd sync ./css/ s3://atticcleaning-cdn/css/ \
  --acl-public \
  --delete-removed \
  --add-header="Cache-Control:public, max-age=31536000, immutable"

# JavaScript files  
s3cmd sync ./js/ s3://atticcleaning-cdn/js/ \
  --acl-public \
  --delete-removed \
  --add-header="Cache-Control:public, max-age=31536000, immutable"

# Data files (shorter cache)
s3cmd sync ./data/ s3://atticcleaning-cdn/data/ \
  --acl-public \
  --delete-removed \
  --add-header="Cache-Control:public, max-age=3600"

# Invalidate CDN cache if needed
echo "✅ CDN deployment complete!"
echo "📍 CDN URL: https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com"
```

## Cost Estimation

### DigitalOcean Spaces CDN Pricing:
- **Storage:** $5/month for 250GB
- **Bandwidth:** $0.01/GB after 1TB free
- **Requests:** Free

### Estimated Monthly Cost:
- Storage: ~$5 (minimal static files)
- Bandwidth: ~$0-5 (depends on traffic)
- **Total:** $5-10/month

## Performance Benefits

1. **Global Distribution:** Content served from nearest edge
2. **Reduced Latency:** ~50ms from any location
3. **Bandwidth Savings:** Offload from main server
4. **Better Caching:** Browser and edge caching
5. **DDoS Protection:** Built-in protection

## Monitoring

### Via DigitalOcean:
1. Spaces dashboard shows bandwidth usage
2. Set up alerts for bandwidth spikes

### Via Analytics:
Track CDN performance in Google Analytics:
- Page load times by geography
- CDN hit rate
- Bandwidth usage

## Important Notes

1. **Cache Busting:** Use versioned filenames (e.g., styles.v2.css) for updates
2. **HTTPS Only:** Always use HTTPS URLs
3. **Costs:** Monitor bandwidth to control costs
4. **Purging:** Can purge entire CDN or specific files via API

## Quick Start Commands

```bash
# 1. Create Space
doctl compute spaces create atticcleaning-cdn --region nyc3

# 2. Upload files
s3cmd sync . s3://atticcleaning-cdn/ --acl-public --recursive

# 3. Test CDN
curl -I https://atticcleaning-cdn.nyc3.cdn.digitaloceanspaces.com/css/styles.css
```

---

**Note:** Since the site already achieves 100/100 PageSpeed without CDN, this is optional for future scaling when traffic increases.