# MCP Notion Publisher

Bidirectional synchronization tool between Notion and Jekyll blog using the Model Context Protocol (MCP).

## 📁 Directory Structure

```
mcp-notion-publisher/
├── src/
│   ├── index.ts                   # Main MCP server entry point
│   ├── notion.ts                  # Notion API integration
│   ├── git.ts                     # Git operations handler
│   ├── sync-bidirectional.ts      # Bidirectional sync logic
│   ├── test-client.ts             # Client testing utilities
│   └── test-mcp.ts                # MCP protocol tests
│
├── package.json                   # Node.js dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Environment variables template
├── .env                          # Local environment (not tracked)
└── .env.local                    # Local overrides (not tracked)
```

## 🚀 Quick Start

### 1. Initial Setup

```bash
cd mcp-notion-publisher
npm install
```

### 2. Configure Environment

Create `.env` file with your credentials:

```env
# Notion Configuration
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here

# Git Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=username/repository-name
```

### 3. Build & Run

```bash
# Build TypeScript
npm run build

# Test connection
npm run test:connection

# Run sync
npm run sync
```

## 📝 Available Scripts

```json
{
  "build": "tsc",
  "dev": "tsc --watch",
  "test": "node dist/test-client.js",
  "test:connection": "node dist/test-connection.js",
  "sync": "node dist/sync-bidirectional.js"
}
```

## 🔄 Sync Workflow

### Notion → Jekyll
1. Fetch pages from Notion database
2. Convert to Jekyll markdown format
3. Write to `_posts/` directory
4. Commit changes to git

### Jekyll → Notion
1. Scan `_posts/` for new/updated posts
2. Parse frontmatter and content
3. Create or update Notion pages
4. Maintain bidirectional links

## 🔧 Configuration

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_API_KEY` | Notion integration API key | Yes |
| `NOTION_DATABASE_ID` | Target Notion database ID | Yes |
| `GITHUB_TOKEN` | GitHub personal access token | For automated sync |
| `GITHUB_REPO` | Repository in format owner/repo | For automated sync |

## 🧪 Testing

### Test Connection
```bash
npm run test:connection
```
Validates Notion API credentials and database access.

### Test MCP Protocol
```bash
npm run test
```
Tests the Model Context Protocol implementation.

## 📦 Dependencies

### Core
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@notionhq/client` - Official Notion API client
- `simple-git` - Git operations

### Dev
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

## 🔐 Security Notes

- Never commit `.env` files
- Use environment-specific `.env.local` for local development
- Store secrets in GitHub Secrets for CI/CD
- Rotate API keys periodically

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
rm -rf dist node_modules
npm install
npm run build
```

**Notion API Errors**
- Check API key validity
- Verify database permissions
- Ensure integration has access to the database

**Git Sync Issues**
- Verify GitHub token permissions
- Check repository write access
- Ensure proper branch configuration

## 📚 Resources

- [Notion API Documentation](https://developers.notion.com/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Jekyll Documentation](https://jekyllrb.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 🤝 Integration with GitHub Actions

The sync workflow is automated via [.github/workflows/sync-notion.yml](../.github/workflows/sync-notion.yml)

```yaml
name: Sync Notion
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:        # Manual trigger
```

## 📊 Project Status

- ✅ Notion → Jekyll sync
- ✅ Jekyll → Notion sync
- ✅ GitHub Actions integration
- ✅ TypeScript implementation
- 🚧 Error recovery & retry logic
- 🚧 Conflict resolution
- 📋 Media file synchronization
