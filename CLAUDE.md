# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VitePress documentation site for backend development notes and technical documentation. The site uses VitePress 1.6+ with the `vitepress-sidebar` plugin for auto-generating navigation sidebars.

## Common Commands

- `npm run docs:dev` - Start the development server
- `npm run docs:build` - Build the production site (outputs to `docs/.vitepress/dist`)
- `npm run docs:preview` - Preview the built production site locally

## Architecture

### Project Structure

```
docs/                      # VitePress content root
  .vitepress/
    config.mts             # Main VitePress configuration
    theme/
      style.css            # Custom theme styles (brand colors, fonts)
      custom.css           # Additional custom styles
  backend/                 # Backend development notes
    PHP/                   # PHP documentation
    Python/                # Python documentation
    Go/                    # Go documentation
    MySQL/                 # MySQL documentation
    Redis/                 # Redis documentation
    Linux/                 # Linux documentation
    Nginx/                 # Nginx documentation
    tools/                 # Backend tools
  bigdata/                 # Big data documentation
    Hadoop/                # Hadoop ecosystem notes
  nas/                     # NAS documentation
  public/                  # Static assets (logos, images)
  index.md                 # Homepage
```

### Configuration Architecture

**[docs/.vitepress/config.mts](docs/.vitepress/config.mts)** is the main configuration file with two key parts:

1. **VitePress Options** (`vitePressOptions`): Standard VitePress config including:
   - Site title, description, logo
   - Navigation menu (nav)
   - Theme settings (search, social links, lastUpdated)
   - Chinese language UI text

2. **Sidebar Options** (`vitePressSidebarOptions`): Configurations for the `vitepress-sidebar` plugin
   - The plugin automatically generates sidebars by scanning the `docs/` directory
   - Each object in the array defines how a section's sidebar is generated
   - Key options:
     - `documentRootPath`: Base path for scanning (usually "docs")
     - `scanStartPath`: Where to start scanning relative to documentRootPath
     - `resolvePath`: The URL path prefix for the generated sidebar
     - `useTitleFromFrontmatter`: Read titles from YAML frontmatter
     - `useTitleFromFileHeading`: Use first heading as title if no frontmatter
     - `useFolderTitleFromIndexFile`: Use index.md title for folder display
     - `sortMenusOrderNumericallyFromLink`: Sort files by numbered prefix (e.g., "1.事务.md", "2.锁.md")
     - `removePrefixAfterOrdering`: Remove numeric prefixes from display titles
     - `prefixSeparator`: Character separating prefix (default ".")
     - `collapsed`: Whether to collapse sidebar sections by default

### Content Organization

**Frontmatter format:**
```yaml
---
title: Page Title
description: Optional page description
---
```

**File naming conventions:**
- Use numeric prefixes for ordering (e.g., `1.事务.md`, `2.锁.md`)
- The prefix separator is `.` (dot)
- After sorting, prefixes are automatically removed from display titles
- `index.md` files define the folder's display title

**Theme customization:**
- Custom brand colors defined in `[docs/.vitepress/theme/style.css](docs/.vitepress/theme/style.css)`
- CSS custom properties for light and dark modes
- Monospace font family for code display

## Deployment

The site is automatically deployed to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
- Triggers on push to `main` branch
- Uses Node.js 22
- Runs `npm run docs:build`
- Deploys `docs/.vitepress/dist` to GitHub Pages

## Adding New Content

1. Create new markdown files in the appropriate `docs/` subdirectory
2. Add frontmatter with `title` for proper display in navigation
3. Use numeric prefixes (e.g., `10.NewTopic.md`) for ordering within a section
4. The sidebar will automatically update on next build
5. Add new section entries to `vitePressSidebarOptions` in config.mts if creating a new major section