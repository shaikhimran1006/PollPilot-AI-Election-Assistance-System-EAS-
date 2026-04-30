# Frontend Deployment Guide: GCP + GitHub

This guide covers deploying the PollPilot frontend to Google Cloud Platform with automated CI/CD through GitHub Actions.

---

## 📋 Overview

**Deployment Architecture:**
- **Hosting**: Google Cloud Storage (Static files) + Cloud CDN (Content Delivery)
- **CI/CD**: GitHub Actions (Automated build & deploy)
- **Domain**: Cloud Load Balancer with custom domain
- **Features**: Zero-downtime deployments, automatic versioning, cache invalidation

---

## 🔧 Prerequisites

Before starting, ensure you have:

1. **GCP Account** with billing enabled
2. **GitHub Account** with this repository
3. **Google Cloud CLI** installed locally
4. **Node.js 18+** for local testing

### Install Google Cloud CLI

```bash
# Windows
choco install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

---

## 📝 Step 1: GCP Project Setup

### 1.1 Create a GCP Project

```bash
gcloud projects create pollpilot-frontend --name="PollPilot Frontend" --set-as-default
gcloud config set project pollpilot-frontend
```

### 1.2 Enable Required APIs

```bash
gcloud services enable storage-api.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable cloudcdn.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 1.3 Create a Service Account for GitHub

```bash
# Create service account
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Deployment Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding pollpilot-frontend \
  --member=serviceAccount:github-deployer@pollpilot-frontend.iam.gserviceaccount.com \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding pollpilot-frontend \
  --member=serviceAccount:github-deployer@pollpilot-frontend.iam.gserviceaccount.com \
  --role=roles/compute.admin
```

### 1.4 Create and Download Service Account Key

```bash
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=github-deployer@pollpilot-frontend.iam.gserviceaccount.com

# Display the key content (you'll need it for GitHub)
cat ~/gcp-key.json
```

---

## 🪣 Step 2: GCP Storage & CDN Setup

### 2.1 Create Cloud Storage Bucket

```bash
# Create bucket (bucket names must be globally unique)
gsutil mb gs://pollpilot-frontend-$(date +%s)

# Set as default (use your actual bucket name)
export BUCKET_NAME="pollpilot-frontend-1234567890"
gsutil mb gs://$BUCKET_NAME

# Enable versioning for rollback capability
gsutil versioning set on gs://$BUCKET_NAME
```

### 2.2 Configure Bucket for Website Hosting

```bash
# Set index and 404 pages
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

# Make bucket public (files will be served via CDN)
gsutil iam ch serviceAccount:github-deployer@pollpilot-frontend.iam.gserviceaccount.com:objectViewer gs://$BUCKET_NAME
```

### 2.3 Enable Cloud CDN

```bash
# Create a backend bucket with CDN
gcloud compute backend-buckets create pollpilot-frontend-backend \
  --gcs-uri-prefix=gs://$BUCKET_NAME \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC \
  --default-ttl=3600 \
  --max-ttl=86400

# Create URL map
gcloud compute url-maps create pollpilot-frontend-lb \
  --default-service=pollpilot-frontend-backend

# Create HTTP proxy
gcloud compute target-http-proxies create pollpilot-frontend-http \
  --url-map=pollpilot-frontend-lb

# Create forwarding rule (external IP)
gcloud compute forwarding-rules create pollpilot-frontend-http-lb \
  --global \
  --target-http-proxy=pollpilot-frontend-http \
  --address-region=global \
  --ports=80

# Get your external IP
gcloud compute forwarding-rules describe pollpilot-frontend-http-lb --global
```

---

## 🔑 Step 3: GitHub Secrets Configuration

### 3.1 Add GCP Credentials to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | `pollpilot-frontend` |
| `GCP_SA_KEY` | Contents of `~/gcp-key.json` |
| `GCS_BUCKET_NAME` | Your bucket name (e.g., `pollpilot-frontend-1234567890`) |

### 3.2 Verify Secrets

```bash
# You should see your secrets listed
gh secret list -R <your-github-repo>
```

---

## 🚀 Step 4: GitHub Actions CI/CD Setup

### 4.1 Create GitHub Actions Workflow

The workflow file is already created at `.github/workflows/deploy-frontend.yml`

**What it does:**
1. ✅ Installs dependencies
2. ✅ Runs tests
3. ✅ Builds frontend (Vite)
4. ✅ Deploys to GCS
5. ✅ Invalidates CDN cache
6. ✅ Sends deployment notification

### 4.2 Test the Workflow

```bash
# Push a change to trigger the workflow
git add .
git commit -m "chore: setup frontend deployment"
git push origin main
```

Visit **Actions** tab in GitHub to monitor the workflow.

---

## 📦 Step 5: Local Deployment (Manual)

If you need to deploy manually without GitHub:

### 5.1 Build the Frontend

```bash
cd frontend
npm install
npm run build
```

### 5.2 Deploy to GCS

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project pollpilot-frontend

# Upload files
gsutil -m cp -r dist/* gs://$BUCKET_NAME/

# Set proper MIME types
gsutil -m -h "Content-Type:text/html" cp -r dist/*.html gs://$BUCKET_NAME/

# Invalidate CDN cache
gcloud compute backend-buckets invalidate-cdn-cache pollpilot-frontend-backend --path="/*"
```

---

## 🧪 Step 6: Testing & Validation

### 6.1 Access Your Frontend

```bash
# Get the forwarding rule IP
gcloud compute forwarding-rules describe pollpilot-frontend-http-lb --global

# Visit: http://<EXTERNAL_IP>
```

### 6.2 Verify Cache Headers

```bash
curl -I http://<EXTERNAL_IP>
# Should see: X-Cache-Status headers
```

### 6.3 Check Build Artifacts

```bash
# List deployed files
gsutil ls -r gs://$BUCKET_NAME/

# Download and verify a file
gsutil cp gs://$BUCKET_NAME/index.html ./
```

---

## 🌐 Step 7: Custom Domain (Optional)

### 7.1 Point Domain to Load Balancer

1. Get the external IP of your load balancer
2. In your domain registrar, update DNS:
   ```
   A record: yourdomain.com → <EXTERNAL_IP>
   ```

### 7.2 Add SSL Certificate (Optional)

```bash
# Create managed SSL certificate
gcloud compute ssl-certificates create pollpilot-ssl \
  --domains=yourdomain.com

# Create HTTPS proxy and forwarding rule
gcloud compute target-https-proxies create pollpilot-frontend-https \
  --ssl-certificates=pollpilot-ssl \
  --url-map=pollpilot-frontend-lb

gcloud compute forwarding-rules create pollpilot-frontend-https \
  --global \
  --target-https-proxy=pollpilot-frontend-https \
  --address-region=global \
  --ports=443
```

---

## 🔄 Rollback Procedure

### Quick Rollback to Previous Version

```bash
# List object versions
gsutil ls -L gs://$BUCKET_NAME/index.html

# Restore specific version
gsutil cp gs://$BUCKET_NAME/index.html#<VERSION_ID> gs://$BUCKET_NAME/index.html

# Invalidate cache
gcloud compute backend-buckets invalidate-cdn-cache pollpilot-frontend-backend --path="/*"
```

---

## 📊 Monitoring & Debugging

### View Cloud CDN Metrics

```bash
gcloud monitoring time-series list \
  --filter='metric.type = "compute.googleapis.com/https_internal_request_count"' \
  --interval-start-time=2024-01-01T00:00:00Z
```

### View Deployment Logs

```bash
# GitHub Actions logs
gh run list -R <your-repo>

# GCP Build logs
gcloud builds log <BUILD_ID>
```

### Check Storage Bucket

```bash
# View bucket metrics
gsutil stat gs://$BUCKET_NAME/

# See bucket versioning
gsutil versioning get gs://$BUCKET_NAME/
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **404 errors on routes** | Add `error_doc` configuration to bucket |
| **Cache not updating** | Run CDN invalidation: `gcloud compute backend-buckets invalidate-cdn-cache` |
| **Build fails in GitHub** | Check logs in Actions tab, verify Node version |
| **Permission denied** | Verify service account has `Storage Admin` role |
| **Slow deployment** | Use `gsutil -m` for parallel uploads |

---

## 💰 Cost Optimization

```bash
# Estimate monthly costs
# - Storage: ~$0.02/GB/month
# - CDN egress: ~$0.12/GB
# - Requests: ~$0.40 per million requests

# Tips to reduce costs:
# 1. Set appropriate cache TTLs
# 2. Enable compression in CDN
# 3. Use different CDN providers for specific regions
# 4. Archive old versions after 30 days
```

---

## 📚 Additional Resources

- [GCP Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Cloud CDN Caching](https://cloud.google.com/cdn/docs/caching)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

## 🎯 Next Steps

1. ✅ Complete GCP setup (Steps 1-2)
2. ✅ Add GitHub secrets (Step 3)
3. ✅ Create GitHub Actions workflow (Step 4)
4. ✅ Test workflow (Step 4.2)
5. ✅ Verify deployment (Step 6)
6. ✅ Setup custom domain (Step 7 - optional)

---

**Questions?** Check the troubleshooting section or refer to official GCP documentation.
