# Fly.io Secrets Setup Script for Strapi
# embracingearth.space - Enterprise-grade secret management
# This script generates secure keys and sets them in Fly.io

Write-Host "🔐 Strapi Fly.io Secrets Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
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

Write-Host "✅ Authenticated as: $($authCheck)" -ForegroundColor Green
Write-Host ""

# Generate secure keys
Write-Host "Generating secure keys..." -ForegroundColor Yellow

# Function to generate a secure key
function Generate-Key {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    return [Convert]::ToBase64String($bytes)
}

$key1 = Generate-Key
$key2 = Generate-Key
$key3 = Generate-Key
$key4 = Generate-Key
$apiTokenSalt = Generate-Key
$adminJwtSecret = Generate-Key
$transferTokenSalt = Generate-Key
$jwtSecret = Generate-Key

Write-Host "✅ Keys generated" -ForegroundColor Green
Write-Host ""

# Display keys (for user to save)
Write-Host "Generated Keys (save these securely):" -ForegroundColor Cyan
Write-Host "APP_KEYS: $key1,$key2,$key3,$key4" -ForegroundColor White
Write-Host "API_TOKEN_SALT: $apiTokenSalt" -ForegroundColor White
Write-Host "ADMIN_JWT_SECRET: $adminJwtSecret" -ForegroundColor White
Write-Host "TRANSFER_TOKEN_SALT: $transferTokenSalt" -ForegroundColor White
Write-Host "JWT_SECRET: $jwtSecret" -ForegroundColor White
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Set these secrets in Fly.io? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Set secrets
Write-Host ""
Write-Host "Setting secrets in Fly.io..." -ForegroundColor Yellow

# Set APP_KEYS (comma-separated)
fly secrets set "APP_KEYS=$key1,$key2,$key3,$key4" -a strapi-cloud-template-blog-3f0dd9f7fb

# Set other secrets
fly secrets set "API_TOKEN_SALT=$apiTokenSalt" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "ADMIN_JWT_SECRET=$adminJwtSecret" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "TRANSFER_TOKEN_SALT=$transferTokenSalt" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "JWT_SECRET=$jwtSecret" -a strapi-cloud-template-blog-3f0dd9f7fb

# Set required environment variables
fly secrets set "NODE_ENV=production" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "HOST=0.0.0.0" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "PORT=1337" -a strapi-cloud-template-blog-3f0dd9f7fb

Write-Host ""
Write-Host "✅ Secrets set successfully!" -ForegroundColor Green
Write-Host ""

# Ask about CORS and PUBLIC_URL
Write-Host "Optional: Set CORS_ORIGIN and PUBLIC_URL?" -ForegroundColor Yellow
$setOptional = Read-Host "Set CORS_ORIGIN and PUBLIC_URL? (y/n)"

if ($setOptional -eq "y" -or $setOptional -eq "Y") {
    $corsOrigin = Read-Host "Enter CORS_ORIGIN (comma-separated, e.g., https://ai2fin.com,https://www.ai2fin.com)"
    $publicUrl = Read-Host "Enter PUBLIC_URL (e.g., https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev)"
    
    if ($corsOrigin) {
        fly secrets set "CORS_ORIGIN=$corsOrigin" -a strapi-cloud-template-blog-3f0dd9f7fb
        Write-Host "✅ CORS_ORIGIN set" -ForegroundColor Green
    }
    
    if ($publicUrl) {
        fly secrets set "PUBLIC_URL=$publicUrl" -a strapi-cloud-template-blog-3f0dd9f7fb
        Write-Host "✅ PUBLIC_URL set" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy: fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host "2. Check logs: fly logs -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host "3. Open app: fly open -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host ""

