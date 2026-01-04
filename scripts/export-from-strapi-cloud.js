#!/usr/bin/env node
/**
 * Export all content from Strapi Cloud
 * Usage: STRAPI_CLOUD_URL=... STRAPI_API_TOKEN=... node scripts/export-from-strapi-cloud.js
 * embracingearth.space - Enterprise-grade data export
 */

const fs = require('fs');
const path = require('path');

const STRAPI_CLOUD_URL = process.env.STRAPI_CLOUD_URL || '';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

if (!STRAPI_CLOUD_URL || !STRAPI_API_TOKEN) {
  console.error('❌ Error: STRAPI_CLOUD_URL and STRAPI_API_TOKEN environment variables are required');
  console.error('');
  console.error('Usage:');
  console.error('  STRAPI_CLOUD_URL=https://your-project.strapiapp.com \\');
  console.error('  STRAPI_API_TOKEN=your-token \\');
  console.error('  node scripts/export-from-strapi-cloud.js');
  process.exit(1);
}

async function fetchAll(endpoint, token) {
  const allData = [];
  let page = 1;
  let hasMore = true;

  console.log(`📥 Fetching ${endpoint}...`);

  while (hasMore) {
    const url = `${STRAPI_CLOUD_URL}/api/${endpoint}?pagination[page]=${page}&pagination[pageSize]=100&populate=*`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const items = data.data || [];
      allData.push(...items);

      const pagination = data.meta?.pagination;
      hasMore = pagination && page < pagination.pageCount;
      
      console.log(`  Page ${page}: ${items.length} items (Total: ${allData.length})`);
      page++;
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint} page ${page}:`, error.message);
      break;
    }
  }

  return allData;
}

async function exportAll() {
  console.log('🚀 Starting export from Strapi Cloud...');
  console.log(`📍 Source: ${STRAPI_CLOUD_URL}`);
  console.log('');

  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      source: STRAPI_CLOUD_URL,
      articles: await fetchAll('articles', STRAPI_API_TOKEN),
      categories: await fetchAll('categories', STRAPI_API_TOKEN),
      authors: await fetchAll('authors', STRAPI_API_TOKEN),
      tags: await fetchAll('tags', STRAPI_API_TOKEN),
    };

    // Single entry content types
    const globalData = await fetchAll('global', STRAPI_API_TOKEN);
    exportData.global = globalData[0] || null;

    const aboutData = await fetchAll('about', STRAPI_API_TOKEN);
    exportData.about = aboutData[0] || null;

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '../data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'strapi-cloud-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log('');
    console.log('✅ Export complete!');
    console.log(`📁 Saved to: ${outputPath}`);
    console.log('');
    console.log('Summary:');
    console.log(`  Articles: ${exportData.articles.length}`);
    console.log(`  Categories: ${exportData.categories.length}`);
    console.log(`  Authors: ${exportData.authors.length}`);
    console.log(`  Tags: ${exportData.tags.length}`);
    console.log(`  Global: ${exportData.global ? 'Yes' : 'No'}`);
    console.log(`  About: ${exportData.about ? 'Yes' : 'No'}`);
    console.log('');
    console.log('Next step: Import to Fly.io using scripts/import-to-fly.js');
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

exportAll();

