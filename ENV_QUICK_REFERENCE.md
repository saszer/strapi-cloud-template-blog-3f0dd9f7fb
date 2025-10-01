# ⚡ Environment Variables Quick Reference

**TL;DR: Where to set what**

---

## 🎯 Split by Platform

### ☁️ STRAPI CLOUD Dashboard
**Location**: https://cloud.strapi.io → Your Project → Settings → Variables

```env
# CORS - CRITICAL! Add ALL your frontend domains
CORS_ORIGIN=https://ai2fin.com,https://www.ai2fin.com,https://ai2fin.pages.dev

# Public URL (your Strapi Cloud URL)
PUBLIC_URL=https://your-project.strapiapp.com

# Node environment
NODE_ENV=production
```

**That's it!** Other vars (APP_KEYS, DATABASE, etc.) are auto-configured by Strapi Cloud.

---

### 🌐 CLOUDFLARE PAGES Dashboard
**Location**: https://dash.cloudflare.com → Pages → Your Project → Settings → Environment Variables

```env
# Strapi connection
STRAPI_BASE_URL=https://your-project.strapiapp.com
STRAPI_API_TOKEN=your-read-only-token

# Site URL
NEXT_PUBLIC_SITE_URL=https://ai2fin.com
```

---

## 🔑 How to Get STRAPI_API_TOKEN

1. Login to Strapi admin: `https://your-project.strapiapp.com/admin`
2. Go to **Settings** → **API Tokens** → **Create new API Token**
3. Name: `Cloudflare Frontend`
4. Type: **Read-only**
5. **Copy the token** (shown once!)
6. Paste in Cloudflare Pages as `STRAPI_API_TOKEN`

---

## ✅ Checklist

### In Strapi Cloud:
- [ ] `CORS_ORIGIN` includes `https://ai2fin.com`
- [ ] `CORS_ORIGIN` includes `https://ai2fin.pages.dev`
- [ ] `PUBLIC_URL` is set to your Strapi Cloud URL
- [ ] API Token created (Read-only)
- [ ] Public permissions enabled (Article, Author, Category, Tag)

### In Cloudflare Pages:
- [ ] `STRAPI_BASE_URL` points to Strapi Cloud
- [ ] `STRAPI_API_TOKEN` is set (from Strapi)
- [ ] `NEXT_PUBLIC_SITE_URL` is your production domain
- [ ] Variables saved in **Production** environment

---

## 🧪 Test Connection

### Test 1: Browser Console
On `https://ai2fin.com`, open console and run:
```javascript
fetch('https://your-project.strapiapp.com/api/articles')
  .then(r => r.json())
  .then(console.log)
```

✅ Should return articles  
❌ CORS error? Check `CORS_ORIGIN` in Strapi Cloud

### Test 2: Visit Blog
Go to: `https://ai2fin.com/blog`

✅ Articles display  
❌ Empty? Check browser console for errors

---

## 🚨 Common Issues

### CORS Error
**Fix**: Add your domain to `CORS_ORIGIN` in Strapi Cloud (comma-separated, no spaces)

### 401 Unauthorized
**Fix**: Check `STRAPI_API_TOKEN` in Cloudflare Pages matches token from Strapi

### Images Not Loading
**Fix**: Verify `PUBLIC_URL` in Strapi Cloud matches your Strapi URL

---

## 📖 Full Documentation

See **[CLOUDFLARE_STRAPI_CLOUD_SETUP.md](./CLOUDFLARE_STRAPI_CLOUD_SETUP.md)** for complete guide.

---

**✅ That's all you need! Simple and secure.**

*embracingearth.space - Enterprise-grade architecture*
