#!/usr/bin/env node
/**
 * Import exported data into Fly.io Strapi
 * Usage: FLY_STRAPI_URL=... FLY_API_TOKEN=... node scripts/import-to-fly.js
 * embracingearth.space - Enterprise-grade data import
 */

const fs = require('fs');
const path = require('path');

const FLY_STRAPI_URL = process.env.FLY_STRAPI_URL || 'https://strapi-cloud-template-blog-3f0dd9f7fb.fly.dev';
const FLY_API_TOKEN = process.env.FLY_API_TOKEN || '';

if (!FLY_API_TOKEN) {
  console.error('❌ Error: FLY_API_TOKEN environment variable is required');
  console.error('');
  console.error('Usage:');
  console.error('  FLY_STRAPI_URL=https://your-app.fly.dev \\');
  console.error('  FLY_API_TOKEN=your-admin-token \\');
  console.error('  node scripts/import-to-fly.js');
  process.exit(1);
}

async function createEntry(endpoint, data, token) {
  const url = `${FLY_STRAPI_URL}/api/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function importData() {
  const exportPath = path.join(__dirname, '../data/strapi-cloud-export.json');
  
  if (!fs.existsSync(exportPath)) {
    console.error(`❌ Error: Export file not found: ${exportPath}`);
    console.error('Run scripts/export-from-strapi-cloud.js first');
    process.exit(1);
  }

  console.log('🚀 Starting import to Fly.io Strapi...');
  console.log(`📍 Target: ${FLY_STRAPI_URL}`);
  console.log(`📁 Source: ${exportPath}`);
  console.log('');

  const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

  let successCount = 0;
  let errorCount = 0;

  // Import categories first (dependencies)
  console.log('📂 Importing categories...');
  for (const category of exportData.categories || []) {
    try {
      // Remove id and timestamps (will be auto-generated)
      const { id, createdAt, updatedAt, publishedAt, ...categoryData } = category;
      await createEntry('categories', categoryData, FLY_API_TOKEN);
      console.log(`  ✅ ${category.name || category.slug}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${category.name || category.slug}: ${error.message}`);
      errorCount++;
    }
  }

  // Import authors
  console.log('');
  console.log('👤 Importing authors...');
  for (const author of exportData.authors || []) {
    try {
      const { id, createdAt, updatedAt, publishedAt, ...authorData } = author;
      await createEntry('authors', authorData, FLY_API_TOKEN);
      console.log(`  ✅ ${author.name || author.email}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${author.name || author.email}: ${error.message}`);
      errorCount++;
    }
  }

  // Import tags
  console.log('');
  console.log('🏷️  Importing tags...');
  for (const tag of exportData.tags || []) {
    try {
      const { id, createdAt, updatedAt, publishedAt, ...tagData } = tag;
      await createEntry('tags', tagData, FLY_API_TOKEN);
      console.log(`  ✅ ${tag.name || tag.slug}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${tag.name || tag.slug}: ${error.message}`);
      errorCount++;
    }
  }

  // Import articles (after categories and authors)
  console.log('');
  console.log('📝 Importing articles...');
  for (const article of exportData.articles || []) {
    try {
      const { id, createdAt, updatedAt, ...articleData } = article;
      // Ensure publishedAt is set if article was published
      if (article.publishedAt) {
        articleData.publishedAt = article.publishedAt;
      }
      await createEntry('articles', articleData, FLY_API_TOKEN);
      console.log(`  ✅ ${article.title || article.slug}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ ${article.title || article.slug}: ${error.message}`);
      errorCount++;
    }
  }

  // Import global
  if (exportData.global) {
    console.log('');
    console.log('🌐 Importing global settings...');
    try {
      const { id, createdAt, updatedAt, ...globalData } = exportData.global;
      if (globalData.publishedAt) {
        globalData.publishedAt = globalData.publishedAt;
      }
      await createEntry('global', globalData, FLY_API_TOKEN);
      console.log('  ✅ Global settings imported');
      successCount++;
    } catch (error) {
      console.error(`  ❌ Global settings: ${error.message}`);
      errorCount++;
    }
  }

  // Import about
  if (exportData.about) {
    console.log('');
    console.log('ℹ️  Importing about page...');
    try {
      const { id, createdAt, updatedAt, ...aboutData } = exportData.about;
      if (aboutData.publishedAt) {
        aboutData.publishedAt = aboutData.publishedAt;
      }
      await createEntry('about', aboutData, FLY_API_TOKEN);
      console.log('  ✅ About page imported');
      successCount++;
    } catch (error) {
      console.error(`  ❌ About page: ${error.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('✅ Import complete!');
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log('');
  console.log('⚠️  Note: Media files need to be uploaded separately via admin panel');
}

importData().catch((error) => {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
});

