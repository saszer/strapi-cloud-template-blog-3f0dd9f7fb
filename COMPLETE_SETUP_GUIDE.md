# 🚀 Complete Setup Guide: Strapi + Frontend Connection

## Step 1: Set Strapi Environment Variables (Fly.io)

**YES, you need to set these for Strapi to work!**

### Quick Setup (Automated)

**Windows:**
```powershell
cd strapi-cloud-template-blog-3f0dd9f7fb
.\setup-fly-secrets.ps1
```

**Linux/Mac:**
```bash
cd strapi-cloud-template-blog-3f0dd9f7fb
chmod +x setup-fly-secrets.sh
./setup-fly-secrets.sh
```

### Manual Setup

Run these commands to set required secrets in Fly.io:

```bash
# Generate keys (run 8 times)
openssl rand -base64 32

# Set all required secrets (replace with your generated keys)
fly secrets set "APP_KEYS=key1,key2,key3,key4" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "API_TOKEN_SALT=key5" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "ADMIN_JWT_SECRET=key6" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "TRANSFER_TOKEN_SALT=key7" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "JWT_SECRET=key8" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "NODE_ENV=production" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "HOST=0.0.0.0" -a strapi-cloud-template-blog-3f0dd9f7fb
fly secrets set "PORT=1337" -a strapi-cloud-template-blog-3f0dd9f7fb

# IMPORTANT: Set CORS to allow your website
fly secrets set "CORS_ORIGIN=https://ai2fin.com,https://www.ai2fin.com,https://your-frontend-domain.com" -a strapi-cloud-template-blog-3f0dd9f7fb

# Set public URL (get this after deployment)
fly secrets set "PUBLIC_URL=https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev" -a strapi-cloud-template-blog-3f0dd9f7fb
```

### Deploy Strapi

```bash
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb
```

### Get Your Strapi URL

After deployment, get your Strapi URL:
```bash
fly status -a strapi-cloud-template-blog-3f0dd9f7fb
```

It will be something like: `https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev`

---

## Step 2: Create API Token in Strapi

1. **Open Strapi Admin Panel:**
   ```
   https://your-strapi-url.fly.dev/admin
   ```

2. **Create Admin Account** (first time only):
   - Fill in your admin details
   - Save

3. **Create API Token:**
   - Go to **Settings** → **API Tokens**
   - Click **Create new API Token**
   - Name: `Frontend API Token`
   - Token type: **Read-only** (or **Custom** with these permissions):
     - Article: `find`, `findOne` ✅
     - Category: `find`, `findOne` ✅
     - Author: `find`, `findOne` ✅
     - Tag: `find`, `findOne` ✅
   - Duration: **Unlimited**
   - Click **Save**
   - **COPY THE TOKEN** (shown only once!)

4. **Enable Public Permissions** (if using Read-only token):
   - Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
   - Enable:
     - Article: `find`, `findOne` ✅
     - Category: `find`, `findOne` ✅
     - Author: `find`, `findOne` ✅
     - Tag: `find`, `findOne` ✅
   - Click **Save**

---

## Step 3: Set Frontend Environment Variables

In your **frontend project** (`Website Front/Website Front/`), create or update `.env.local`:

```env
# Strapi Connection
STRAPI_BASE_URL=https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev
STRAPI_API_TOKEN=your-api-token-from-step-2

# Your website URL (optional)
NEXT_PUBLIC_SITE_URL=https://ai2fin.com
```

**Where to set these:**

### For Local Development:
- Create `.env.local` in `Website Front/Website Front/` directory

### For Production (Vercel/Cloudflare Pages/etc):
- **Vercel**: Project Settings → Environment Variables
- **Cloudflare Pages**: Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

---

## Step 4: Test Connection

### Test 1: Check Strapi is Running

```bash
# Check Strapi health
curl https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev/_health

# Should return: {"status":"ok"}
```

### Test 2: Test API from Browser

Open in browser:
```
https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev/api/articles
```

Should return JSON with articles (or empty array if no articles yet).

### Test 3: Test from Frontend

If your frontend has a test endpoint, visit:
```
https://your-frontend.com/api/test-strapi
```

Or check browser console when visiting `/blog` page.

---

## Step 5: Update CORS in Strapi (If Needed)

If you get CORS errors, update CORS_ORIGIN in Fly.io:

```bash
fly secrets set "CORS_ORIGIN=https://ai2fin.com,https://www.ai2fin.com,https://your-frontend-domain.com" -a strapi-cloud-template-blog-3f0dd9f7fb

# Restart app
fly apps restart -a strapi-cloud-template-blog-3f0dd9f7fb
```

---

## 📋 Quick Checklist

### Strapi (Fly.io):
- [ ] Set `APP_KEYS` secret
- [ ] Set `API_TOKEN_SALT` secret
- [ ] Set `ADMIN_JWT_SECRET` secret
- [ ] Set `TRANSFER_TOKEN_SALT` secret
- [ ] Set `JWT_SECRET` secret
- [ ] Set `CORS_ORIGIN` with your frontend domains
- [ ] Set `PUBLIC_URL` with your Strapi URL
- [ ] Deployed successfully
- [ ] Admin account created
- [ ] API token created
- [ ] Public permissions enabled

### Frontend:
- [ ] `STRAPI_BASE_URL` set to your Strapi URL
- [ ] `STRAPI_API_TOKEN` set (from Strapi admin)
- [ ] Environment variables saved
- [ ] Frontend deployed/restarted
- [ ] Blog page loads without errors

---

## 🔗 API Endpoints Reference

Your frontend can access:

```
# Get all articles
GET https://your-strapi.fly.dev/api/articles?populate=*&sort=publishedAt:desc

# Get single article by slug
GET https://your-strapi.fly.dev/api/articles?filters[slug][$eq]=article-slug&populate=*

# Get categories
GET https://your-strapi.fly.dev/api/categories?populate=articles

# Get authors
GET https://your-strapi.fly.dev/api/authors?populate=articles

# Get tags
GET https://your-strapi.fly.dev/api/tags?populate=articles
```

---

## 🐛 Troubleshooting

### Strapi won't start
- Check logs: `fly logs -a strapi-cloud-template-blog-3f0dd9f7fb`
- Verify all secrets are set: `fly secrets list -a strapi-cloud-template-blog-3f0dd9f7fb`

### CORS errors
- Update `CORS_ORIGIN` in Fly.io secrets
- Restart Strapi: `fly apps restart -a strapi-cloud-template-blog-3f0dd9f7fb`

### 401 Unauthorized
- Check `STRAPI_API_TOKEN` in frontend env vars
- Verify API token in Strapi admin (Settings → API Tokens)
- Check public permissions are enabled

### No articles showing
- Create articles in Strapi admin
- Make sure articles are **Published** (not Draft)
- Check API endpoint directly in browser

---

## 📚 Next Steps

1. **Create Content in Strapi:**
   - Go to admin panel
   - Create Categories, Authors, then Articles
   - Publish articles

2. **Customize Frontend:**
   - Update blog styling in `Website Front/Website Front/app/blog/`
   - Customize article layout in `app/blog/[slug]/page.tsx`

3. **SEO Optimization:**
   - Fill out metaTitle, metaDescription in Strapi
   - Add keywords and canonical URLs

---

*embracingearth.space - Enterprise-grade CMS integration*

