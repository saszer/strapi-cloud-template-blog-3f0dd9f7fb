# Setup Script: Keep Database Warm (Free)
# embracingearth.space - Zero cold starts, zero cost

Write-Host "🔥 Keep Database Warm Setup" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script helps you set up free monitoring to keep your database warm." -ForegroundColor Yellow
Write-Host "This eliminates cold starts on Neon free tier!" -ForegroundColor Green
Write-Host ""

Write-Host "Option 1: UptimeRobot (Recommended - Free)" -ForegroundColor Yellow
Write-Host "  - Free forever" -ForegroundColor White
Write-Host "  - Pings every 5 minutes" -ForegroundColor White
Write-Host "  - Keeps database warm" -ForegroundColor White
Write-Host "  - No cold starts!" -ForegroundColor Green
Write-Host ""

Write-Host "Option 2: Cron-job.org (Free)" -ForegroundColor Yellow
Write-Host "  - Free tier available" -ForegroundColor White
Write-Host "  - Custom intervals" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: GitHub Actions (Free)" -ForegroundColor Yellow
Write-Host "  - Free for public repos" -ForegroundColor White
Write-Host "  - Runs on schedule" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1, 2, or 3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "📋 UptimeRobot Setup Instructions:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://uptimerobot.com" -ForegroundColor White
    Write-Host "2. Sign up (free)" -ForegroundColor White
    Write-Host "3. Click 'Add New Monitor'" -ForegroundColor White
    Write-Host "4. Configure:" -ForegroundColor White
    Write-Host "   - Monitor Type: HTTP(s)" -ForegroundColor Yellow
    Write-Host "   - Friendly Name: Strapi Blog Keep-Alive" -ForegroundColor Yellow
    Write-Host "   - URL: https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev" -ForegroundColor Yellow
    Write-Host "   - Monitoring Interval: 5 minutes" -ForegroundColor Yellow
    Write-Host "5. Click 'Create Monitor'" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Done! Database will stay warm." -ForegroundColor Green
    Write-Host ""
    
    $url = Read-Host "Enter your Fly.io app URL (or press Enter for default)"
    if (-not $url) {
        $url = "https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev"
    }
    
    Write-Host ""
    Write-Host "Quick setup URL:" -ForegroundColor Cyan
    Write-Host "https://uptimerobot.com/dashboard#addMonitor" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Use this URL: $url" -ForegroundColor Yellow
    Write-Host "Interval: 5 minutes" -ForegroundColor Yellow
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "📋 Cron-job.org Setup:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Go to: https://cron-job.org" -ForegroundColor White
    Write-Host "2. Sign up (free)" -ForegroundColor White
    Write-Host "3. Create new cron job" -ForegroundColor White
    Write-Host "4. Configure:" -ForegroundColor White
    Write-Host "   - URL: https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev" -ForegroundColor Yellow
    Write-Host "   - Schedule: Every 5 minutes" -ForegroundColor Yellow
    Write-Host "5. Save" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Done!" -ForegroundColor Green
    
} elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "📋 GitHub Actions Setup:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Create .github/workflows/keep-warm.yml:" -ForegroundColor White
    Write-Host ""
    Write-Host "name: Keep Database Warm" -ForegroundColor Yellow
    Write-Host "on:" -ForegroundColor Yellow
    Write-Host "  schedule:" -ForegroundColor Yellow
    Write-Host "    - cron: '*/5 * * * *'  # Every 5 minutes" -ForegroundColor Yellow
    Write-Host "jobs:" -ForegroundColor Yellow
    Write-Host "  ping:" -ForegroundColor Yellow
    Write-Host "    runs-on: ubuntu-latest" -ForegroundColor Yellow
    Write-Host "    steps:" -ForegroundColor Yellow
    Write-Host "      - run: curl https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ Done! GitHub will ping your site every 5 minutes." -ForegroundColor Green
    
} else {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your database will stay warm, eliminating cold starts!" -ForegroundColor Cyan
Write-Host "Total cost: $0/month" -ForegroundColor Green
Write-Host ""

