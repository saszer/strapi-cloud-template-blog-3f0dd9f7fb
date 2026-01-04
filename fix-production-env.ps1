# Fix NODE_ENV to production
# embracingearth.space - Enterprise-grade environment configuration

Write-Host "Setting NODE_ENV to production..." -ForegroundColor Yellow

fly secrets set "NODE_ENV=production" -a strapi-cloud-template-blog-3f0dd9f7fb

Write-Host "✅ NODE_ENV set to production" -ForegroundColor Green
Write-Host "App will restart automatically" -ForegroundColor Cyan

