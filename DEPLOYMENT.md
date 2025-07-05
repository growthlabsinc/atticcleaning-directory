# AtticCleaning.com Deployment Guide

## Prerequisites

1. **Domain**: atticcleaning.com (to be registered)
2. **DigitalOcean Account**: With billing configured
3. **GitHub Repository**: For version control and deployment
4. **doctl CLI**: DigitalOcean command-line tool

## Initial Setup Steps

### 1. Domain Registration
- Register atticcleaning.com through your preferred registrar
- Point nameservers to DigitalOcean:
  - ns1.digitalocean.com
  - ns2.digitalocean.com
  - ns3.digitalocean.com

### 2. Install DigitalOcean CLI
```bash
# macOS
brew install doctl

# Or download from:
# https://docs.digitalocean.com/reference/doctl/how-to/install/
```

### 3. Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Add your DigitalOcean token to .env
```

### 4. Run Setup Script
```bash
./setup-digitalocean.sh
```

### 5. Configure DNS in DigitalOcean
1. Go to Networking > Domains
2. Add domain: atticcleaning.com
3. Create A record pointing to App Platform IP
4. Create CNAME for www pointing to @

### 6. Deploy to App Platform
```bash
# Initial deployment
git add .
git commit -m "Initial static site deployment"
git push origin main
```

## Performance Verification

Run performance tests after deployment:
```bash
./test-performance.sh
```

## Key Performance Targets
- Mobile PageSpeed Score: ≥ 95
- Core Web Vitals:
  - LCP < 1.5s
  - FID < 100ms
  - CLS < 0.1

## Monthly Cost Estimate
- App Platform Static Site: ~$3/month
- Spaces CDN: ~$5/month + bandwidth
- Domain: ~$12/year
- **Total**: Under $10/month

## Maintenance
- Git push to main branch triggers automatic deployment
- No build process required (pure static files)
- Monitor performance weekly via PageSpeed Insights