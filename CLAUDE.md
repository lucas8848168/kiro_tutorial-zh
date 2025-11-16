# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese tutorial website for KIRO IDE, built as a static HTML/CSS/JavaScript site. The project consists of multiple HTML module files (module-1.html through module-8.html) that form a comprehensive tutorial covering KIRO IDE from beginner to advanced levels.

## Architecture

### File Structure
- **index.html**: Main landing page with navigation and overview
- **module-1.html through module-8.html**: Tutorial modules covering different aspects of KIRO IDE
- **styles.css**: Global styles and responsive design
- **script.js**: Navigation functionality and smooth scrolling
- **KIRO-IDE-教程开发文档.md**: Development documentation (Chinese)

### Key Features
- Responsive design with mobile navigation
- Smooth scrolling between sections
- Modular tutorial structure (Beginner → Intermediate → Advanced)
- Chinese language content focused on KIRO IDE education

## Development Commands

This is a static website with no build process required. To develop:

```bash
# Serve files locally (using Python)
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using PHP
php -S localhost:8000
```

## KIRO IDE Context

The tutorial covers these KIRO IDE core features:
- **Specs (规范)**: Specification-driven development methodology
- **Chat**: AI-powered development assistance with model selection
- **Hooks (钩子)**: Custom automation and workflow integration
- **Steering**: Project guidance functionality
- **MCP (Model Context Protocol)**: Context management for AI models

## Claude Configuration

The project includes specific Claude permissions in `.claude/settings.local.json` allowing:
- Web fetching from kiro.dev documentation
- Local file operations for tutorial modules
- Bash commands for documentation access

## Content Guidelines

When working on this tutorial project:
- Maintain Chinese language content consistency
- Follow the three-tier structure: 入门篇 (Beginner) → 基础篇 (Intermediate) → 进阶篇 (Advanced)
- Use consistent terminology translations (Spec→规范, Chat→聊天, Hooks→钩子)
- Ensure responsive design works on mobile devices
- Include practical examples and exercises in each module