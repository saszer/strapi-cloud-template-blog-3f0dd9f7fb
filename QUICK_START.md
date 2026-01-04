# ⚡ Quick Start: Connect Your Website to Strapi

## TL;DR - What You Need to Do

### 1️⃣ Set Strapi Secrets (Fly.io) - **REQUIRED**

```bash
# Run the setup script (easiest)
cd strapi-cloud-template-blog-3f0dd9f7fb
.\setup-fly-secrets.ps1  # Windows
# OR
./setup-fly-secrets.sh   # Linux/Mac

# Then deploy
fly deploy -a strapi-cloud-template-blog-3f0dd9f7fb
```

### 2️⃣ Get Your Strapi URL

```bash
fly status -a strapi-cloud-template-blog-3f0dd9f7fb
# URL will be: https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev
```

### 3️⃣ Create API Token in Strapi

1. Visit: `https://your-strapi-url.fly.dev/admin`
2. Create admin account (first time)
3. Go to **Settings** → **API Tokens** → **Create new API Token**
4. Type: **Read-only**
5. **Copy the token** (shown once!)

### 4️⃣ Set Frontend Environment Variables

In `Website Front/Website Front/.env.local`:

```env
STRAPI_BASE_URL=https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev
STRAPI_API_TOKEN=your-token-from-step-3
```

### 5️⃣ Done! 🎉

Your website/blog will now connect to Strapi automatically.

---

## Required Environment Variables Summary

### Strapi (Fly.io Secrets):
- ✅ `APP_KEYS` - **REQUIRED**
- ✅ `API_TOKEN_SALT` - **REQUIRED**
- ✅ `ADMIN_JWT_SECRET` - **REQUIRED**
- ✅ `TRANSFER_TOKEN_SALT` - **REQUIRED**
- ✅ `JWT_SECRET` - **REQUIRED**
- ⚠️ `CORS_ORIGIN` - **Recommended** (your frontend domains)

### Frontend (.env.local):
- ✅ `STRAPI_BASE_URL` - Your Strapi URL
- ✅ `STRAPI_API_TOKEN` - Token from Strapi admin

---

## Test It Works

```bash
# Test Strapi API
curl https://your-strapi.fly.dev/api/articles

# Should return JSON (even if empty array)
```

Visit your blog page - it should load articles from Strapi!

---

**Full guide:** See `COMPLETE_SETUP_GUIDE.md` for detailed instructions.
