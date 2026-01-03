# 🚀 Fly.io Deployment Guide for Strapi CMS

**Cost-optimized deployment for minimal resource usage with always-available architecture**  
*Built with embracingearth.space architecture for enterprise-grade reliability*

---

## 📋 Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **Fly CLI**: Install from [fly.io/docs/hands-on/install-flyctl](https://fly.io/docs/hands-on/install-flyctl)
3. **PostgreSQL Database**: Use Fly Postgres (recommended) or external database

> **💡 Important**: This is **self-hosted Strapi** - you pay **$0 to Strapi** (it's free and open-source). You only pay Fly.io for hosting (~$4/month). See [SELF_HOSTING_CLARIFICATION.md](./SELF_HOSTING_CLARIFICATION.md) for details.

---

## 🎯 Quick Start

### 1. Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS/Linux
curl -L https://fly.io/install.sh | sh
```

### 2. Login to Fly.io

```bash
fly auth login
```

### 3. Initialize Fly.io App

```bash
cd strapi-cloud-template-blog-3f0dd9f7fb
fly launch --no-deploy
```

**Note**: When prompted:
- Use existing `fly.toml`? **Yes**
- App name: Use default or customize
- Region: Choose closest to your users (e.g., `iad` for US East)

### 4. Create PostgreSQL Database (Required)

**You need to create the database - Fly.io doesn't auto-create it!**

**Option A: Fly Postgres (Recommended - Easiest)**
```bash
# Create Fly Postgres database (smallest, cheapest option)
fly postgres create --name ai2fin-strapi-db --region iad --vm-size shared-cpu-1x --volume-size 3

# Attach database to app (auto-sets DATABASE_URL)
fly postgres attach ai2fin-strapi-db --app ai2fin-strapi-blog
```

**Option B: Neon DB (Free Tier Available)**
```bash
# 1. Create database at neon.tech (free tier: 0.5GB)
# 2. Copy connection string
# 3. Set DATABASE_URL
fly secrets set DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
```

**See [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md) for complete database options and setup.**

### 5. Set Environment Variables

```bash
# Generate secure keys
openssl rand -base64 32  # Run 5 times for different keys

# Set required environment variables
fly secrets set \
  APP_KEYS="<key1>,<key2>" \
  API_TOKEN_SALT="<salt1>" \
  ADMIN_JWT_SECRET="<secret1>" \
  TRANSFER_TOKEN_SALT="<salt2>" \
  JWT_SECRET="<secret2>" \
  NODE_ENV="production" \
  HOST="0.0.0.0" \
  PORT="1337"

# Set CORS origins (comma-separated)
fly secrets set CORS_ORIGIN="https://ai2fin.com,https://www.ai2fin.com"

# Set public URL (your Fly.io app URL)
fly secrets set PUBLIC_URL="https://ai2fin-strapi-blog.fly.dev"
```

### 6. Deploy

```bash
fly deploy
```

### 7. Verify Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# Open app in browser
fly open
```

---

## 💰 Cost Optimization Strategy

### Resource Allocation

The `fly.toml` is configured for **minimal cost**:

- **CPU**: `shared-cpu-1x` (cheapest option)
- **RAM**: `256MB` (minimum for Strapi)
- **Auto-restart**: Enabled for availability despite minimal resources
- **Always-on**: `min_machines_running = 1` ensures no cold starts

### Estimated Monthly Cost

- **App**: ~$1.94/month (shared-cpu-1x, 256MB, always-on)
- **Postgres**: ~$1.94/month (shared-cpu-1x, 256MB, 3GB storage)
- **Total**: ~$3.88/month

### Further Cost Reduction Options

1. **Auto-stop machines** (if acceptable downtime):
   ```toml
   auto_stop_machines = true
   auto_start_machines = true
   ```
   - Saves ~50% when idle
   - First request may take 10-30s to start

2. **Use external database** (e.g., Supabase free tier, Neon free tier)

3. **Scale to zero** (not recommended for always-available):
   ```bash
   fly scale count 0
   ```

---

## 🔧 Configuration

### Database Configuration

The app automatically detects `DATABASE_URL` from Fly Postgres. For external databases:

```bash
fly secrets set \
  DATABASE_CLIENT="postgres" \
  DATABASE_HOST="your-db-host" \
  DATABASE_PORT="5432" \
  DATABASE_NAME="strapi" \
  DATABASE_USERNAME="strapi" \
  DATABASE_PASSWORD="secure-password" \
  DATABASE_SSL="true"
```

### CORS Configuration

Update allowed origins:

```bash
fly secrets set CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"
```

### Public URL

Set your public URL for media links:

```bash
fly secrets set PUBLIC_URL="https://ai2fin-strapi-blog.fly.dev"
```

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint

The app includes a health check at `/_health`. Configured in `fly.toml`:

```toml
[[http_service.checks]]
  path = "/_health"
  interval = "30s"
  timeout = "5s"
  grace_period = "10s"
```

### View Metrics

```bash
# App metrics
fly metrics

# Database metrics (if using Fly Postgres)
fly postgres metrics ai2fin-strapi-db
```

### View Logs

```bash
# Real-time logs
fly logs

# Follow logs
fly logs -a ai2fin-strapi-blog
```

---

## 🔄 Updates & Maintenance

### Deploy Updates

```bash
# Deploy latest code
fly deploy

# Deploy with specific image
fly deploy --image your-registry/image:tag
```

### Database Migrations

```bash
# SSH into app
fly ssh console

# Run migrations
npm run strapi migration:run
```

### Backup Database

```bash
# Backup Fly Postgres
fly postgres backup create ai2fin-strapi-db

# List backups
fly postgres backup list ai2fin-strapi-db
```

---

## 🚨 Troubleshooting

### App Won't Start

1. **Check logs**:
   ```bash
   fly logs
   ```

2. **Verify environment variables**:
   ```bash
   fly secrets list
   ```

3. **Check database connection**:
   ```bash
   fly ssh console
   # Then test DB connection
   ```

### Out of Memory Errors

If you see memory errors, increase RAM:

```bash
# Scale up memory (costs more)
fly scale memory 512
```

Then update `fly.toml`:
```toml
[compute]
  memory_mb = 512
```

### Database Connection Issues

1. **Verify DATABASE_URL is set**:
   ```bash
   fly secrets list | grep DATABASE
   ```

2. **Check database status**:
   ```bash
   fly postgres status ai2fin-strapi-db
   ```

3. **Test connection**:
   ```bash
   fly ssh console
   # Test DB connection manually
   ```

---

## 🔐 Security Best Practices

**See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for complete security guide.**

Quick checklist:
1. **Generate strong secrets** (see step 5 above)
2. **Use strong passwords** for database
3. **Enable HTTPS** (automatic with Fly.io)
4. **Restrict CORS** to specific domains only
5. **Monitor access logs**: `fly logs | grep -i "unauthorized\|forbidden"`

**Self-hosted Strapi is as secure as Strapi Cloud when properly configured!**

---

## 📈 Scaling

### Vertical Scaling (More Resources)

```bash
# Increase memory
fly scale memory 512

# Increase CPU (requires paid plan)
fly scale vm shared-cpu-2x
```

### Horizontal Scaling (More Instances)

```bash
# Scale to 2 instances
fly scale count 2

# Auto-scale based on load (requires Fly.io Pro)
fly autoscale set min=1 max=3
```

---

## 🗑️ Cleanup

### Remove App

```bash
fly apps destroy ai2fin-strapi-blog
```

### Remove Database

```bash
fly postgres destroy ai2fin-strapi-db
```

**⚠️ Warning**: This permanently deletes all data!

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_KEYS` | Yes | Comma-separated encryption keys |
| `API_TOKEN_SALT` | Yes | Salt for API tokens |
| `ADMIN_JWT_SECRET` | Yes | JWT secret for admin |
| `TRANSFER_TOKEN_SALT` | Yes | Salt for transfer tokens |
| `JWT_SECRET` | Yes | JWT secret for API |
| `DATABASE_URL` | Auto | Set by Fly Postgres attach |
| `CORS_ORIGIN` | Recommended | Allowed CORS origins |
| `PUBLIC_URL` | Recommended | Public URL for media |
| `NODE_ENV` | Auto | Set to "production" |
| `HOST` | Auto | Set to "0.0.0.0" |
| `PORT` | Auto | Set to "1337" |

---

## ✅ Deployment Checklist

- [ ] Fly.io account created
- [ ] Fly CLI installed and authenticated
- [ ] App initialized with `fly launch`
- [ ] PostgreSQL database created and attached
- [ ] Environment variables set (APP_KEYS, secrets, etc.)
- [ ] CORS_ORIGIN configured
- [ ] PUBLIC_URL set
- [ ] App deployed successfully
- [ ] Health check passing
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Database migrations run (if needed)
- [ ] Monitoring configured

---

## 🎉 Success!

Your Strapi CMS is now deployed on Fly.io with:
- ✅ Minimal resource usage (~$4/month)
- ✅ Always-available architecture
- ✅ Auto-restart on failures
- ✅ Health checks configured
- ✅ Production-ready security

**Admin Panel**: `https://your-app.fly.dev/admin`  
**API Base**: `https://your-app.fly.dev/api`

---

*Built with embracingearth.space architecture*  
*Enterprise-grade, cost-optimized, always-available*
