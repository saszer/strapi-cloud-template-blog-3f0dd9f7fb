# ⚡ Quick Start Guide

**Get your AI2Fin blog CMS running in 5 minutes**

---

## Step 1: Install (30 seconds)

```bash
cd strapi-cloud-template-blog-3f0dd9f7fb
npm install
```

---

## Step 2: Environment Setup (1 minute)

Create `.env` file in root:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="ReplaceWithRandomKey1,ReplaceWithRandomKey2"
API_TOKEN_SALT=ReplaceWithRandomSalt
ADMIN_JWT_SECRET=ReplaceWithRandomSecret
TRANSFER_TOKEN_SALT=ReplaceWithRandomSalt
JWT_SECRET=ReplaceWithRandomSecret

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

CORS_ORIGIN=http://localhost:3000,https://ai2fin.com
```

**Generate secure keys:**
```bash
# Run this 5 times for each key/salt
openssl rand -base64 32
```

---

## Step 3: Start Strapi (30 seconds)

```bash
npm run develop
```

Wait for:
```
Welcome back!
To manage your project 🚀, go to the administration panel at:
http://localhost:1337/admin
```

---

## Step 4: Create Admin Account (1 minute)

1. Open: http://localhost:1337/admin
2. Fill in:
   - First name
   - Last name
   - Email
   - Password (min 8 characters)
3. Click **Let's start**

---

## Step 5: Configure API Permissions (2 minutes)

### Enable Public Read Access

1. Go to **Settings** (⚙️ icon) → **Users & Permissions Plugin** → **Roles**
2. Click **Public**
3. Enable these permissions:

**Article:**
- ✅ find
- ✅ findOne

**Author:**
- ✅ find
- ✅ findOne

**Category:**
- ✅ find
- ✅ findOne

**Tag:**
- ✅ find
- ✅ findOne

4. Click **Save**

---

## Step 6: Create Your First Content (3 minutes)

### Create an Author

1. Go to **Content Manager** → **Author** → **Create new entry**
2. Fill:
   - Name: `Your Name`
   - Email: `your@email.com`
   - Bio: `Brief description...`
   - Twitter: `yourusername` (optional)
3. Click **Save**

### Create a Category

1. Go to **Content Manager** → **Category** → **Create new entry**
2. Fill:
   - Name: `Technology` (slug auto-generates)
   - Description: `Tech articles and tutorials`
   - Color: `#3B82F6` (blue)
3. Click **Save**

### Create a Tag

1. Go to **Content Manager** → **Tag** → **Create new entry**
2. Fill:
   - Name: `AI` (slug auto-generates)
   - Color: `#10B981` (green)
3. Click **Save**

### Create Your First Article

1. Go to **Content Manager** → **Article** → **Create new entry**
2. Fill required fields:
   - **Title:** `Getting Started with AI2Fin`
   - **Slug:** Auto-generated (or customize)
   - **Excerpt:** `Learn how to use AI-powered financial management...`
   - **Content:** Write your article (richtext editor)
   - **Author:** Select the author you created
3. Optional fields:
   - **Featured Image:** Upload a cover image
   - **Category:** Select "Technology"
   - **Tags:** Select "AI"
   - **Meta Title:** `Getting Started with AI2Fin - AI2Fin Blog`
   - **Meta Description:** `Comprehensive guide to AI-powered financial management...`
   - **Keywords:** `AI, financial management, automation`
4. Click **Publish** (top right)

---

## Step 7: Test the API (1 minute)

Open in browser or use curl:

### Get All Articles
```
http://localhost:1337/api/articles?populate=*
```

Expected: JSON with your article

### Get Article by Slug
```
http://localhost:1337/api/articles?filters[slug][$eq]=getting-started-with-ai2fin&populate=*
```

Expected: Single article data

---

## Step 8: Connect to Frontend

### Update Frontend Environment

In `Website Front/Website Front/.env.local`:

```env
STRAPI_BASE_URL=http://localhost:1337
STRAPI_API_TOKEN=
```

### Test Frontend

```bash
cd "Website Front/Website Front"
npm run dev
```

Visit: http://localhost:3000/blog

You should see your article!

---

## ✅ Success Checklist

- [ ] Strapi running on http://localhost:1337
- [ ] Admin account created
- [ ] Public API permissions enabled
- [ ] At least 1 Author created
- [ ] At least 1 Category created
- [ ] At least 1 Article published
- [ ] API returning data at `/api/articles?populate=*`
- [ ] Frontend displaying blog content

---

## 🚨 Troubleshooting

### Port 1337 already in use
```bash
# Change PORT in .env
PORT=1338
```

### "Forbidden" on API calls
- Check API permissions (Step 5)
- Ensure article is **Published**, not Draft

### Article not showing on frontend
- Verify `STRAPI_BASE_URL` in frontend `.env.local`
- Check article is published
- Restart frontend: `npm run dev`

### Images not displaying
- Upload images through Strapi media library
- Ensure CORS allows image requests
- Check image URLs in API response

---

## 📚 Next Steps

1. **Read Full Documentation:** `SETUP_GUIDE.md`
2. **Configure Production:** `ENV_TEMPLATE.md`
3. **Set API Permissions:** `API_PERMISSIONS_SETUP.md`
4. **Create more content:** Authors, categories, articles
5. **Customize:** Add custom fields if needed

---

## 🎓 Learn More

- **Content Types:** See `src/api/` for schema definitions
- **API Reference:** http://localhost:1337/documentation
- **Strapi Docs:** https://docs.strapi.io

---

**🎉 Congratulations! Your blog CMS is ready!**

*Built with embracingearth.space architecture*  
*Enterprise-grade, SEO-optimized, scalable to 100k+ users*
