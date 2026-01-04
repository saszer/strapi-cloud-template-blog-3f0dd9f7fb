# Complete Database Setup Script
# embracingearth.space - Enterprise-grade database setup

Write-Host "🗄️  Database Setup for Strapi on Fly.io" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if fly CLI is installed
if (-not (Get-Command fly -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Fly CLI not found. Install from: https://fly.io/docs/getting-started/installing-flyctl/" -ForegroundColor Red
    exit 1
}

Write-Host "Choose database option:" -ForegroundColor Yellow
Write-Host "1. Fly Postgres (Managed - Recommended)" -ForegroundColor White
Write-Host "2. External Database (Neon, Supabase, etc.)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "📦 Setting up Fly Postgres..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  Note: Fly Postgres requires interactive setup." -ForegroundColor Yellow
    Write-Host "Please run this command manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  fly postgres create --name strapi-cloud-template-blog-3f0dd9f7fb-db --region iad --vm-size shared-cpu-1x --volume-size 3" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then attach it:" -ForegroundColor Yellow
    Write-Host "  fly postgres attach strapi-cloud-template-blog-3f0dd9f7fb-db -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor Cyan
    Write-Host ""
    
    $runNow = Read-Host "Run these commands now? (y/n)"
    if ($runNow -eq "y" -or $runNow -eq "Y") {
        Write-Host ""
        Write-Host "Creating database (follow prompts)..." -ForegroundColor Yellow
        fly postgres create --name strapi-cloud-template-blog-3f0dd9f7fb-db --region iad --vm-size shared-cpu-1x --volume-size 3
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Attaching database..." -ForegroundColor Yellow
            fly postgres attach strapi-cloud-template-blog-3f0dd9f7fb-db -a strapi-cloud-template-blog-3f0dd9f7fb
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅ Database setup complete!" -ForegroundColor Green
            }
        }
    }
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "📦 Setting up External Database..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Neon (Free tier: 0.5GB) - https://neon.tech" -ForegroundColor White
    Write-Host "2. Supabase (Free tier: 500MB) - https://supabase.com" -ForegroundColor White
    Write-Host "3. Other (provide connection string)" -ForegroundColor White
    Write-Host ""
    
    $dbChoice = Read-Host "Enter choice (1, 2, or 3)"
    
    if ($dbChoice -eq "1") {
        Write-Host ""
        Write-Host "🌱 Neon Database Setup:" -ForegroundColor Green
        Write-Host "1. Go to https://neon.tech and sign up" -ForegroundColor White
        Write-Host "2. Create a new project" -ForegroundColor White
        Write-Host "3. Copy the connection string" -ForegroundColor White
        Write-Host "4. Paste it below" -ForegroundColor White
        Write-Host ""
        $connectionString = Read-Host "Enter Neon connection string"
        
        if ($connectionString) {
            fly secrets set "DATABASE_URL=$connectionString" -a strapi-cloud-template-blog-3f0dd9f7fb
            Write-Host "✅ Database URL set!" -ForegroundColor Green
        }
    } elseif ($dbChoice -eq "2") {
        Write-Host ""
        Write-Host "🔥 Supabase Database Setup:" -ForegroundColor Green
        Write-Host "1. Go to https://supabase.com and sign up" -ForegroundColor White
        Write-Host "2. Create a new project" -ForegroundColor White
        Write-Host "3. Go to Settings → Database → Connection string" -ForegroundColor White
        Write-Host "4. Copy the connection string (URI format)" -ForegroundColor White
        Write-Host "5. Paste it below" -ForegroundColor White
        Write-Host ""
        $connectionString = Read-Host "Enter Supabase connection string"
        
        if ($connectionString) {
            fly secrets set "DATABASE_URL=$connectionString" -a strapi-cloud-template-blog-3f0dd9f7fb
            Write-Host "✅ Database URL set!" -ForegroundColor Green
        }
    } else {
        Write-Host ""
        $connectionString = Read-Host "Enter your PostgreSQL connection string"
        
        if ($connectionString) {
            fly secrets set "DATABASE_URL=$connectionString" -a strapi-cloud-template-blog-3f0dd9f7fb
            Write-Host "✅ Database URL set!" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy app: fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host "2. Check status: fly status -a strapi-cloud-template-blog-3f0dd9f7fb" -ForegroundColor White
Write-Host ""

