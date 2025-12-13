# Project Structure

This document outlines the structure and organization of the dheiryabhatt.com website.

## 📁 Root Directory Structure

```
dheiryabhatt.github.io/
├── .github/                    # GitHub-specific configurations
│   └── workflows/             # GitHub Actions workflows
│       └── sync-notion.yml    # Notion synchronization workflow
│
├── _config.yml                # Jekyll site configuration
├── .gitignore                 # Git ignore rules
├── Gemfile                    # Ruby dependencies
│
├── index.md                   # Homepage content
├── blog.md                    # Blog listing page
├── 404.md                     # Custom 404 error page
├── CNAME                      # Custom domain configuration
│
├── README.md                  # Main project documentation
├── PROJECT_README.md          # Additional project notes
└── PROJECT_STRUCTURE.md       # This file
```

## 🎨 Assets & Styling

```
assets/
├── css/                       # Custom stylesheets
│   ├── flipdot-animation.css
│   └── signature.css
│
├── fonts/                     # Custom web fonts
├── images/                    # Site images and media
├── js/                       # JavaScript files
│   └── flipdot-animation.js
│
└── main-*.scss               # Theme SCSS files
    ├── main-dark.scss
    ├── main-hacker.scss
    ├── main-light.scss
    ├── main-nord.scss
    └── main.scss
```

## 🎨 Theme Styling

```
_sass/
├── base.scss                  # Base styles
├── _dark.scss                # Dark theme
├── _hacker.scss              # Hacker theme
├── _light.scss               # Light theme
└── _nord.scss                # Nord theme
```

## 📝 Content & Posts

```
_posts/
├── 2025-01-15-hello-world.md
├── 2025-02-10-student-life-germany.md
├── 2025-11-24-essential-dev-tools.md
└── 2025-12-12-Automation is new the Geeky thing!.md
```

**Post Naming Convention:** `YYYY-MM-DD-title-with-dashes.md`

## 🏗️ Layouts & Templates

```
_layouts/
├── default.html               # Base layout template
├── home.html                  # Homepage layout
├── page.html                  # Standard page layout
└── post.html                  # Blog post layout
```

## 🧩 Includes (Reusable Components)

```
_includes/
├── head.html                  # HTML head section
├── header.html                # Site header/navigation
├── footer.html                # Site footer
├── signature.html             # Author signature
└── tracker.html               # Analytics tracking
```

## ⚙️ Configuration & Data

```
_data/
└── site.yml                   # Site-wide data/settings
```

## 🐳 Docker & Deployment

```
config/
├── Containerfile              # Docker container configuration
├── docker-compose.yml         # Docker compose setup
├── jekyll-theme-console.gemspec
└── LICENSE.txt
```

## 🔄 MCP Notion Publisher

Bidirectional synchronization between Notion and Jekyll blog.

```
mcp-notion-publisher/
├── src/
│   ├── index.ts               # Main MCP server entry
│   ├── notion.ts              # Notion API integration
│   ├── git.ts                 # Git operations
│   ├── sync-bidirectional.ts # Sync logic
│   ├── test-client.ts         # Testing utilities
│   └── test-mcp.ts            # MCP testing
│
├── package.json               # Node.js dependencies
├── tsconfig.json              # TypeScript configuration
├── .env                       # Environment variables (not tracked)
└── .env.local                 # Local environment (not tracked)
```

## 📖 Documentation

```
docs/
├── media/                     # Documentation media files
└── screenshots/               # UI/feature screenshots
```

## 🚫 Ignored Files (Not in Git)

The following are automatically generated or local-only:

- `_site/` - Jekyll build output
- `.jekyll-cache/` - Jekyll cache files
- `node_modules/` - Node.js dependencies
- `.env`, `.env.local` - Environment variables
- `Gemfile.lock`, `package-lock.json` - Lock files
- System files (`.DS_Store`, `Thumbs.db`, etc.)
- IDE files (`.vscode/`, `.idea/`, etc.)

## 🔧 Development Workflow

### Jekyll (Blog)
1. Write posts in `_posts/` with proper naming
2. Build: `bundle exec jekyll build`
3. Serve locally: `bundle exec jekyll serve`
4. Access at: `http://localhost:4000`

### MCP Notion Publisher
1. Configure `.env` with Notion credentials
2. Install dependencies: `cd mcp-notion-publisher && npm install`
3. Build TypeScript: `npm run build`
4. Test sync: `npm run test`

### Deployment
- Automatic deployment via GitHub Pages
- Custom domain configured via `CNAME`
- GitHub Actions workflow syncs with Notion

## 📋 Key Files

- **[_config.yml](_config.yml)** - Main Jekyll configuration
- **[Gemfile](Gemfile)** - Ruby dependencies for Jekyll
- **[.gitignore](.gitignore)** - Files excluded from version control
- **[CNAME](CNAME)** - Custom domain configuration

## 🎯 Quick Start

```bash
# Install Ruby dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Build for production
bundle exec jekyll build

# Set up Notion sync
cd mcp-notion-publisher
npm install
cp .env.example .env
# Edit .env with your credentials
npm run build
```

## 📚 Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Notion API Documentation](https://developers.notion.com/)
