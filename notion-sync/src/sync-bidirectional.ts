import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs-extra';
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

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

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;
// Path to _posts directory - go up to notion-sync folder, then up to repo root, then into _posts
const POSTS_DIR = path.join(__dirname, '..', '..', '_posts');

interface PostData {
  page: any;
  title: string;
  slug: string;
  published: boolean;
  date: string;
}

interface PublishedPost extends PostData {
  filename: string;
}

interface UnpublishedPost {
  filename: string;
  title: string;
}

// Ensure posts directory exists
await fs.ensureDir(POSTS_DIR);

function getPropertyValue(properties: any, propertyName: string): any {
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
      return property.multi_select.map((item: any) => item.name);
    case 'select':
      return property.select?.name || null;
    case 'checkbox':
      return property.checkbox;
    default:
      return null;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFilenameFromPost(date: string, slug: string | null, title: string): string {
  const fileSlug = slug || slugify(title);
  return `${formatDate(date)}-${fileSlug}.md`;
}

async function syncPosts(): Promise<void> {
  try {
    console.log('🔄 Syncing posts with Notion...\n');
    
    // Step 1: Get ALL posts from Notion (published and unpublished)
    console.log('📥 Fetching all posts from Notion...');
    const allNotionPosts: QueryDatabaseResponse = await notion.databases.query({
      database_id: NOTION_DATABASE_ID
    });

    // Separate published and unpublished posts
    const publishedPosts: PublishedPost[] = [];
    const unpublishedPosts: UnpublishedPost[] = [];
    const notionFileMap = new Map<string, PostData>(); // Map of filename -> post data

    for (const page of allNotionPosts.results) {
      if (!('properties' in page)) continue;
      
      const properties = page.properties;
      const title = getPropertyValue(properties, 'Title') || getPropertyValue(properties, 'Name');
      const slug = getPropertyValue(properties, 'Slug');
      const published = getPropertyValue(properties, 'Published');
      const date = page.created_time.split('T')[0];

      if (!title) continue;

      const filename = getFilenameFromPost(date, slug, title);
      notionFileMap.set(filename, { page, title, slug, published, date });

      if (published) {
        publishedPosts.push({ page, title, slug, date, filename });
      } else {
        unpublishedPosts.push({ filename, title });
      }
    }

    console.log(`✅ Found ${publishedPosts.length} published posts`);
    console.log(`⚠️  Found ${unpublishedPosts.length} unpublished posts\n`);

    // Step 2: Get existing files in _posts directory
    console.log('📂 Checking existing files in _posts...');
    const existingFiles = await fs.readdir(POSTS_DIR);
    const mdFiles = existingFiles.filter((f: string) => f.endsWith('.md'));
    console.log(`📄 Found ${mdFiles.length} existing .md files\n`);

    // Step 3: Create/Update published posts
    console.log('📝 Processing published posts...');
    for (const post of publishedPosts) {
      const { page, title, slug, date, filename } = post;
      const filepath = path.join(POSTS_DIR, filename);

      try {
        // Convert Notion page to Markdown
        const mdblocks = await n2m.pageToMarkdown(page.id);
        const mdString = n2m.toMarkdownString(mdblocks);

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

        // Write file
        await fs.writeFile(filepath, frontMatter, 'utf-8');
        
        if (existingFiles.includes(filename)) {
          console.log(`  ✏️  Updated: ${filename}`);
        } else {
          console.log(`  ✅ Created: ${filename}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ Error processing ${title}:`, errorMessage);
      }
    }

    // Step 4: Delete unpublished posts
    console.log('\n🗑️  Removing unpublished posts...');
    let deletedCount = 0;
    
    for (const existingFile of mdFiles) {
      const notionPost = notionFileMap.get(existingFile);
      
      // If file exists locally but is not published in Notion (or doesn't exist), delete it
      if (!notionPost || !notionPost.published) {
        const filepath = path.join(POSTS_DIR, existingFile);
        await fs.remove(filepath);
        deletedCount++;
        const postTitle = notionPost ? notionPost.title : existingFile;
        console.log(`  🗑️  Deleted: ${existingFile} (${postTitle})`);
      }
    }

    if (deletedCount === 0) {
      console.log('  ℹ️  No files to delete');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✨ Sync complete!');
    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`  • Published posts: ${publishedPosts.length}`);
    console.log(`  • Files deleted: ${deletedCount}`);
    console.log(`  • Total files now: ${publishedPosts.length}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Error syncing posts:', error);
    throw error;
  }
}

syncPosts();
