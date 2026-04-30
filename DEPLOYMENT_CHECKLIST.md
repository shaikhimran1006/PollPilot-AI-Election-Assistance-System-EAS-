# 📋 Frontend Deployment Checklist

## Pre-Deployment Setup

### Account & Project Setup

- [ ] Create GCP account with billing enabled
- [ ] Create GCP project: `pollpilot-frontend`
- [ ] Enable required APIs (Storage, Compute, CloudBuild)
- [ ] Create service account for GitHub deployments
- [ ] Download service account JSON key

### GCP Infrastructure

- [ ] Create Cloud Storage bucket
- [ ] Enable versioning on bucket
- [ ] Configure bucket for website hosting
- [ ] Create Cloud CDN backend bucket
- [ ] Create URL map and HTTP proxy
- [ ] Create forwarding rule with static IP
- [ ] Get external IP address

### GitHub Configuration

- [ ] Create GitHub repository (if not already created)
- [ ] Add `GCP_PROJECT_ID` secret
- [ ] Add `GCP_SA_KEY` secret
- [ ] Add `GCS_BUCKET_NAME` secret
- [ ] Add `VITE_API_URL` secret (optional)
- [ ] Add `VITE_FIREBASE_API_KEY` secret (if using Firebase)
- [ ] Add `SLACK_WEBHOOK_URL` secret (optional, for notifications)

### Frontend Configuration

- [ ] Create `.env.production` file
- [ ] Set API endpoints
- [ ] Set Firebase configuration
- [ ] Test build locally: `npm run build`
- [ ] Test deployment locally: `./deploy.sh` or `.\deploy.ps1`

---

## Deployment Steps

### Automated (Recommended)

- [ ] Push code to `main` branch
- [ ] GitHub Actions workflow triggers automatically
- [ ] Monitor deployment in Actions tab
- [ ] Verify site is live at CDN URL

### Manual Deployment

- [ ] Run `./deploy.sh` (Linux/Mac) or `.\deploy.ps1` (Windows)
- [ ] Verify files in Cloud Storage bucket
- [ ] Check CDN cache invalidation
- [ ] Test site accessibility

---

## Post-Deployment Verification

### Functionality Tests

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] API calls succeed
- [ ] Firebase authentication works (if configured)
- [ ] Chat widget functions
- [ ] Forms submit successfully
- [ ] Mobile responsive layout

### Performance & Security

- [ ] Page load time acceptable (< 3s)
- [ ] No console errors in browser DevTools
- [ ] HTTPS working (if SSL enabled)
- [ ] Cache headers proper (dev in CORS, assets long-lived)
- [ ] Static assets served from CDN
- [ ] No sensitive data in HTML source

### CDN & Deployment

- [ ] Assets cached properly
- [ ] HTML has no-cache headers
- [ ] Cache invalidation working
- [ ] Static IP accessible via browser
- [ ] Custom domain resolves (if configured)

---

## Monitoring & Maintenance

### Daily

- [ ] Monitor CDN performance metrics
- [ ] Check for 4xx/5xx errors
- [ ] Review user reports

### Weekly

- [ ] Check backup versioning
- [ ] Review deployment logs
- [ ] Test rollback procedure

### Monthly

- [ ] Clean up old versions
- [ ] Review storage costs
- [ ] Update dependencies
- [ ] Performance analysis

---

## Rollback Procedure

If deployment fails:

1. [ ] Identify latest working version
2. [ ] Restore files from versioning: `gsutil cp gs://bucket/file#VERSION_ID gs://bucket/file`
3. [ ] Invalidate CDN: `gcloud compute backend-buckets invalidate-cdn-cache pollpilot-frontend-backend --path="/*"`
4. [ ] Verify old version is live
5. [ ] Notify team of issue

---

## Troubleshooting Checklist

### Build Fails

- [ ] Check Node.js version (should be 18+)
- [ ] Clear node_modules: `rm -rf node_modules && npm ci`
- [ ] Check for TypeScript errors: `npm run build`
- [ ] Verify environment variables are set

### Deployment Fails

- [ ] Verify GCP credentials: `gcloud auth list`
- [ ] Check service account permissions
- [ ] Verify bucket exists: `gsutil ls -b gs://bucket-name`
- [ ] Check Cloud Storage quotas
- [ ] Review deployment logs

### Site Not Accessible

- [ ] Verify external IP: `gcloud compute forwarding-rules describe NAME --global`
- [ ] Check DNS resolution (if custom domain)
- [ ] Verify firewall rules
- [ ] Check if index.html exists in bucket
- [ ] Verify bucket public access

---

## Security Checklist

- [ ] No credentials in code or `.env` files
- [ ] Service account has minimal permissions
- [ ] Bucket not public (access via CDN only)
- [ ] API keys restricted to specific domains
- [ ] HTTPS enabled (if custom domain)
- [ ] Environment secrets not logged
- [ ] Regular security audits of dependencies

---

## Documentation

- [ ] Update project README with deployment instructions
- [ ] Document custom domain setup steps
- [ ] Create runbook for emergency rollback
- [ ] Document environment variables
- [ ] Add troubleshooting guide to team wiki

---

## Team Communication

- [ ] Notify team of deployment schedule
- [ ] Post deployment status update
- [ ] Document any issues encountered
- [ ] Update deployment metrics/dashboard
- [ ] Plan next optimization/improvement

---

## Completion

**Deployed by:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Version:** ******\_\_\_******  
**Notes:** ******************************\_\_\_\_******************************

✅ All checks complete! Frontend is live on GCP.
