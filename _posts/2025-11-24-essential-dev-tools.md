---
layout: post
title: "Essential Dev Tools That Changed My Workflow"
date: 2025-11-24
tags: [development, tools, productivity, vscode]
---

# $ which tools | grep "essential"

As a developer working at dSPACE and studying computer science, I've experimented with countless tools to optimize my workflow. Here are the ones that have truly made a difference.

## Code Editor: VS Code

```json
{
  "editor": "Visual Studio Code",
  "why": "Perfect balance of features and performance",
  "favorite_extensions": [
    "GitLens",
    "Prettier", 
    "Live Server",
    "Thunder Client",
    "German Language Pack"
  ]
}
```

VS Code has become my daily driver. The extension ecosystem is incredible, and it handles everything from web development to documentation.

## Terminal: Windows Terminal + PowerShell

```powershell
# My current setup
$terminal = @{
    Shell = "PowerShell 7"
    Terminal = "Windows Terminal"  
    Theme = "Dark+"
    Productivity = "Oh My Posh + Starship"
}
```

The new Windows Terminal with PowerShell 7 has transformed my command-line experience. Adding Oh My Posh makes it both beautiful and functional.

## Version Control Workflow

### Git + GitHub
```bash
# My typical workflow
git checkout -b feature/awesome-feature
git add .
git commit -m "feat: add awesome feature"
git push origin feature/awesome-feature
# Create PR via GitHub CLI or web interface
```

### GitKraken (GUI)
For complex merge conflicts and repository visualization, GitKraken has saved me countless hours.

## Design and Planning

### Figma
```yaml
use_cases:
  - UI/UX mockups for personal projects
  - Collaborative design with team members  
  - Creating diagrams and flowcharts
  - Prototyping web interfaces
```

### Notion
My second brain for:
- Project planning and documentation
- Study notes and research
- Personal knowledge management
- Meeting notes from dSPACE

## Development Environment

### Docker
```dockerfile
# Consistent development environments
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Docker has eliminated "it works on my machine" issues completely.

### Postman/Thunder Client
API testing and documentation made simple. Thunder Client (VS Code extension) is perfect for quick tests.

## Learning and Documentation

### Obsidian
```markdown
# My Knowledge Graph
- Course notes from Universität Paderborn
- Work learnings from dSPACE  
- Tech documentation and tutorials
- Project ideas and implementations
```

Obsidian's linking system helps me connect concepts across different domains.

### Anki (Spaced Repetition)
For memorizing:
- Programming concepts and syntax
- German vocabulary (essential for work!)
- Computer science fundamentals
- System design patterns

## Productivity Tools

### Todoist
```bash
$ todoist list
Today:
- Review PR for project X
- Finish CS assignment on algorithms  
- dSPACE team meeting at 2 PM
- Work on personal website blog post
```

### RescueTime
Tracking where my time goes helps optimize my study/work balance.

## Communication

### Slack (dSPACE)
### Discord (Developer Communities)
### WhatsApp (University Groups)

## Browser Extensions

```javascript
const essentialExtensions = [
  'uBlock Origin',      // Ad blocking
  'Bitwarden',          // Password management  
  'React Developer Tools', // Frontend debugging
  'JSON Viewer',        // Pretty JSON formatting
  'Grammarly',         // Writing assistance (especially in German!)
];
```

## $ eval "my_workflow_philosophy"

The best tools are the ones you actually use consistently. I prefer:

1. **Simple over complex** - Tools that don't get in the way
2. **Cross-platform** - Works on Windows (work) and other systems
3. **Good documentation** - Essential when learning
4. **Active community** - Help and resources when stuck

## Tools I'm Currently Exploring

```yaml
investigating:
  - Neovim: Considering the switch from VS Code
  - Rust: Learning systems programming
  - Kubernetes: For container orchestration
  - Zsh: Might switch from PowerShell on Linux
```

## University-Specific Tools

### PAUL (University Portal)
### PANDA (Learning Management System)  
### HBZ Library System
### Student Email (Outlook)

Working in Germany while studying has taught me the importance of having robust, reliable tools that work across different environments and languages.

## $ echo "What tools do you swear by?"

I'm always looking to improve my setup. What tools have transformed your workflow? Any suggestions for a student developer working in Germany?

```bash
$ tools --feedback | send_to contact@dheirya.dev
```

*Got recommendations or want to discuss developer tools? [Let's chat](/contact/)!*