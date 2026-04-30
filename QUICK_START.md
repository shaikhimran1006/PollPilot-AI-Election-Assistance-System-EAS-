# 🚀 Quick Start: Deploy Frontend to GCP

This is the fastest way to get your frontend deployed!

## ⚡ 5-Minute Quick Start

### 1️⃣ Create GCP Project

```bash
gcloud projects create pollpilot-frontend --name="PollPilot Frontend" --set-as-default
gcloud services enable storage-api.googleapis.com
```

### 2️⃣ Create Storage Bucket & Enable CDN

```bash
# Create bucket (use unique name)
gsutil mb gs://pollpilot-frontend-$(date +%s)
export BUCKET_NAME="pollpilot-frontend-YOUR_ID"

# Enable versioning & web hosting
gsutil versioning set on gs://$BUCKET_NAME
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME

# Create Cloud CDN backend
gcloud compute backend-buckets create pollpilot-frontend-backend \
  --gcs-uri-prefix=gs://$BUCKET_NAME \
  --enable-cdn

# Create URL map and forwarding rule
gcloud compute url-maps create pollpilot-frontend-lb \
  --default-service=pollpilot-frontend-backend

gcloud compute target-http-proxies create pollpilot-frontend-http \
  --url-map=pollpilot-frontend-lb

gcloud compute forwarding-rules create pollpilot-frontend-http-lb \
  --global \
  --target-http-proxy=pollpilot-frontend-http \
  --ports=80

# Get your IP
gcloud compute forwarding-rules describe pollpilot-frontend-http-lb --global
```

### 3️⃣ Deploy Frontend

#### Option A: Manual Deployment
```bash
cd frontend
npm install
npm run build
cd ..

# Deploy
gsutil -m cp -r frontend/dist/* gs://$BUCKET_NAME/

# Invalidate cache
gcloud compute backend-buckets invalidate-cdn-cache \
  pollpilot-frontend-backend --path="/*"

# Access at: http://<YOUR_IP>
```

#### Option B: Automated via GitHub Actions
1. Add GitHub Secrets:
   - `GCP_PROJECT_ID`: `pollpilot-frontend`
   - `GCP_SA_KEY`: (from service account JSON)
   - `GCS_BUCKET_NAME`: your bucket name

2. Workflow runs automatically on push to `frontend/` folder

3. Check progress in: **Actions** tab

#### Option C: Script (Windows/Linux)
```bash
# Linux/Mac
export GCS_BUCKET_NAME="your-bucket"
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
$env:GCS_BUCKET_NAME = "your-bucket"
.\deploy.ps1
```

---

## 🔗 Access Your Site

```bash
# Direct from bucket
https://storage.googleapis.com/$BUCKET_NAME/index.html

# Or via load balancer IP
http://<EXTERNAL_IP>

# With custom domain (after DNS setup)
https://yourdomain.com
```

---

## 📊 Deployment Status

Check deployment status:

```bash
# View deployed files
gsutil ls -r gs://$BUCKET_NAME/

# Check build cache
gcloud compute backend-buckets list

# Monitor CDN traffic
gcloud monitoring time-series list \
  --filter='metric.type = "compute.googleapis.com/https_internal_request_count"'
```

---

## 🔑 Important Configuration

Add to `.env.production` for production builds:

```
VITE_API_URL=https://your-backend-api.com
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_PROJECT_ID=your-project
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| **Bucket already exists** | Use `gsutil ls` to find existing buckets |
| **404 on routes** | Configure error document: `gsutil web set -e index.html` |
| **Cache not updating** | Run: `gcloud compute backend-buckets invalidate-cdn-cache pollpilot-frontend-backend --path="/*"` |
| **Permission denied** | Run: `gcloud auth login` and `gcloud auth application-default login` |

---

## 💡 Next Steps

✅ Deploy frontend  
📝 Setup custom domain (optional)  
🔐 Add SSL certificate (optional)  
📊 Setup monitoring & alerting

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete documentation.
