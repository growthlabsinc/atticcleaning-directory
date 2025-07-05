# DNS Configuration for AtticCleaning.com

## Option 1: Point to DigitalOcean Name Servers (Recommended)

Change your domain's nameservers at your registrar to:

```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

**Benefits:** 
- Manage all DNS records in DigitalOcean
- Automatic SSL certificate provisioning
- Easier CDN and subdomain management

## Option 2: Direct A Record Configuration

If you prefer to keep DNS at your registrar, create these records:

### For Root Domain (atticcleaning.com):
- **Type:** A
- **Name:** @ (or leave blank)
- **Value:** (DigitalOcean App Platform IP - will be provided after app creation)
- **TTL:** 3600

### For WWW Subdomain:
- **Type:** CNAME
- **Name:** www
- **Value:** atticcleaning.com
- **TTL:** 3600

## After DNS Update:

1. DNS propagation takes 1-48 hours (usually 1-4 hours)
2. Check propagation status at: https://dnschecker.org/
3. Once propagated, run the DigitalOcean setup script

## DigitalOcean App Platform IP Address

**IMPORTANT:** The actual IP address will be provided after running:
```bash
./setup-digitalocean.sh
```

The script will create the App Platform and output the IP address to use.

## Temporary Setup (Before App Platform Creation)

Since we need to create the App Platform first to get the IP, I recommend:

1. **Use DigitalOcean nameservers** (Option 1 above)
2. This allows us to configure everything in DigitalOcean after setup
3. No need to go back to registrar later

## Next Steps:

1. Update nameservers at your registrar to DigitalOcean
2. Wait 1-4 hours for propagation
3. Run `./setup-digitalocean.sh` to create App Platform
4. DigitalOcean will handle the rest automatically