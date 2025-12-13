import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const POSTS_DIR = path.join('..', '_posts');

async function testConnection() {
  try {
    console.log('Testing Notion connection...');
    console.log('Database ID:', NOTION_DATABASE_ID);
    
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
    });
    
    console.log('✅ Connection successful!');
    console.log(`Found ${response.results.length} pages in database`);
    
    if (response.results.length > 0) {
      console.log('\nSample page:');
      const page = response.results[0];
      console.log('- ID:', page.id);
      console.log('- Properties:', Object.keys(page.properties).join(', '));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();
