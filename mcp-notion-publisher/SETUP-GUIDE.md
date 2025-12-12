# Notion to Jekyll Blog Sync - Setup Guide

## What You Just Created

The `sync-notion.yml` file is a **GitHub Actions workflow**. Think of it as a robot that lives on GitHub's servers and automatically runs your blog sync.

## Understanding the Workflow File

### 1. **The `name:` section**
```yaml
name: Sync Notion to Blog
```
- This is just a friendly name you'll see in GitHub Actions tab

### 2. **The `on:` section** (Triggers)
```yaml
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
```
- `schedule`: Runs automatically every 6 hours
- `workflow_dispatch`: Adds a "Run workflow" button in GitHub
- You can add `push:` to run every time you commit

### 3. **The `jobs:` section** (What to do)
Each step is like a command in your terminal:

- **Checkout**: Downloads your code
- **Setup Node**: Installs Node.js
- **Install dependencies**: Runs `npm install`
- **Sync posts**: Runs your `npm run sync` with Notion credentials
- **Check for changes**: Sees if new posts were created
- **Commit and push**: Saves and uploads the new posts

## How to Activate This

### Step 1: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Add these two secrets:

**Secret 1:**
- Name: `NOTION_TOKEN`
- Value: (Your Notion integration token - get it from .env.local file)

**Secret 2:**
- Name: `NOTION_DATABASE_ID`
- Value: (Your database ID - get it from .env.local file)

### Step 2: Push This Workflow to GitHub

```bash
git add .github/workflows/sync-notion.yml
git commit -m "Add Notion sync workflow"
git push
```

### Step 3: Test It

1. Go to your repo on GitHub
2. Click **Actions** tab (top)
3. Click **Sync Notion to Blog** (left sidebar)
4. Click **Run workflow** button (right side)
5. Click green **Run workflow** button
6. Watch it run!

## How to Use

### Automatic Mode
- Write a post in Notion
- Check the "Published" checkbox
- Wait up to 6 hours
- Your blog will update automatically!

### Manual Mode (Instant)
- Write a post in Notion
- Check the "Published" checkbox
- Go to GitHub → Actions → Run workflow
- Your blog updates in ~2 minutes!

## Customizing the Schedule

Edit the `cron:` line to change frequency:

```yaml
# Every 2 hours
- cron: '0 */2 * * *'

# Every day at 9 AM
- cron: '0 9 * * *'

# Every hour
- cron: '0 * * * *'

# Every 30 minutes
- cron: '*/30 * * * *'
```

## Troubleshooting

### "Workflow not running"
- Check GitHub Actions tab for errors
- Verify secrets are set correctly
- Make sure Notion database is shared with integration

### "Permission denied"
- Go to Settings → Actions → General
- Under "Workflow permissions"
- Select "Read and write permissions"
- Click Save

## Cost
- **Free!** GitHub gives 2000 minutes/month
- Each sync takes ~2 minutes
- You can run 1000 syncs per month for free

## What Happens Behind the Scenes

```
Every 6 hours:
  GitHub wakes up a virtual computer
    → Installs Node.js
    → Downloads your code
    → Runs npm install
    → Connects to Notion
    → Downloads published posts
    → Converts to markdown
    → Saves to _posts/
    → Commits and pushes to GitHub
    → GitHub Pages rebuilds your site
    → Your blog is updated!
```

All without your laptop being on! 🎉
