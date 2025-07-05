# DigitalOcean Manual Setup Instructions

Since automated setup requires GitHub OAuth connection in DigitalOcean, please follow these manual steps:

## 1. Log into DigitalOcean Console
https://cloud.digitalocean.com/

## 2. Create New App
1. Go to **Apps** → **Create App**
2. Choose **GitHub** as source
3. Authorize DigitalOcean to access GitHub (if not already done)
4. Select repository: `atticcleaning/atticcleaning-directory`
5. Branch: `main`
6. Type: **Static Site**

## 3. Configure App Settings
- **Name**: atticcleaning-website
- **Region**: NYC (New York)
- **Static Site Settings**:
  - Build Command: (leave empty - no build needed)
  - Output Directory: `/`

## 4. Configure Domain
1. Add domain: `atticcleaning.com`
2. Add domain: `www.atticcleaning.com`
3. DigitalOcean will automatically provision SSL certificates

## 5. Environment Variables
None needed for static site

## 6. Deploy
Click **Create Resources** to deploy

## 7. Update DNS (if needed)
The app will provide the correct IP address to use. Since DNS already points to 104.248.228.183, this might be the correct IP already.

## Alternative: Use doctl with GitHub Token

If you prefer command line, first connect GitHub in DigitalOcean console, then:

```bash
doctl apps create --spec .do/app.yaml
```

## Current Status
- ✅ Domain registered and DNS configured
- ✅ GitHub repository created and code pushed
- ❌ App Platform needs to be created
- ❌ SSL certificate needs provisioning