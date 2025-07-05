# Backup and Restoration Procedures

## Backup Strategy

AtticCleaning.com uses a multi-layer backup approach:

### 1. Primary Backup: Git Repository
- **Location:** GitHub (atticcleaning/directory)
- **Frequency:** Every code change
- **Retention:** Unlimited (full history)
- **Recovery Time:** < 5 minutes

### 2. DigitalOcean App Platform
- **Type:** Automatic deployment snapshots
- **Frequency:** Every deployment
- **Retention:** Last 10 deployments
- **Recovery Time:** < 2 minutes

### 3. Local Backups
- **Type:** Developer machines
- **Frequency:** Real-time (git pulls)
- **Coverage:** Full codebase

## Restoration Procedures

### Scenario 1: Rollback Bad Deployment

```bash
# Option A: Via DigitalOcean Console
1. Go to App Platform > atticcleaning-website
2. Click "Activity" tab
3. Find previous good deployment
4. Click "Rollback to this deployment"

# Option B: Via Git
1. git log --oneline  # Find good commit
2. git revert HEAD    # Or specific commit
3. git push origin main  # Triggers redeploy
```

### Scenario 2: Complete Site Recovery

```bash
# 1. Clone repository
git clone https://github.com/atticcleaning/directory.git

# 2. Create new DigitalOcean app
doctl apps create --spec .do/app.yaml

# 3. Update DNS if needed
# Point domain to new app IP
```

### Scenario 3: Corrupted Files

```bash
# 1. Identify corrupted files
git status

# 2. Restore from Git
git checkout -- path/to/file

# 3. Or restore entire site
git reset --hard origin/main
```

## Backup Verification

### Weekly Checklist:
- [ ] Verify GitHub repository accessible
- [ ] Test clone to new directory
- [ ] Check DigitalOcean deployment history
- [ ] Confirm DNS records documented

### Monthly Drill:
1. Clone repo to test machine
2. Run local server
3. Verify all pages load
4. Document any issues

## Critical Information

### DNS Settings Backup:
- **A Record:** @ → 104.248.228.183
- **CNAME:** www → atticcleaning.com
- **Nameservers:** ns1-3.digitalocean.com

### DigitalOcean App:
- **App Name:** atticcleaning-website
- **Region:** NYC
- **Type:** Static Site

### Recovery Contacts:
- GitHub Support: https://support.github.com
- DigitalOcean Support: https://www.digitalocean.com/support
- Domain Registrar: [Document your registrar]

## Automated Backup Script

```bash
#!/bin/bash
# backup-site.sh
DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/site-$DATE"

# Create backup
mkdir -p $BACKUP_DIR
git clone https://github.com/atticcleaning/directory.git $BACKUP_DIR

# Verify backup
if [ -f "$BACKUP_DIR/index.html" ]; then
    echo "✅ Backup successful: $BACKUP_DIR"
else
    echo "❌ Backup failed!"
    exit 1
fi
```

## Important Notes

1. **Git is Primary:** All code changes must be committed
2. **No Database:** Static site = no database backups needed
3. **Fast Recovery:** Full site restoration < 10 minutes
4. **Cost Effective:** Backup strategy costs $0/month