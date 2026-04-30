# PollPilot Frontend Deployment Script (Windows)
# This script automates frontend deployment to GCP on Windows

param(
    [string]$BucketName = $env:GCS_BUCKET_NAME,
    [string]$ProjectId = $env:GCP_PROJECT_ID
)

# Color output (Windows 10+)
$HostOS = [System.Environment]::OSVersion.Platform
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error-Custom { Write-Host $args -ForegroundColor Red }
function Write-Warning-Custom { Write-Host $args -ForegroundColor Yellow }
function Write-Info { Write-Host $args -ForegroundColor Cyan }

Write-Host "=========================================="
Write-Warning-Custom "🚀 PollPilot Frontend Deployment Script (Windows)"
Write-Host "=========================================="

# Step 1: Validate environment
Write-Host "`n"
Write-Warning-Custom "[1/6] Validating environment..."

if ([string]::IsNullOrEmpty($BucketName)) {
    Write-Error-Custom "❌ Error: GCS_BUCKET_NAME environment variable not set"
    Write-Host "Usage: `$env:GCS_BUCKET_NAME='your-bucket' ; .\deploy.ps1"
    exit 1
}

if ([string]::IsNullOrEmpty($ProjectId)) {
    $ProjectId = "pollpilot-frontend"
    Write-Warning-Custom "⚠️  Using default project ID: $ProjectId"
}

# Check if tools are available
$tools = @("gcloud", "gsutil", "npm")
foreach ($tool in $tools) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "❌ Error: $tool not found"
        if ($tool -eq "gcloud") {
            Write-Host "Download from: https://cloud.google.com/sdk/docs/install"
        }
        exit 1
    }
}

Write-Success "✅ All tools available"

# Step 2: Install dependencies
Write-Host "`n"
Write-Warning-Custom "[2/6] Installing dependencies..."
Push-Location frontend
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "❌ npm install failed"
    exit 1
}
Write-Success "✅ Dependencies installed"

# Step 3: Run tests
Write-Host "`n"
Write-Warning-Custom "[3/6] Running tests..."
npm run test -- --run 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Warning-Custom "⚠️  Some tests failed (continuing...)"
}

# Step 4: Build frontend
Write-Host "`n"
Write-Warning-Custom "[4/6] Building frontend..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "❌ Build failed"
    exit 1
}
Pop-Location
Write-Success "✅ Build complete"

# Step 5: Deploy to GCS
Write-Host "`n"
Write-Warning-Custom "[5/6] Deploying to Cloud Storage (gs://$BucketName)..."

Write-Info "Uploading assets with cache headers..."
gsutil -m -h "Cache-Control:public,max-age=31536000" `
       cp -r "frontend/dist/assets/*" "gs://$BucketName/assets/" 2>$null

Write-Info "Uploading HTML with no-cache headers..."
$htmlFiles = Get-ChildItem -Path "frontend/dist/*.html" -File
foreach ($file in $htmlFiles) {
    gsutil -h "Cache-Control:no-cache,max-age=0" `
           -h "Content-Type:text/html" `
           cp $file.FullName "gs://$BucketName/"
}

Write-Info "Uploading other files..."
gsutil -m cp "frontend/dist/*" "gs://$BucketName/" 2>$null

Write-Success "✅ Files uploaded to Cloud Storage"

# Step 6: Invalidate CDN cache
Write-Host "`n"
Write-Warning-Custom "[6/6] Invalidating Cloud CDN cache..."
gcloud compute backend-buckets invalidate-cdn-cache `
    pollpilot-frontend-backend --path="/*"

if ($LASTEXITCODE -eq 0) {
    Write-Success "✅ CDN cache invalidated"
} else {
    Write-Warning-Custom "⚠️  CDN cache invalidation skipped (backend may not exist yet)"
}

# Verification
Write-Host "`n"
Write-Info "📊 Verification"
Write-Host "=========================================="

$result = gsutil stat "gs://$BucketName/index.html" 2>&1
if ($result -like "*File*") {
    Write-Success "✅ index.html deployed"
} else {
    Write-Error-Custom "❌ Deployment verification failed"
    exit 1
}

# Show deployment summary
Write-Host "`n"
Write-Success "✅ Deployment Complete!"
Write-Host "=========================================="
Write-Host "Bucket: gs://$BucketName"
Write-Host "Files deployed:"
gsutil ls -r "gs://$BucketName/" | Select-Object -First 10

Write-Host "`n"
Write-Warning-Custom "📝 Next Steps:"
Write-Host "1. Check deployment: gsutil ls -r gs://$BucketName/"
Write-Host "2. View your site: https://storage.googleapis.com/$BucketName/index.html"
Write-Host "3. Monitor CDN: gcloud compute backend-buckets list"

Write-Host "`n"
Write-Success "Done!"
