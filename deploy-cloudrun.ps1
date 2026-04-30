$ErrorActionPreference = "Stop"

$ProjectId = $args[0]
$Region = $args[1]
$ServiceName = $args[2]

$ProjectId = if ([string]::IsNullOrWhiteSpace($ProjectId)) { "poll-pilot-81c07" } else { $ProjectId }
$Region = if ([string]::IsNullOrWhiteSpace($Region)) { "us-central1" } else { $Region }
$ServiceName = if ([string]::IsNullOrWhiteSpace($ServiceName)) { "pollpilot-app" } else { $ServiceName }

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "Using project: $ProjectId"
Write-Host "Using region:  $Region"
Write-Host "Using service: $ServiceName"

gcloud config set project $ProjectId | Out-Host
gcloud config set run/region $Region | Out-Host

gcloud builds submit `
  --config cloudbuild.yaml `
  --substitutions _REGION=$Region,_SERVICE_NAME=$ServiceName `
  .