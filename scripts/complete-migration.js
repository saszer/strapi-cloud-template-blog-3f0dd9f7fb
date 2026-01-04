#!/usr/bin/env node
/**
 * Complete Migration Script: Strapi Cloud → Fly.io (with Neon)
 * Exports content, downloads media, imports everything
 * embracingearth.space - Enterprise-grade migration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const STRAPI_CLOUD_URL = process.env.STRAPI_CLOUD_URL || '';
const STRAPI_CLOUD_TOKEN = process.env.STRAPI_CLOUD_TOKEN || '';
const FLY_STRAPI_URL = process.env.FLY_STRAPI_URL || 'https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev';
const FLY_API_TOKEN = process.env.FLY_API_TOKEN || '';

if (!STRAPI_CLOUD_URL || !STRAPI_CLOUD_TOKEN) {
  console.error('❌ Error: STRAPI_CLOUD_URL and STRAPI_CLOUD_TOKEN required');
  process.exit(1);
}

if (!FLY_API_TOKEN) {
  console.error('❌ Error: FLY_API_TOKEN required');
  process.exit(1);
}

// Helper: Fetch with auth
async function fetchWithAuth(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Helper: Download file
async function downloadFile(url, filePath, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    const file = fs.createWriteStream(filePath);
    
    client.get(options, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      } else {
        file.close();
        fs.unlinkSync(filePath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      reject(err);
    });
  });
}

// Step 1: Export all content
async function exportContent() {
  console.log('📥 Step 1: Exporting content from Strapi Cloud...');
  
  const exportData = {
    articles: [],
    categories: [],
    authors: [],
    tags: [],
    global: null,
    about: null,
    media: [],
  };

  // Export articles
  console.log('  Exporting articles...');
  let page = 1;
  while (true) {
    const data = await fetchWithAuth(
      `${STRAPI_CLOUD_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=100&populate=*`,
      STRAPI_CLOUD_TOKEN
    );
    if (!data.data || data.data.length === 0) break;
    exportData.articles.push(...data.data);
    if (page >= (data.meta?.pagination?.pageCount || 1)) break;
    page++;
  }
  console.log(`  ✅ Exported ${exportData.articles.length} articles`);

  // Export categories
  console.log('  Exporting categories...');
  const categories = await fetchWithAuth(
    `${STRAPI_CLOUD_URL}/api/categories?pagination[limit]=1000&populate=*`,
    STRAPI_CLOUD_TOKEN
  );
  exportData.categories = categories.data || [];
  console.log(`  ✅ Exported ${exportData.categories.length} categories`);

  // Export authors
  console.log('  Exporting authors...');
  const authors = await fetchWithAuth(
    `${STRAPI_CLOUD_URL}/api/authors?pagination[limit]=1000&populate=*`,
    STRAPI_CLOUD_TOKEN
  );
  exportData.authors = authors.data || [];
  console.log(`  ✅ Exported ${exportData.authors.length} authors`);

  // Export tags
  console.log('  Exporting tags...');
  const tags = await fetchWithAuth(
    `${STRAPI_CLOUD_URL}/api/tags?pagination[limit]=1000&populate=*`,
    STRAPI_CLOUD_TOKEN
  );
  exportData.tags = tags.data || [];
  console.log(`  ✅ Exported ${exportData.tags.length} tags`);

  // Export global
  const global = await fetchWithAuth(
    `${STRAPI_CLOUD_URL}/api/global?populate=*`,
    STRAPI_CLOUD_TOKEN
  );
  exportData.global = global.data || null;

  // Export about
  const about = await fetchWithAuth(
    `${STRAPI_CLOUD_URL}/api/about?populate=*`,
    STRAPI_CLOUD_TOKEN
  );
  exportData.about = about.data || null;

  // Save export
  const exportPath = path.join(__dirname, '../data/strapi-cloud-export.json');
  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
  console.log(`✅ Export saved to ${exportPath}`);

  return exportData;
}

// Step 2: Extract and download media
async function downloadMedia(exportData) {
  console.log('');
  console.log('📥 Step 2: Downloading media files...');
  
  const mediaDir = path.join(__dirname, '../data/media-export');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  const mediaUrls = new Set();
  
  // Extract media URLs from articles
  function extractMediaUrls(obj) {
    if (!obj) return;
    if (typeof obj === 'string' && obj.startsWith('http')) {
      mediaUrls.add(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(extractMediaUrls);
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(extractMediaUrls);
    }
  }

  // Extract from all content
  extractMediaUrls(exportData.articles);
  extractMediaUrls(exportData.authors);
  extractMediaUrls(exportData.global);
  extractMediaUrls(exportData.about);

  console.log(`  Found ${mediaUrls.size} media files`);

  // Download media files
  let downloaded = 0;
  for (const url of mediaUrls) {
    try {
      const fileName = path.basename(url.split('?')[0]);
      const filePath = path.join(mediaDir, fileName);
      
      // Skip if already downloaded
      if (fs.existsSync(filePath)) {
        downloaded++;
        continue;
      }

      await downloadFile(url, filePath, STRAPI_CLOUD_TOKEN);
      downloaded++;
      console.log(`  ✅ Downloaded: ${fileName} (${downloaded}/${mediaUrls.size})`);
    } catch (error) {
      console.error(`  ❌ Failed to download ${url}: ${error.message}`);
    }
  }

  console.log(`✅ Downloaded ${downloaded} media files to ${mediaDir}`);
  return mediaDir;
}

// Step 3: Import content to Fly.io
async function importContent(exportData) {
  console.log('');
  console.log('📤 Step 3: Importing content to Fly.io...');

  // Helper: Create entry via API
  async function createEntry(endpoint, data) {
    const url = `${FLY_STRAPI_URL}/api/${endpoint}`;
    const urlObj = new URL(url);
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({ data });
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FLY_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  // Import categories
  console.log('  Importing categories...');
  for (const category of exportData.categories || []) {
    try {
      const { id, createdAt, updatedAt, ...data } = category;
      await createEntry('categories', data);
      console.log(`    ✅ ${category.name || category.slug}`);
    } catch (error) {
      console.error(`    ❌ ${category.name}: ${error.message}`);
    }
  }

  // Import authors
  console.log('  Importing authors...');
  for (const author of exportData.authors || []) {
    try {
      const { id, createdAt, updatedAt, ...data } = author;
      await createEntry('authors', data);
      console.log(`    ✅ ${author.name || author.email}`);
    } catch (error) {
      console.error(`    ❌ ${author.name}: ${error.message}`);
    }
  }

  // Import tags
  console.log('  Importing tags...');
  for (const tag of exportData.tags || []) {
    try {
      const { id, createdAt, updatedAt, ...data } = tag;
      await createEntry('tags', data);
      console.log(`    ✅ ${tag.name || tag.slug}`);
    } catch (error) {
      console.error(`    ❌ ${tag.name}: ${error.message}`);
    }
  }

  // Import articles
  console.log('  Importing articles...');
  for (const article of exportData.articles || []) {
    try {
      const { id, createdAt, updatedAt, ...data } = article;
      if (article.publishedAt) data.publishedAt = article.publishedAt;
      await createEntry('articles', data);
      console.log(`    ✅ ${article.title || article.slug}`);
    } catch (error) {
      console.error(`    ❌ ${article.title}: ${error.message}`);
    }
  }

  // Import global
  if (exportData.global) {
    try {
      const { id, createdAt, updatedAt, ...data } = exportData.global;
      if (data.publishedAt) data.publishedAt = data.publishedAt;
      await createEntry('global', data);
      console.log('  ✅ Global settings');
    } catch (error) {
      console.error(`  ❌ Global: ${error.message}`);
    }
  }

  // Import about
  if (exportData.about) {
    try {
      const { id, createdAt, updatedAt, ...data } = exportData.about;
      if (data.publishedAt) data.publishedAt = data.publishedAt;
      await createEntry('about', data);
      console.log('  ✅ About page');
    } catch (error) {
      console.error(`  ❌ About: ${error.message}`);
    }
  }

  console.log('✅ Content import complete!');
}

// Step 4: Upload media files
async function uploadMedia(mediaDir) {
  console.log('');
  console.log('📤 Step 4: Uploading media files to Fly.io...');
  console.log('⚠️  Note: Media upload via API requires additional setup.');
  console.log('   For now, upload media files manually via admin panel:');
  console.log(`   ${FLY_STRAPI_URL}/admin`);
  console.log('');
  console.log(`   Media files are in: ${mediaDir}`);
}

// Main migration
async function main() {
  console.log('🚀 Complete Migration: Strapi Cloud → Fly.io (Neon)');
  console.log('==================================================');
  console.log('');

  try {
    // Step 1: Export
    const exportData = await exportContent();

    // Step 2: Download media
    const mediaDir = await downloadMedia(exportData);

    // Step 3: Import content
    await importContent(exportData);

    // Step 4: Upload media
    await uploadMedia(mediaDir);

    console.log('');
    console.log('✅ Migration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Upload media files via admin panel');
    console.log('2. Verify all content imported correctly');
    console.log('3. Update media references if needed');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

main();

