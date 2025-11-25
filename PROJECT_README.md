# Dheirya Bhatt's Personal Website

A modern Jekyll-based personal website with console theme and custom flipdot animation.

## 🌐 Live Site
Visit: [https://dheiryabhatt.github.io](https://dheiryabhatt.github.io)

## 📁 Project Structure

```
dheiryabhatt.github.io/
├── 📄 Core Files
│   ├── _config.yml          # Jekyll configuration
│   ├── Gemfile             # Ruby dependencies
│   ├── index.md            # Homepage content
│   └── blog.md             # Blog page
│
├── 📝 Content
│   ├── _posts/             # Blog posts
│   │   ├── 2025-01-15-hello-world.md
│   │   ├── 2025-02-10-student-life-germany.md
│   │   └── 2025-11-24-essential-dev-tools.md
│   └── _data/              # Site data files
│
├── 🎨 Design & Assets
│   ├── assets/
│   │   ├── css/            # Custom stylesheets
│   │   │   └── flipdot-animation.css
│   │   ├── js/             # JavaScript files
│   │   │   └── flipdot-animation.js
│   │   ├── images/         # Site images
│   │   ├── fonts/          # Custom fonts
│   │   └── *.scss          # Theme SCSS files
│   │
├── 🏗️ Templates
│   ├── _includes/          # Reusable components
│   │   ├── head.html       # HTML head section
│   │   ├── header.html     # Navigation header
│   │   ├── footer.html     # Site footer
│   │   └── tracker.html    # Analytics tracking
│   │
│   ├── _layouts/           # Page layouts
│   │   ├── default.html    # Base layout
│   │   ├── home.html       # Homepage layout
│   │   └── post.html       # Blog post layout
│   │
│   └── _sass/              # Theme SCSS partials
│
├── 📚 External Structure
│   ├── ../docs/            # Documentation & media
│   │   ├── screenshots/    # Theme screenshots
│   │   └── media/         # Project media files
│   │
│   └── ../config/         # Configuration files
│       ├── .dockerignore
│       ├── Containerfile
│       ├── docker-compose.yml
│       ├── jekyll-theme-console.gemspec
│       └── LICENSE.txt
│
└── 🔧 Generated/Cache
    ├── .jekyll-cache/     # Jekyll build cache
    ├── _site/             # Generated static site
    └── .git/              # Git repository data
```

## ✨ Features

- **Modern Console Theme**: Clean, terminal-inspired design
- **Custom Flipdot Animation**: Animated "Deebot's Blog!" header
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Blog System**: Jekyll-powered blog with post management
- **SEO Optimized**: Meta tags, sitemap, and RSS feed
- **Fast Loading**: Optimized assets and minimal dependencies

## 🛠️ Technology Stack

- **Framework**: Jekyll 4.2.2
- **Theme**: jekyll-theme-console (customized)
- **Languages**: Ruby 3.4, HTML5, CSS3, JavaScript ES6
- **Deployment**: GitHub Pages
- **Dependencies**: See Gemfile for complete list

## 🚀 Development

### Prerequisites
- Ruby 3.4+
- Bundler gem
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/DheiryaBhatt/dheiryabhatt.github.io.git

# Navigate to project directory
cd dheiryabhatt.github.io

# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve --livereload

# Visit http://127.0.0.1:4000
```

### Key Components

1. **Flipdot Animation** (`assets/js/flipdot-animation.js`)
   - Custom dot-matrix display animation
   - Responsive sizing for mobile devices
   - Configurable speed and styling

2. **Navigation** (`_includes/header.html`)
   - Clean layout with animation integration
   - Responsive mobile navigation
   - Proper accessibility attributes

3. **Styling** (`assets/css/flipdot-animation.css`)
   - Mobile-first responsive design
   - Custom CSS for flipdot animation
   - Theme integration and overrides

## 📱 Mobile Optimization

- Responsive dot sizing (2px → 1px on mobile)
- Adaptive navigation layout
- Touch-friendly interface
- Optimized font scaling

## 🎯 Performance

- Lightweight assets
- Efficient animations with debounced resize listeners
- Minimal external dependencies
- Optimized for GitHub Pages hosting

## 📄 License

This project is licensed under the MIT License - see the LICENSE.txt file for details.

## 👤 Author

**Dheirya Bhatt**
- GitHub: [@DheiryaBhatt](https://github.com/DheiryaBhatt)
- Website: [dheiryabhatt.github.io](https://dheiryabhatt.github.io)

---

Built with ❤️ using Jekyll and GitHub Pages