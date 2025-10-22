# 🔧 Social Media Link Preview Fix (LinkedIn & Facebook)

## 🚨 The Problem

When posting via Make.com API, link previews don't appear on LinkedIn and Facebook causes Error 100.

---

## 💡 Root Cause: API vs Manual Posting

### **Manual Posting** (Web/Mobile App):
- ✅ Paste URL → Platform auto-generates preview
- ✅ Scrapes Open Graph metadata
- ✅ Shows image, title, description

### **API Posting** (Make.com):
- ❌ Same URL → No preview appears (or Error 100)
- ❌ Platforms don't auto-scrape when fields are filled
- ❌ Requires specific configuration

---

## ✅ Universal Solution

### **For BOTH LinkedIn and Facebook:**

**ONLY Fill the Text/Message Field:**
```
Text/Content/Message:
📢 {{1.title}}

{{1.description}}

Read the full article: {{url}}

{{hashtags}}
```

**Leave EMPTY:**
- ❌ Link field
- ❌ Title field
- ❌ Description field
- ❌ Picture/Thumbnail field
- ❌ Image field
- ❌ Caption field
- ❌ Name field

**Why:**
- When these fields are empty, platforms detect URLs in text
- They auto-scrape Open Graph metadata
- They generate link previews automatically ✅

---

## 📊 Platform-Specific Details

### **LinkedIn**

**Error When Fields Filled:**
- No error, but preview card doesn't appear
- Posts show as plain text with clickable link

**Solution:**
- Module: "Create a Share" or "Create a Text Post"
- Only fill: Text + Visibility
- Leave empty: Title, Description, Thumbnail

**Result:**
```
┌─────────────────────────────────────────┐
│ [Featured Image from og:image]          │
│ Article Title (from og:title)          │
│ Article description (from og:description)│
│ 🔗 ai2fin.com                           │
└─────────────────────────────────────────┘
📢 Your custom post text + hashtags
```

### **Facebook**

**Error When Fields Filled:**
```
[400] (#100) Only owners of the URL have the ability 
to specify the picture, name, thumbnail or description params.
```

**Why:**
- Facebook has **domain ownership restrictions**
- Only verified domain owners can manually specify link metadata
- Otherwise must let Facebook auto-scrape

**Solution:**
- Module: "Create a Post"
- Only fill: Message + Page selection
- Leave empty: Link, Picture, Name, Description, Caption

**Result:**
```
┌─────────────────────────────────────────┐
│ [Featured Image from og:image]          │
│ Article Title (from og:title)          │
│ Article description (from og:description)│
│ AI2FIN.COM                              │
└─────────────────────────────────────────┐
🚀 Your custom post text + hashtags
```

### **Twitter/X**

**No Issues:**
- ✅ Can fill all fields normally
- ✅ Or let Twitter auto-scrape
- ✅ Twitter Card tags work automatically

### **Instagram**

**Different Issue:**
- ❌ Cannot post clickable links in captions
- ✅ Use "Link in bio" approach
- ✅ Can post image with caption normally

---

## 🔧 Make.com Configuration

### **LinkedIn Module:**
```json
{
  "module": "linkedin:ActionCreateShare",
  "mapper": {
    "text": "Post text with URL included",
    "visibility": "PUBLIC"
  }
}
```

### **Facebook Module:**
```json
{
  "module": "facebook-pages:ActionCreatePagePost",
  "mapper": {
    "page": "PAGE_ID",
    "message": "Post text with URL included"
  }
}
```

### **Twitter Module:**
```json
{
  "module": "twitter:ActionCreateTweet",
  "mapper": {
    "text": "Post text with URL included"
  }
}
```

### **Instagram Module:**
```json
{
  "module": "instagram-business:ActionCreatePhotoPost",
  "mapper": {
    "account": "ACCOUNT_ID",
    "imageUrl": "{{featuredImage.url}}",
    "caption": "Post text + Link in bio 👆 + hashtags"
  }
}
```

---

## 🧪 Testing Checklist

Before activating your Make.com scenario:

1. ✅ **LinkedIn**: Only Text + Visibility filled
2. ✅ **Facebook**: Only Message + Page filled
3. ✅ **Twitter**: Text field with URL
4. ✅ **Instagram**: Image URL + Caption (no clickable link)
5. ✅ **Test**: Run scenario once manually
6. ✅ **Verify**: Check each platform for posts
7. ✅ **Confirm**: Link previews appear on LinkedIn & Facebook
8. ✅ **Check**: UTM parameters preserved in URLs

---

## 📋 Open Graph Requirements

Your blog MUST have these meta tags for previews to work:

```html
<meta property="og:title" content="Article Title" />
<meta property="og:description" content="Article description..." />
<meta property="og:image" content="https://ai2fin.com/image.png" />
<meta property="og:url" content="https://ai2fin.com/blog/article" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="AI2Fin" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Article Title" />
<meta name="twitter:description" content="Article description..." />
<meta name="twitter:image" content="https://ai2fin.com/image.png" />
```

**✅ ai2fin.com already has these tags configured!**

---

## 🛠️ Troubleshooting

### **LinkedIn Preview Not Showing:**
1. Wait 10-30 seconds after posting
2. Check blog has Open Graph tags
3. Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
4. Clear LinkedIn's cache of your URL

### **Facebook Error 100:**
1. Verify ALL link-related fields are empty
2. Only Message field should be filled
3. URL must be IN the message text
4. Don't try to manually specify link metadata

### **Twitter Not Showing Card:**
1. Check Twitter Card meta tags
2. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. Verify image size (min 300x157px, recommended 1200x628px)

### **Instagram Image Not Posting:**
1. Check image URL is publicly accessible
2. Image must be between 320x320 and 1080x1080 pixels
3. Account must be Instagram Business account
4. Make.com must have proper permissions

---

## 📊 Expected Results

### **All Platforms:**
- ✅ Posts appear with professional link previews
- ✅ Featured images display prominently
- ✅ Titles and descriptions from Open Graph tags
- ✅ UTM tracking parameters preserved
- ✅ Hashtags formatted correctly
- ✅ No errors or warnings

### **Operation Count:**
Per blog post:
- 1 webhook trigger
- 2 set variables (hashtags, base URL)
- 4 UTM URL generators (one per platform)
- 4 social posts (Twitter, LinkedIn, Facebook, Instagram)
- **Total: ~11 operations per post**

---

## ✅ Summary

**The Golden Rule:**
> When posting via Make.com API, include URLs IN the text/message field and leave all link-related fields empty. Let social platforms auto-scrape your Open Graph tags.

**DO:**
- ✅ Include URL in post text
- ✅ Have proper Open Graph meta tags
- ✅ Leave link fields empty
- ✅ Test before activating

**DON'T:**
- ❌ Fill Link/Title/Description fields
- ❌ Try to manually specify link metadata
- ❌ Assume API works like manual posting

**Result: Perfect link previews on all platforms!** 🎉

---

## 🔗 References

- [Make.com Community: LinkedIn URL Previews](https://community.make.com/t/url-previews-on-linkedin/8614)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Open Graph Protocol](https://ogp.me/)



