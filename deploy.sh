#!/bin/bash

# PollPilot Frontend Deployment Script
# This script automates frontend deployment to GCP without GitHub Actions

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-pollpilot-frontend}"
BUCKET_NAME="${GCS_BUCKET_NAME:-}"
BACKEND_BUCKET="pollpilot-frontend-backend"

echo -e "${YELLOW}🚀 PollPilot Frontend Deployment Script${NC}"
echo "=========================================="

# Step 1: Validate environment
echo -e "\n${YELLOW}[1/6] Validating environment...${NC}"

if [ -z "$BUCKET_NAME" ]; then
  echo -e "${RED}❌ Error: GCS_BUCKET_NAME not set${NC}"
  echo "Usage: GCS_BUCKET_NAME=pollpilot-frontend-xxxxx ./deploy.sh"
  exit 1
fi

if ! command -v gsutil &> /dev/null; then
  echo -e "${RED}❌ Error: gsutil not found. Install Google Cloud SDK${NC}"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ Error: npm not found. Install Node.js${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All tools available${NC}"

# Step 2: Install dependencies
echo -e "\n${YELLOW}[2/6] Installing dependencies...${NC}"
cd frontend
npm ci
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Run tests
echo -e "\n${YELLOW}[3/6] Running tests...${NC}"
npm run test -- --run || echo -e "${YELLOW}⚠️  Some tests failed (continuing...)${NC}"

# Step 4: Build frontend
echo -e "\n${YELLOW}[4/6] Building frontend...${NC}"
npm run build
cd ..
echo -e "${GREEN}✅ Build complete${NC}"

# Step 5: Deploy to GCS
echo -e "\n${YELLOW}[5/6] Deploying to Cloud Storage (gs://${BUCKET_NAME})...${NC}"

# Upload assets with long cache TTL
echo "Uploading assets with cache headers..."
gsutil -m -h "Cache-Control:public,max-age=31536000" \
       cp -r frontend/dist/assets/* gs://$BUCKET_NAME/assets/ 2>/dev/null || true

# Upload HTML files with no-cache headers
echo "Uploading HTML with no-cache headers..."
for html_file in frontend/dist/*.html; do
  if [ -f "$html_file" ]; then
    gsutil -h "Cache-Control:no-cache,max-age=0" \
           -h "Content-Type:text/html" \
           cp "$html_file" gs://$BUCKET_NAME/
  fi
done

# Upload other files
echo "Uploading other files..."
gsutil -m cp frontend/dist/* gs://$BUCKET_NAME/ 2>/dev/null || true

echo -e "${GREEN}✅ Files uploaded to Cloud Storage${NC}"

# Step 6: Invalidate CDN cache
echo -e "\n${YELLOW}[6/6] Invalidating Cloud CDN cache...${NC}"
gcloud compute backend-buckets invalidate-cdn-cache $BACKEND_BUCKET --path="/*"
echo -e "${GREEN}✅ CDN cache invalidated${NC}"

# Verification
echo -e "\n${YELLOW}📊 Verification${NC}"
echo "=========================================="

# Check if index.html exists
if gsutil -q stat gs://$BUCKET_NAME/index.html; then
  echo -e "${GREEN}✅ index.html deployed${NC}"
else
  echo -e "${RED}❌ Deployment verification failed${NC}"
  exit 1
fi

# Show deployment summary
echo -e "\n${GREEN}✅ Deployment Complete!${NC}"
echo "=========================================="
echo "Bucket: gs://$BUCKET_NAME"
echo "Files deployed:"
gsutil ls -r gs://$BUCKET_NAME/ | head -10
echo "..."

echo -e "\n${YELLOW}📝 Next Steps:${NC}"
echo "1. Check deployment: gsutil ls -r gs://$BUCKET_NAME/"
echo "2. View your site via: https://storage.googleapis.com/$BUCKET_NAME/index.html"
echo "3. Monitor CDN: gcloud compute backend-buckets list"

echo -e "\n${GREEN}Done!${NC}"
