# Database Setup Script for Fly.io Strapi
# embracingearth.space - Enterprise-grade database setup

Write-Host "🗄️  Fly.io Database Setup for Strapi" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if fly CLI is installed
if (-not (Get-Command fly -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Fly CLI not found. Install from: https://fly.io/docs/getting-started/installing-flyctl/" -ForegroundColor Red
    exit 1
}

# Check if logged in
Write-Host "Checking Fly.io authentication..." -ForegroundColor Yellow
$authCheck = fly auth whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Fly.io. Run: fly auth login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Authenticated" -ForegroundColor Green
Write-Host ""

# Check if database already exists
Write-Host "Checking for existing database..." -ForegroundColor Yellow
$dbList = fly postgres list 2>&1
$hasDb = $dbList -match "strapi"

if ($hasDb) {
    Write-Host "✅ Database found!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Checking if database is attached to app..." -ForegroundColor Yellow
    
    $secrets = fly secrets list -a strapi-cloud-template-blog-3f0dd9f7fb 2>&1
    $hasDbUrl = $secrets -match "DATABASE_URL"
    
    if ($hasDbUrl) {
        Write-Host "✅ Database is already attached!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database setup complete. You can proceed with deployment." -ForegroundColor Green
        exit 0
    } else {
        Write-Host "⚠️  Database exists but not attached. Attaching now..." -ForegroundColor Yellow
        fly postgres attach strapi-cloud-template-blog-3f0dd9f7fb-db -a strapi-cloud-template-blog-3f0dd9f7fb
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database attached!" -ForegroundColor Green
            exit 0
        }
    }
}

# Create new database
Write-Host "Creating new PostgreSQL database..." -ForegroundColor Yellow
Write-Host ""

$dbName = "strapi-cloud-template-blog-3f0dd9f7fb-db"
$region = "iad"  # Change to your preferred region

Write-Host "Database name: $dbName" -ForegroundColor White
Write-Host "Region: $region" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Create database? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creating database (this may take a minute)..." -ForegroundColor Yellow

# Create Fly Postgres database (smallest, cheapest option)
fly postgres create --name $dbName --region $region --vm-size shared-cpu-1x --volume-size 3

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Attaching database to app..." -ForegroundColor Yellow

# Attach database to app (auto-sets DATABASE_URL)
fly postgres attach $dbName -a strapi-cloud-template-blog-3f0dd9f7fb

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to attach database" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set other secrets: .\setup-fly-secrets.ps1" -ForegroundColor White
Write-Host "2. Deploy: fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host ""

