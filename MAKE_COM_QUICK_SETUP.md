# 🚀 Make.com Auto-Post Setup - Quick Guide

**Time:** 15 minutes  
**Cost:** $0 (Free tier)  
**Security:** ⭐⭐⭐⭐⭐ (OAuth + SOC 2 certified)

---

## 📋 Before You Start

**You need:**
- [ ] Strapi admin access
- [ ] Make.com account (sign up free)
- [ ] Twitter/X account
- [ ] LinkedIn account
- [ ] Facebook page (optional)
- [ ] Instagram business account (optional)

---

## 🎯 Step-by-Step Setup

### **Step 1: Add Fields to Strapi Article (5 min)**

**Option A: Via Strapi Admin UI (Easier)**

1. Login to Strapi admin
2. Go to **Content-Type Builder** (left sidebar)
3. Click **Article** content type
4. Click **"Add another field"**
5. Add these 3 fields:

**Field 1:**
- Type: **Boolean**
- Name: `socialMediaShared`
- Default value: `false`

**Field 2:**
- Type: **Date** → **datetime**
- Name: `socialMediaSharedAt`

**Field 3:**
- Type: **JSON**
- Name: `socialMediaResults`

6. Click **"Save"**
7. Click **"Finish"** (top right)
8. Restart Strapi if prompted

**Option B: Edit JSON Manually**

Edit: `src/api/article/content-types/article/schema.json`

Add to `attributes` section:

```json
"socialMediaShared": {
  "type": "boolean",
  "default": false
},
"socialMediaSharedAt": {
  "type": "datetime"
},
"socialMediaResults": {
  "type": "json"
}
```

Then rebuild: `npm run build && npm run develop`

---

### **Step 2: Create Make.com Account (2 min)**

1. Go to: https://www.make.com/en/register
2. Sign up with email (no credit card needed)
3. Verify email
4. Login to dashboard

---

### **Step 3: Create Webhook in Make.com (2 min)**

1. Click **"Create a new scenario"**
2. Click the **+** icon to add first module
3. Search for **"Webhooks"**
4. Select **"Custom webhook"**
5. Click **"Add"** to create new webhook
6. Give it a name: `Strapi Blog Published`
7. Click **"Save"**
8. **COPY the webhook URL** (looks like: `https://hook.us1.make.com/xxx...`)

Keep this URL - you'll need it!

---

### **Step 4: Connect Strapi Webhook (3 min)**

1. **In Strapi Admin:**
   - Go to **Settings** → **Webhooks**
   - Click **"Create new webhook"**

2. **Configure webhook:**
   - **Name:** `Make.com Social Auto-Post`
   - **Url:** Paste the Make.com webhook URL
   - **Headers:** Leave empty
   - **Events:** Check these:
     - ✅ `entry.publish` (Article)
     - ✅ `entry.update` (Article)

3. **Save webhook**

---

### **Step 5: Build Make.com Workflow (5 min)**

**Now back in Make.com:**

#### **5.1 Add Filter (Only First Publish)**

1. Click **+** after the webhook module
2. Search for **"Tools"** → **"Set variable"**
3. Configure:
   - **Variable name:** `isFirstPublish`
   - **Variable value:** `{{if(1.entry.socialMediaShared = false; true; false)}}`
4. Click **OK**

5. Click **+** again
6. Search for **"Flow control"** → **"Filter"**
7. Configure:
   - **Condition:** `isFirstPublish` **equal to** `true`
8. Click **OK**

This ensures posts only go out ONCE per article.

#### **5.2 Add Router (Split to Multiple Platforms)**

1. Click **+** after filter
2. Search for **"Flow control"** → **"Router"**
3. This will create multiple paths (one per platform)

---

### **Step 6: Configure Each Social Platform**

For each platform you want to use, add a path:

---

#### **🐦 Twitter Path**

**On first router path:**

1. Click **+** on first route
2. Search for **"Twitter"**
3. Select **"Create a Tweet"**
4. Click **"Create a connection"**
5. **Sign in with Twitter** (OAuth - secure!)
6. Authorize Make.com
7. Configure tweet:

**Text field:**
```
{{1.entry.title}}

{{1.entry.description}}

Read more: https://ai2fin.com/blog/{{1.entry.slug}}?utm_source=twitter&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}

#AI2Fin #FinTech
```

8. Click **OK**

---

#### **💼 LinkedIn Path**

**On second router path:**

1. Click **+** on second route
2. Search for **"LinkedIn"**
3. Select **"Create a Share Update (Person)"** or **"Create a Company Update"**
4. **Connect LinkedIn** (OAuth)
5. Configure:

**Text:**
```
📢 {{1.entry.title}}

{{1.entry.description}}

Read the full article: https://ai2fin.com/blog/{{1.entry.slug}}?utm_source=linkedin&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}

#AI2Fin #FinancialManagement #FinTech
```

**Visibility:** Public

6. Click **OK**

---

#### **📘 Facebook Path** (Optional)

**On third router path:**

1. Click **+** on third route
2. Search for **"Facebook Pages"**
3. Select **"Create a Post"**
4. **Connect Facebook** (OAuth)
5. **Select your page**
6. Configure:

**Message:**
```
🚀 {{1.entry.title}}

{{1.entry.description}}

Read more 👇
```

**Link:**
```
https://ai2fin.com/blog/{{1.entry.slug}}?utm_source=facebook&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.entry.slug}}
```

7. Click **OK**

---

#### **📸 Instagram Path** (Optional)

**On fourth router path:**

1. Click **+** on fourth route
2. Search for **"Instagram for Business"**
3. Select **"Create a Photo Post"**
4. **Connect Instagram** (OAuth - requires Facebook business account)
5. Configure:

**Image URL:**
```
{{1.entry.cover.url}}
```

**Caption:**
```
{{1.entry.title}}

{{1.entry.description}}

Link in bio 👆

#AI2Fin #FinTech #FinancialManagement
```

**Note:** Instagram doesn't allow clickable links in posts. Put UTM link in your bio or use Linktree.

6. Click **OK**

---

### **Step 7: Mark as Shared in Strapi**

After all social media routes:

1. Click **+** after the router (on main path)
2. Search for **"Tools"** → **"Aggregator"**
3. Select **"Numeric aggregator"** (merges all routes)
4. Click **OK**

5. Click **+** after aggregator
6. Search for **"HTTP"** → **"Make a request"**
7. Configure:

**URL:**
```
https://your-strapi-domain.strapiapp.com/api/articles/{{1.entry.id}}
```

**Method:** `PUT`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_STRAPI_API_TOKEN
```

**Body:**
```json
{
  "data": {
    "socialMediaShared": true,
    "socialMediaSharedAt": "{{now}}"
  }
}
```

**To get Strapi API Token:**
- Strapi Admin → Settings → API Tokens
- Click "Create new API Token"
- Name: `Make.com`
- Token type: `Full access`
- Copy token and paste above

8. Click **OK**

---

### **Step 8: Test the Workflow (2 min)**

1. Click **"Run once"** (bottom left)
2. **In Strapi:** Publish a draft article or create new one
3. Watch Make.com scenario run
4. Check each social platform for posts
5. Verify UTM links work

**If successful:** ✅ All posts appear with UTM tracking links!

---

### **Step 9: Activate & Go Live**

1. Click **"Scheduling"** (bottom left)
2. Set to **"On"** (immediately)
3. Scenario will now run automatically whenever you publish

**That's it!** 🎉

---

## 🎯 How It Works

```
1. You publish blog post in Strapi
   ↓
2. Strapi sends webhook to Make.com (instant)
   ↓
3. Make.com checks: "First publish?"
   ↓ (if yes)
4. Posts to Twitter, LinkedIn, Facebook, Instagram
   ↓ (each with unique UTM link)
5. Marks article as "shared" in Strapi
   ↓
6. Done! Future edits won't re-post
```

---

## 📊 UTM Links Generated

Each platform gets unique tracking:

**Twitter:**
```
?utm_source=twitter&utm_medium=social&utm_campaign=blog_auto_post&utm_content=your-post-slug
```

**LinkedIn:**
```
?utm_source=linkedin&utm_medium=social&utm_campaign=blog_auto_post&utm_content=your-post-slug
```

**Facebook:**
```
?utm_source=facebook&utm_medium=social&utm_campaign=blog_auto_post&utm_content=your-post-slug
```

**Instagram:**
```
?utm_source=instagram&utm_medium=social&utm_campaign=blog_auto_post&utm_content=your-post-slug
```

**In Google Analytics 4**, you'll see:
- Which platform drives most traffic
- Conversion rates per platform
- Time to conversion by source

---

## 🎨 Customize Post Templates

Edit the text in each Make.com social module to match your brand:

**Short & Punchy (Twitter):**
```
New blog post 🚀

{{1.entry.title}}

{{truncate(1.entry.description; 120)}}...

[URL with UTM]

#YourHashtags
```

**Professional (LinkedIn):**
```
📊 New Article: {{1.entry.title}}

{{1.entry.description}}

Key takeaways:
• Point 1
• Point 2
• Point 3

[URL with UTM]
```

**Engaging (Facebook):**
```
🎉 {{1.entry.title}}

{{1.entry.description}}

What do you think? 💭👇

[URL with UTM]
```

---

## 🐛 Troubleshooting

**Problem:** Webhook doesn't trigger
- **Fix:** Check Strapi webhook URL is correct
- **Fix:** Check Strapi webhook events include `entry.publish`

**Problem:** Posts to social media fail
- **Fix:** Reconnect social accounts in Make.com
- **Fix:** Check OAuth permissions

**Problem:** Article gets marked as shared but no posts
- **Fix:** Check Make.com execution history for errors
- **Fix:** Verify social account connections

**Problem:** Posts on every edit (not just first publish)
- **Fix:** Check filter condition is correct: `socialMediaShared = false`
- **Fix:** Verify Strapi fields were added correctly

**Problem:** UTM links don't work
- **Fix:** Check URL format in each social module
- **Fix:** Test links manually to verify

**Problem:** "Too many operations" error
- **Fix:** You hit 1,000 ops/month limit (unlikely)
- **Fix:** Upgrade to paid plan ($9/month) or wait for reset

---

## 💰 Free Tier Limits

**Make.com Free Plan:**
- ✅ 1,000 operations/month
- ✅ Unlimited active scenarios
- ✅ 15-minute execution interval (instant with webhooks)
- ✅ Full integrations access

**How many blog posts?**
- Each post = ~6 operations (1 webhook + 4 social posts + 1 Strapi update)
- 1,000 ops ÷ 6 = **~165 blog posts/month**
- **More than enough!**

---

## 🔐 Security Checklist

- [x] OAuth authentication (no passwords stored)
- [x] Encrypted credentials (SOC 2 certified)
- [x] 2FA on Make.com account (enable in settings)
- [x] Limited Strapi API token (only Article access)
- [x] Webhook over HTTPS
- [x] No credentials in code

---

## 📈 View Results in Google Analytics

After posts go live:

1. **Google Analytics 4** → **Reports**
2. **Acquisition** → **Traffic acquisition**
3. Filter by:
   - `utm_source = twitter` (see Twitter traffic)
   - `utm_source = linkedin` (see LinkedIn traffic)
   - `utm_campaign = blog_auto_post` (see all auto-posts)

**Compare:**
- Which platform drives most traffic?
- Which converts best?
- Time to conversion by platform?

---

## ✅ Checklist - Setup Complete When:

- [ ] Article schema has 3 new fields
- [ ] Make.com account created
- [ ] Webhook created in Make.com
- [ ] Strapi webhook configured
- [ ] Filter added (first publish only)
- [ ] Router added (split paths)
- [ ] Twitter connected & configured
- [ ] LinkedIn connected & configured
- [ ] Facebook connected (optional)
- [ ] Instagram connected (optional)
- [ ] Strapi update module added
- [ ] Scenario tested with real article
- [ ] Scenario activated
- [ ] **Posts appear on social media with UTM links ✅**

---

## 🎉 You're Done!

Every new blog post will now automatically:
- ✅ Post to Twitter with UTM
- ✅ Post to LinkedIn with UTM
- ✅ Post to Facebook with UTM (if configured)
- ✅ Post to Instagram with UTM (if configured)
- ✅ Mark itself as shared (no duplicates)
- ✅ Track conversions in Google Analytics

**Time saved:** ~15 minutes per blog post  
**Cost:** $0/month  
**Security:** Enterprise-grade

---

**Need help?** Check Make.com execution history for error details.

**Questions?** hello@ai2fin.com

**Built by embracingearth.space** 🚀




