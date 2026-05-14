import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables (works with both .env.local and GitHub Actions env vars)
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  console.error('❌ Error: NOTION_TOKEN and NOTION_DATABASE_ID must be set');
  process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
// Path to _posts directory - go up to notion-sync folder, then up to repo root, then into _posts
const POSTS_DIR = path.join(__dirname, '..', '..', '_posts');

// Ensure posts directory exists
await fs.ensureDir(POSTS_DIR);

function getPropertyValue(properties, propertyName) {
  const property = properties[propertyName];
  if (!property) return null;

  switch (property.type) {
    case 'title':
      return property.title[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text[0]?.plain_text || '';
    case 'date':
      return property.date?.start || null;
    case 'multi_select':
      return property.multi_select.map(item => item.name);
    case 'select':
      return property.select?.name || null;
    case 'checkbox':
      return property.checkbox;
    default:
      return null;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function syncPosts() {
  try {
    console.log('🔄 Fetching posts from Notion...');
    
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true
        }
      }
    });

    console.log(`Found ${response.results.length} published posts`);

    for (const page of response.results) {
      const properties = page.properties;
      
      // Extract metadata
      const title = getPropertyValue(properties, 'Title') || getPropertyValue(properties, 'Name');
      const slug = getPropertyValue(properties, 'Slug');
      const tags = getPropertyValue(properties, 'Tags') || [];
      const published = getPropertyValue(properties, 'Published');

      if (!title || !published) {
        console.log(`⚠️  Skipping page (missing required fields): ${page.id}`);
        continue;
      }

      console.log(`\n📝 Processing: ${title}`);

      // Convert Notion page to Markdown
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const mdString = n2m.toMarkdownString(mdblocks);

      // Use current date or page creation date
      const date = page.created_time.split('T')[0];

      // Create Jekyll front matter
      const frontMatter = [
        '---',
        'layout: post',
        `title: "${title.replace(/"/g, '\\"')}"`,
        `date: ${date}`,
        '---',
        '',
        mdString.parent
      ].join('\n');

      // Create filename using slug or title
      const fileSlug = slug || slugify(title);
      const filename = `${date}-${fileSlug}.md`;
      const filepath = path.join(POSTS_DIR, filename);

      // Write file
      await fs.writeFile(filepath, frontMatter, 'utf-8');
      console.log(`✅ Saved: ${filename}`);
    }

    console.log('\n✨ Sync complete!');
  } catch (error) {
    console.error('❌ Error syncing posts:', error);
    throw error;
  }
}

syncPosts();
