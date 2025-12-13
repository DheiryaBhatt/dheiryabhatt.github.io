# dheiryabhatt.com

Personal website and blog built with Jekyll, featuring automated Notion synchronization.

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen)](https://dheiryabhatt.com)
[![Jekyll](https://img.shields.io/badge/Jekyll-4.3+-red.svg)](https://jekyllrb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.txt)

## 🚀 About

This is a personal website and technical blog built with Jekyll and the console theme. It features:

- 📝 Blog posts about development, automation, and student life
- 🔄 Automated bidirectional sync with Notion
- 🎨 Multiple theme variants (dark, light, hacker, nord)
- 🚀 GitHub Pages deployment
- ✨ Custom animations and styling

## 📋 Quick Start

### Prerequisites

- Ruby 2.7+ with Bundler
- Node.js 16+ (for Notion sync)
- Git

### Local Development

```bash
# Install Ruby dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Visit http://localhost:4000
```

### Project Structure

```
dheiryabhatt.github.io/
├── _config.yml                # Jekyll site configuration
├── index.md                   # Homepage
├── pages/                     # Site pages (about, blog, 404)
├── _posts/                    # Blog posts (YYYY-MM-DD-title.md)
├── _layouts/                  # Page layouts (default, home, post, page)
├── _includes/                 # Reusable components (head, header, footer)
├── _sass/                     # Theme styles (_dark, _light, _hacker, _nord)
├── assets/
│   ├── css/                   # Custom stylesheets
│   ├── js/                    # JavaScript (flipdot-animation.js)
│   ├── images/                # Site images
│   └── fonts/                 # Custom fonts
├── notion-sync/               # Notion synchronization tool
│   ├── src/                   # TypeScript source files
│   └── package.json           # Node.js dependencies
├── .github/
│   └── workflows/             # GitHub Actions (sync-notion.yml)
├── config/                    # Docker & deployment configs
└── docs/                      # Documentation & screenshots
```

**Key Files:**
- `index.md` - Homepage
- `pages/blog.md` - Blog listing page
- `pages/about.md` - About page
- `pages/404.md` - Custom error page
- `CNAME` - Custom domain (dheiryabhatt.com)
- `Gemfile` - Ruby dependencies

## 🔄 Notion Integration

This project includes bidirectional synchronization with Notion for automated blog post management.

### Features
- ✅ Automatic sync of published Notion pages to Jekyll posts
- 🗑️ Removes unpublished posts from the repository
- 🔄 GitHub Actions workflow runs every 18 hours
- 📝 Preserves front matter and Markdown formatting

### Setup

1. **Create a Notion Integration:**
   - Visit [Notion Integrations](https://www.notion.so/my-integrations)
   - Create a new integration and copy the token
   - Share your database with the integration

2. **Configure GitHub Secrets:**
   ```
   NOTION_TOKEN - Your Notion integration token
   NOTION_DATABASE_ID - Your Notion database ID
   ```

3. **Local Development:**
   ```bash
   cd notion-sync
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run sync
   ```

4. **Manual Trigger:**
   - Go to Actions tab in GitHub
   - Select "Sync Notion to Jekyll"
   - Click "Run workflow"

## 📝 Writing Posts

Create new posts in `_posts/` following the naming convention:

```
YYYY-MM-DD-title-with-dashes.md
```

Example frontmatter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-12-13
categories: [development, automation]
---
```

## 🎨 Theme Customization

The site supports multiple themes. Configure in `_config.yml`:

```yaml
style: dark  # Options: dark, light, hacker, nord
```

Custom styles are in:
- `_sass/` - SCSS partials
- `assets/` - Compiled CSS and custom styles

## 🚀 Deployment

The site automatically deploys to GitHub Pages when pushing to the `master` branch.

### Manual Build

```bash
bundle exec jekyll build
# Output in _site/
```

### Gem-based installation

1) Add to your `Gemfile`:

```ruby
gem "jekyll-theme-console"
```

2) Install and enable the theme:

```bash
bundle
```

```yaml
# _config.yml
theme: jekyll-theme-console
plugins:
  - jekyll-seo-tag
```

To update later: `bundle update`.

## Configuration

Add these to `_config.yml` as needed:

- `header_pages`: list of page paths to show in the top menu
- `footer`: HTML string rendered in the footer
- `style`: `dark` (default), `light`, `hacker`, or `nord`
- `listen_for_clients_preferred_style`: `true` to auto‑switch using the OS preference
- `disable_google_fonts`: `true` to avoid requests to Google Fonts
- `tracking`: generic tracker configuration (see Security & CSP below)
- `csp_extra`: extra CSP directives to append to the built‑in policy

Example:

```yaml
header_pages:
  - index.md
  - pages/about.md

style: dark # dark (default), light, hacker, or nord
listen_for_clients_preferred_style: true # false (default) or true

footer: 'follow us on <a href="https://twitter.com/xxx">twitter</a>'
disable_google_fonts: false

# Generic tracking (optional; loads only in production)
# tracking:
#   script_src:
#     - https://cdn.example.com/tracker.js
#   async: true   # default true
#   defer: false  # default false
#   # Optional inline init snippet (requires CSP allowance if used)
#   # init: |
#   #   window.myTracker=window.myTracker||function(){(window.myTracker.q=window.myTracker.q||[]).push(arguments)};
#   #   myTracker('init', { siteId: '12345' });
```

### Front matter

Additional page variables supported by the theme:

- `title`: page title
- `lang`: page language (defaults to `en`)
- `robots`: value for the robots meta tag (e.g., `NOINDEX`)

## Customization

Follow these steps to customize:

1. Fork this repository (use as a theme or directly as your site)
2. Edit templates in `_layouts` for HTML changes
3. Edit styles in `_sass` and `assets`
   - Global variables (font size, container width) live in `_sass/base.scss`
   - Style‑specific variables are in `_sass/_dark.scss`, `_sass/_light.scss`, `_sass/_hacker.scss`, `_sass/_nord.scss`
   - Fonts are loaded with `<link>` tags; set `disable_google_fonts: true` to avoid external font requests

Optional tweaks:

- Enable Sass compression in `_config.yml`:

  ```yaml
  sass:
    style: compressed
  ```

- Add `jekyll-feed` to generate an Atom/RSS feed.

### Security & CSP

The theme ships with a strict, practical Content Security Policy. By default it allows:

- self‑hosted content, plus images from `https:` and `data:` URIs
- Google Fonts (unless disabled)

Extend the policy as needed via `_config.yml`:

```yaml
csp_extra: "frame-src https:;"
```

Examples:

- Matomo at `https://analytics.example.com`:

  ```yaml
  tracking:
    script_src:
      - https://analytics.example.com/matomo.js
  # If you add an inline init snippet via `tracking.init`, also include 'unsafe-inline' in script-src.
  csp_extra: "script-src 'self' https://analytics.example.com 'unsafe-inline'; connect-src 'self' https://analytics.example.com; img-src 'self' https://analytics.example.com;"
  ```

- Plausible at `https://plausible.example.com`:

  ```yaml
  tracking:
    script_src:
      - https://plausible.example.com/js/plausible.js
  csp_extra: "script-src 'self' https://plausible.example.com; connect-src 'self' https://plausible.example.com;"
  ```

Tip: To remove the top border in the menu:

```css
.menu { border-top: none; }
```

## Development

This repository is a standard Jekyll site for local development of the theme.

### Docker (recommended)

```bash
docker compose up --build
```

Open `http://localhost:4000`.

### Local (Ruby/Bundler)

```bash
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.

When the theme is released, only files in `_layouts`, `_includes`, `_sass`, and `assets` tracked by Git are bundled. To include additional paths, edit the regexp in `jekyll-theme-console.gemspec`.

## License

Open source under the [MIT License](https://opensource.org/licenses/MIT).
