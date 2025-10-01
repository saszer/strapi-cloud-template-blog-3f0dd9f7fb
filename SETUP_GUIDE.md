# 🚀 AI2Fin Strapi CMS Setup Guide

**Enterprise-grade blog CMS optimized for SEO and LLM ranking**  
*embracingearth.space - Built for 100k+ concurrent users*

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Content Types Overview](#content-types-overview)
3. [Frontend Connection](#frontend-connection)
4. [SEO Optimization](#seo-optimization)
5. [Production Deployment](#production-deployment)

---

## 🎯 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update:
- `APP_KEYS`: Generate with `openssl rand -base64 32`
- `CORS_ORIGIN`: Add your frontend domain(s)
- Database credentials (use PostgreSQL for production)

### 3. Start Development Server

```bash
npm run develop
```

Access admin panel: `http://localhost:1337/admin`

### 4. Create Admin User

On first launch, create your admin account.

---

## 📦 Content Types Overview

### Article (Blog Post)

**Required Fields:**
- `title` (string, max 255) - SEO-optimized article title
- `slug` (uid) - Auto-generated from title
- `content` (richtext) - Main article content
- `author` (relation) - Must link to an Author

**Optional Fields:**
- `excerpt` (text, max 500) - Short description
- `featuredImage` (media) - Cover image
- `category` (relation) - Article category
- `tags` (relation, many-to-many) - Content tags

**SEO Fields:**
- `metaTitle` (string, max 60) - Custom meta title
- `metaDescription` (text, max 160) - Meta description
- `keywords` (text) - Comma-separated keywords
- `canonicalUrl` (string) - Canonical URL for duplicate content

**Auto Fields:**
- `publishedAt` (datetime) - Publication date
- `updatedAt` (datetime) - Last update timestamp

---

### Author

**Required Fields:**
- `name` (string, max 255)
- `email` (email, unique)

**Optional Fields:**
- `bio` (text, max 1000)
- `avatar` (media, images only)
- `twitter` (string) - Twitter handle
- `linkedin` (string) - LinkedIn profile
- `github` (string) - GitHub username
- `website` (string) - Personal website URL

---

### Category

**Required Fields:**
- `name` (string, max 100)
- `slug` (uid) - Auto-generated from name

**Optional Fields:**
- `description` (text, max 500)
- `color` (string, max 7) - Hex color code (default: #6B7280)

---

### Tag

**Required Fields:**
- `name` (string, max 100)
- `slug` (uid) - Auto-generated from name

**Optional Fields:**
- `color` (string, max 7) - Hex color code (default: #6B7280)

---

## 🔗 Frontend Connection

### Setup Environment Variables

In your **Next.js frontend** (`.env.local`):

```env
STRAPI_BASE_URL=https://automatic-positivity-3a6b42eb07.strapiapp.com
STRAPI_API_TOKEN=your-api-token-here
```

### API Endpoints

All content is available via REST API:

#### Get All Articles
```
GET /api/articles?populate=*&sort=publishedAt:desc
```

#### Get Single Article by Slug
```
GET /api/articles?filters[slug][$eq]=your-slug&populate=*
```

#### Get Categories
```
GET /api/categories?populate=articles
```

#### Get Tags
```
GET /api/tags?populate=articles
```

### Frontend Integration

The frontend at `Website Front/` is already configured to connect. Key files:

- `lib/cms/strapi.ts` - Strapi API integration
- `lib/cms/blog.ts` - Blog content management
- `app/blog/page.tsx` - Blog index page
- `app/blog/[slug]/page.tsx` - Article detail page

---

## 🎯 SEO Optimization

### Best Practices for High SEO & LLM Ranking

#### 1. **Article SEO Fields**
Always fill out:
- `metaTitle`: 50-60 characters, include primary keyword
- `metaDescription`: 150-160 characters, compelling summary
- `keywords`: 5-10 relevant keywords, comma-separated
- `canonicalUrl`: Use if content exists elsewhere

#### 2. **Content Structure**
- Use clear headings (H2, H3) in richtext content
- Include internal links to related articles
- Add alt text to all images in `featuredImage`
- Keep paragraphs short and scannable

#### 3. **Author Credibility**
- Complete author `bio` with expertise
- Link social profiles (LinkedIn, Twitter, GitHub)
- Use professional author `avatar`

#### 4. **Category & Tags**
- Use 1 category per article (primary topic)
- Add 3-5 relevant tags per article
- Keep tag/category names consistent

#### 5. **Image Optimization**
- Use WebP format for `featuredImage`
- Optimize images to < 200KB
- Use descriptive filenames
- Add alt text in Strapi media library

---

## 📊 Structured Data (Automatic)

The frontend automatically generates:
- **Article Schema** (Google rich results)
- **Breadcrumb Schema** (navigation)
- **Author Schema** (E-A-T signals)
- **Organization Schema** (brand identity)

All powered by content from Strapi.

---

## 🔐 API Permissions

### Public Access (Read-Only)

For blog functionality, enable public read access:

1. Go to **Settings → Roles → Public**
2. Enable these permissions:

**Article:**
- `find` ✅
- `findOne` ✅

**Author:**
- `find` ✅
- `findOne` ✅

**Category:**
- `find` ✅
- `findOne` ✅

**Tag:**
- `find` ✅
- `findOne` ✅

### Authenticated Access

For admin/editor access, use API tokens:

1. Go to **Settings → API Tokens**
2. Create token with appropriate permissions
3. Add token to frontend `.env.local`

---

## 🚀 Production Deployment

### Database Migration

**Switch to PostgreSQL for production:**

1. Install PostgreSQL
2. Create database: `createdb strapi_production`
3. Update `.env`:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=secure-password
DATABASE_SSL=true
```

### Performance Optimization

#### Enable Caching
```env
CACHE_ENABLED=true
```

#### CDN for Media
Upload provider configuration for AWS S3/Cloudinary:

```env
UPLOAD_PROVIDER=aws-s3
AWS_BUCKET=ai2fin-media
AWS_REGION=us-east-1
```

#### Rate Limiting
```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_DURATION=60000
```

### Security Checklist

- ✅ Use strong `APP_KEYS` (32+ characters)
- ✅ Enable HTTPS only
- ✅ Configure CORS with specific origins
- ✅ Use environment variables (never commit `.env`)
- ✅ Enable rate limiting
- ✅ Regular backups of database
- ✅ Keep Strapi updated

---

## 📝 Content Creation Workflow

### Creating Your First Article

1. **Create Author**
   - Go to **Content Manager → Author → Create new entry**
   - Fill name, email, bio, social profiles
   - Upload avatar
   - Save & Publish

2. **Create Category**
   - Go to **Content Manager → Category → Create new entry**
   - Add name (auto-generates slug)
   - Add description and color hex code
   - Save

3. **Create Tags**
   - Go to **Content Manager → Tag → Create new entry**
   - Add tag name (auto-generates slug)
   - Optional: custom color
   - Save

4. **Create Article**
   - Go to **Content Manager → Article → Create new entry**
   - Fill required fields (title, content, author)
   - Add excerpt, featuredImage
   - Select category and tags
   - Fill SEO fields (metaTitle, metaDescription, keywords)
   - Save as draft or Publish

---

## 🔄 Syncing with Frontend

After adding content in Strapi:

1. Frontend auto-fetches on build (ISR revalidation: 60s)
2. Rebuild frontend: `npm run build` (if needed)
3. Articles appear at `https://ai2fin.com/blog`

---

## 🛠️ Troubleshooting

### CORS Errors
- Check `CORS_ORIGIN` in `.env`
- Restart Strapi after changing config
- Verify frontend URL is whitelisted

### Images Not Showing
- Check `PUBLIC_URL` in `.env`
- Ensure media library uploads are public
- Verify CORS allows image requests

### API Returns Empty Data
- Check API permissions (Settings → Roles)
- Ensure content is **Published** (not draft)
- Verify populate parameters: `?populate=*`

---

## 📞 Support

For issues or questions:
- **Frontend Code**: `Website Front/Website Front/`
- **Strapi Integration**: `lib/cms/strapi.ts`
- **Documentation**: This file

---

## 🎓 Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Next.js + Strapi Guide](https://strapi.io/blog/nextjs-strapi-blog)
- [SEO Best Practices](https://developers.google.com/search/docs)

---

**Built with ❤️ for AI2Fin**  
*embracingearth.space - Enterprise-grade CMS architecture*
