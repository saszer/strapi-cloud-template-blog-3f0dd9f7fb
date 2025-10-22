# 🚀 Secure Auto-Post to Social Media - Setup Guide

## 🎯 Solution: Make.com (Zapier Alternative)

**Why Make.com?**
- ✅ FREE: 1,000 operations/month
- ✅ Secure OAuth (no password storage)
- ✅ Built-in UTM parameters
- ✅ Visual workflow builder
- ✅ Supports: Twitter, LinkedIn, Facebook, Instagram, Pinterest, Reddit
- ✅ Strapi webhook integration

**embracingearth.space - Enterprise-grade automation, securely**

---

## 📋 Prerequisites

1. **Social Media Accounts:**
   - Twitter/X account
   - LinkedIn personal/company page
   - Facebook page
   - Instagram business account (connected to Facebook)

2. **Make.com Account:**
   - Sign up: https://www.make.com/en/register
   - Free tier (no credit card needed)

3. **Strapi Access:**
   - Your Strapi admin panel
   - Ability to configure webhooks

---

## 🔧 Part 1: Create Make.com Scenario (10 minutes)

### Step 1: Sign Up for Make.com

1. Go to: https://www.make.com/en/register
2. Sign up with email (free account)
3. Verify email
4. Login to dashboard

### Step 2: Create New Scenario with Webhook

1. Click **"Create a new scenario"**
2. Click the **big circle with +** in the center
3. Search for **"Webhooks"**
4. Select **"Custom webhook"**
5. Click **"Add"** 
6. Give it a name: **"Strapi Article Published"**
7. Click **"Save"**
8. **COPY the webhook URL** shown (looks like `https://hook.us1.make.com/xxxxx...`)
9. Keep this tab open - you'll need the URL!

### Step 3: Connect Strapi to Webhook

Now we tell Strapi to call this webhook when an article is published:

**In Strapi Admin:**

1. Go to **Settings** (left sidebar) → **Global Settings** → **Webhooks**
2. Click **"Create new webhook"**
3. Configure:
   - **Name**: `Make.com Auto-Post`
   - **Url**: Paste the Make.com webhook URL from Step 2
   - **Headers**: Leave empty (optional)
   - **Events**: Check these:
     - ✅ `entry.publish` under **Article**
     - ✅ `entry.update` under **Article**
4. Click **"Save"**

**Test it:**
- In Strapi, edit any article and click **"Publish"**
- Go back to Make.com scenario
- You should see data appear (article details)
- If you see data, webhook is working! ✅

### Step 4: Add Filter (Only First Publish)

1. Click **+** after the webhook module
2. Search for **"Tools"** → Select **"Set variable"**
3. Configure:
   - **Variable name**: `isFirstPublish`
   - **Variable value**: `{{if(1.entry.socialMediaShared = false; true; false)}}`
4. Click **OK**

5. Click **+** again after the "Set variable"
6. Search for **"Flow control"** → Select **"Filter"**
7. Configure:
   - **Label**: "Only if not shared yet"
   - **Condition**: 
     - Field: `isFirstPublish`
     - Operator: **Equal to**
     - Value: `true`
8. Click **OK**

This ensures posts only go out ONCE, not on every edit.

**What the data looks like:**
- `1.entry.id` = Article ID
- `1.entry.title` = Article title
- `1.entry.slug` = Article slug
- `1.entry.description` = Article description
- `1.entry.socialMediaShared` = true/false (if already posted)

### Step 5: Add Hashtag Generation (BEFORE Router!)

**Add hashtag processing BEFORE the router so all platforms get the same hashtags:**

#### **Text Parser Module (Split Keywords):**
1. Search for **"Text Parser"**
2. Select **"Replace"** (split by comma)
3. Configure:
   - **Text**: `{{1.keywords}}`
   - **Find**: `,`
   - **Replace**: `\n` (newline)
   - **Use Regular Expression**: ✅ Yes
   - **Output**: `Keywords separated by newlines`

#### **Text Parser Module (Format as Hashtags):**
1. Search for **"Text Parser"** 
2. Select **"Replace"**
3. Configure:
   - **Text**: `{{previous.keywords}}`
   - **Find**: `^(.+)$`
   - **Replace**: `#{{$1.trim()}}`
   - **Use Regular Expression**: ✅ Yes
   - **Output**: `Hashtags with newlines`

#### **Text Parser Module (Join Hashtags):**
1. Search for **"Text Parser"**
2. Select **"Replace"**
3. Configure:
   - **Text**: `{{previous.hashtags}}`
   - **Find**: `\n`
   - **Replace**: ` ` (space)
   - **Use Regular Expression**: ✅ Yes
   - **Output**: `{{hashtags}}` (single string)

### 📊 Correct Make.com Flow

```
Strapi Webhook → Filter → Hashtag Generation → Router → Social Media Posts
                      ↓
                 Process Keywords
                      ↓
              Split → Format → Join
                      ↓
                 {{hashtags}} available
                      ↓
              Router splits to 4 paths
                      ↓
    Twitter ← LinkedIn ← Facebook ← Instagram
        ↓         ↓         ↓         ↓
    All use {{hashtags}} variable
```

**Key Point:** Hashtag processing happens BEFORE router so all platforms get the same hashtags!

### 📊 Hashtag Processing Flow

```
Strapi Article Keywords:
"intelligent financial management software, maximize tax deductions, AI bookkeeping, ATO-compliant reporting"

    ↓ (Split by comma)
    
Array: ["intelligent financial management software", "maximize tax deductions", "AI bookkeeping", "ATO-compliant reporting"]

    ↓ (Add # prefix)
    
Array: ["#intelligent financial management software", "#maximize tax deductions", "#AI bookkeeping", "#ATO-compliant reporting"]

    ↓ (Join with spaces)
    
Final: "#intelligent financial management software #maximize tax deductions #AI bookkeeping #ATO-compliant reporting"
```

### Step 6: Build UTM Links (Router)

1. Click **+** and add **"Router"**
2. This splits flow to 4 paths (one per platform)

**For each route, add a "Set Variable" module:**

**Route 1: Twitter UTM**
- Variable: `twitterURL`
- Value: 
  ```
  https://ai2fin.com/blog/{{1.slug}}?utm_source=twitter&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.slug}}
  ```

**Route 2: LinkedIn UTM**
- Variable: `linkedinURL`
- Value:
  ```
  https://ai2fin.com/blog/{{1.slug}}?utm_source=linkedin&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.slug}}
  ```

**Route 3: Facebook UTM**
- Variable: `facebookURL`
- Value:
  ```
  https://ai2fin.com/blog/{{1.slug}}?utm_source=facebook&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.slug}}
  ```

**Route 4: Instagram UTM**
- Variable: `instagramURL`
- Value:
  ```
  https://ai2fin.com/blog/{{1.slug}}?utm_source=instagram&utm_medium=social&utm_campaign=blog_auto_post&utm_content={{1.slug}}
  ```

### Step 7: Add Social Media Modules

**On each router path, add the corresponding social media action:**

#### **Twitter Module:**
1. Search for **"Twitter"**
2. Select **"Create a Tweet"**
3. Connect your Twitter account (OAuth - secure!)
4. Configure:
   - **Text**: 
     ```
     {{1.title}}
     
     {{1.description}}
     
     Read more: {{twitterURL}}
     
     {{hashtags}}
     ```

#### **LinkedIn Module:**
1. Search for **"LinkedIn"**
2. Select **"Create a Share"**
3. Connect your LinkedIn account (OAuth)
4. Configure:
   - **Text**:
     ```
     📢 {{1.title}}
     
     {{1.description}}
     
     Read the full article: {{linkedinURL}}
     
     {{hashtags}}
     ```
   - **Visibility**: Public

#### **Facebook Module:**
1. Search for **"Facebook Pages"**
2. Select **"Create a Post"**
3. Connect your Facebook account (OAuth)
4. Select your page
5. Configure:
   - **Message**:
     ```
     🚀 {{1.title}}
     
     {{1.description}}
     
     Read more: {{facebookURL}}
     
     {{hashtags}}
     ```
   - **Link**: `{{facebookURL}}`

#### **Instagram Module:**
1. Search for **"Instagram Business"**
2. Select **"Create a Media Object and Publish"**
3. Connect your Instagram business account
4. Configure:
   - **Image URL**: `{{1.cover.url}}`
   - **Caption**:
     ```
     {{1.title}}
     
     {{1.description}}
     
     Link in bio 👆
     
     {{hashtags}}
     ```

**Note:** Instagram doesn't allow clickable links in captions. Consider using Linktree or bio link.

### Step 8: Mark as Shared in Strapi

After all social media posts, add:

1. **Aggregator** module (merges all routes)
2. **Strapi → Update an Entry**
   - **Entry ID**: `{{1.id}}`
   - **Content Type**: `article`
   - **Fields to Update**:
     - `socialMediaShared`: `true`
     - `socialMediaSharedAt`: `{{now}}`

### Step 9: Test and Activate

1. Click **"Run once"** to test
2. Publish a draft article in Strapi
3. Watch the scenario run
4. Check each social platform for posts
5. If successful, click **"Activate scenario"**

---

## 🔧 Part 2: Update Strapi Schema (5 minutes)

We need to add fields to track social sharing status.

### Update Article Schema

1. **Stop Strapi** (if running locally)

2. **Edit schema:**
   File: `src/api/article/content-types/article/schema.json`

3. **Add these fields** to the `attributes` section:

```json
{
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
}
```

4. **Rebuild Strapi:**
```bash
npm run build
npm run develop
```

5. **Or via Strapi Admin UI:**
   - Go to Content-Type Builder
   - Edit Article
   - Add fields:
     - `socialMediaShared` (Boolean, default: false)
     - `socialMediaSharedAt` (Datetime)
     - `socialMediaResults` (JSON)
   - Save

---

## 🎯 Part 3: Configure Strapi Webhook (Optional but Recommended)

Instead of Make.com polling, use webhooks for instant triggering:

### In Strapi Admin:

1. Go to **Settings → Webhooks**
2. Click **"Add new webhook"**
3. Configure:
   - **Name**: `Social Media Auto-Post`
   - **URL**: Your Make.com webhook URL (from scenario)
   - **Events**: 
     - ✅ `entry.publish` (for Article)
   - **Headers**: (optional)
     ```
     Content-Type: application/json
     ```

### Get Make.com Webhook URL:

1. In your Make.com scenario
2. Replace **"Strapi Watch Entries"** with **"Custom Webhook"**
3. Copy the webhook URL provided
4. Paste it into Strapi webhook configuration

**Benefit:** Posts immediately when published (no 15-min delay)

---

## 🎨 Advanced: Customize Post Format

### Platform-Specific Templates

Edit the text in each Make.com module to match your brand voice:

**Twitter (280 chars):**
```
{{1.title}}

{{truncate(1.description; 100)}}...

{{twitterURL}}

{{if(1.tags.length > 0; concat("#"; 1.tags.0.name); "")}}
```

**LinkedIn (Professional):**
```
📊 New Blog Post: {{1.title}}

{{1.description}}

In this article, we cover:
• {{1.tags.0.name}}
• {{1.tags.1.name}}
• {{1.tags.2.name}}

Read more: {{linkedinURL}}

#AI2Fin #Finance #Technology
```

**Facebook (Engaging):**
```
🎉 Fresh off the press! 

{{1.title}}

{{1.description}}

What do you think? Let us know in the comments! 👇

👉 {{facebookURL}}
```

---

## 🛡️ Security Best Practices

### ✅ What Make.com Does Right:

1. **OAuth Authentication**: Never stores passwords
2. **Encrypted Tokens**: All credentials encrypted at rest
3. **SOC 2 Type II Certified**: Enterprise security standards
4. **2FA Support**: Enable for your Make.com account
5. **Granular Permissions**: Only access what's needed
6. **Audit Logs**: Track all automation runs

### ✅ Additional Security Steps:

1. **Enable 2FA on Make.com**
   - Settings → Security → Two-factor authentication

2. **Limit Strapi API Token Permissions**
   - Only give access to Article content type
   - Read + Update (not Delete)

3. **Use Environment Variables in Strapi**
   - Never hardcode webhook URLs
   - Store in `.env` file

4. **Monitor Scenario Runs**
   - Check Make.com execution history weekly
   - Watch for failed authentications

5. **Revoke Access If Needed**
   - Make.com → Connections → Revoke any unused

---

## 💰 Cost Comparison (Free Tiers)

| Tool | Free Operations | Best For |
|------|----------------|----------|
| **Make.com** | 1,000/month | ⭐ RECOMMENDED (Most powerful) |
| **Zapier** | 100/month | Simple workflows |
| **n8n** | Unlimited (self-hosted) | Technical users |
| **IFTTT** | 2 applets | Very basic only |

**For your use case:** Make.com gives you ~100 blog posts/month automated for FREE.

---

## 🔄 Alternative: Zapier (Easier but Limited)

If you prefer Zapier (more well-known):

### Quick Setup:

1. **Create Zap:** Strapi → Twitter/LinkedIn/Facebook
2. **Trigger:** Strapi - New Entry (filter by published)
3. **Action:** Post to social media with UTM link
4. **Free Tier:** 100 tasks/month (~20 blog posts)

**Limitation:** Zapier free tier may not be enough if you post frequently.

---

## 🔧 Alternative: n8n (Self-Hosted, Free Forever)

For complete control and zero costs:

### Why n8n:

- ✅ **FREE Forever**: Self-hosted, unlimited operations
- ✅ **Open Source**: Full control over security
- ✅ **Same integrations**: Twitter, LinkedIn, Facebook, Instagram
- ✅ **Strapi webhook support**: Built-in

### Requirements:

- Docker or Node.js server
- 1GB RAM minimum
- Basic server management skills

### Quick Start:

```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Visit: http://localhost:5678
```

**Setup time:** 30 minutes (more technical)

---

## 🚀 Recommended Approach for You

**Based on your requirements (free, secure, effective):**

### 🥇 **Best Choice: Make.com**

**Pros:**
- Most generous free tier (1,000 ops)
- Enterprise security (OAuth, SOC 2)
- Visual builder (no code)
- Excellent Strapi integration
- Built-in UTM builder

**Cons:**
- Requires account signup
- 15-min polling interval (or use webhook for instant)

**Setup Time:** 15 minutes

---

### 🥈 **Alternative: n8n (If you have a server)**

**Pros:**
- 100% free forever
- Self-hosted (full control)
- Same features as Make.com
- No operation limits

**Cons:**
- Requires server/Docker
- More technical setup
- You manage updates

**Setup Time:** 30-60 minutes

---

## 📋 Quick Comparison

| Feature | Make.com | Zapier | n8n | Custom Code |
|---------|----------|--------|-----|-------------|
| **Free Tier** | 1,000 ops | 100 ops | Unlimited | Unlimited |
| **Security** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ (DIY) |
| **Setup Time** | 15 min | 15 min | 60 min | 4+ hours |
| **Maintenance** | Zero | Zero | Low | High |
| **OAuth Security** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ Manual |
| **UTM Builder** | ✅ Easy | ✅ Easy | ✅ Easy | ✅ Custom |
| **Credentials Storage** | ✅ Encrypted | ✅ Encrypted | ✅ Self-hosted | ❌ Your DB |

---

## ✅ Decision Matrix

**Choose Make.com if:**
- ✅ You want it working in 15 minutes
- ✅ You post <30 blogs/month (well within free tier)
- ✅ You want enterprise security without managing it
- ✅ You prefer visual workflows

**Choose n8n if:**
- ✅ You have a server or can deploy Docker
- ✅ You want unlimited operations
- ✅ You have technical skills
- ✅ You want 100% control

**Choose Zapier if:**
- ✅ You're already familiar with it
- ✅ You post <5 blogs/month
- ✅ Willing to pay if you exceed free tier

**DON'T build from scratch if:**
- ❌ You value security
- ❌ You want it done quickly
- ❌ You don't want to manage OAuth flows
- ❌ You don't want to store social credentials

---

## 🎯 My Recommendation for AI2Fin

**Use Make.com (Free tier)**

**Why:**
1. ✅ Free for your needs (1,000 ops = ~100 blog posts/month)
2. ✅ More secure than custom code
3. ✅ Takes 15 minutes vs 4+ hours coding
4. ✅ Enterprise-grade OAuth (SOC 2 certified)
5. ✅ No maintenance or updates needed
6. ✅ Visual workflow = easy to modify
7. ✅ Built-in UTM parameter handling

**You get:**
- Automatic posting to 4 platforms
- UTM tracking per platform
- First-publish-only logic
- Secure credential management
- Zero maintenance

**Cost:** $0/month (free tier covers everything)

---

## 📞 Next Steps

1. **Sign up:** https://www.make.com/en/register (2 min)
2. **Follow Part 1** of this guide (15 min)
3. **Test with draft article** (5 min)
4. **Go live!**

Total time: **~25 minutes** for a production-ready system.

---

## 🆘 Troubleshooting

**Problem: "Too many operations"**
- Solution: Upgrade to paid plan ($9/month for 10,000 ops) or use n8n

**Problem: "Instagram posts failing"**
- Solution: Ensure you have Instagram Business account connected to Facebook

**Problem: "Twitter OAuth error"**
- Solution: Check Twitter Developer Portal, enable OAuth 2.0

**Problem: "Strapi webhook not triggering"**
- Solution: Check Strapi logs, verify webhook URL is correct

---

## 📚 Resources

- Make.com docs: https://www.make.com/en/help
- Strapi webhooks: https://docs.strapi.io/dev-docs/configurations/webhooks
- Twitter API: https://developer.twitter.com/
- LinkedIn API: https://developer.linkedin.com/
- Facebook API: https://developers.facebook.com/

---

**Built by embracingearth.space - Secure, scalable automation for AI2Fin** 🚀

**Questions?** hello@ai2fin.com

