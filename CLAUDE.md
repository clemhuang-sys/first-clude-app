# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, zero-dependency to-do list web app ("TodayStack"). Pure HTML + CSS + vanilla JS — no framework, no bundler, no package manager. Hosted on GitHub Pages.

## Commands

- **Run locally:** open [index.html](index.html) directly in a browser, or use VS Code Live Server for auto-reload. There is no build, lint, or test tooling.
- **Deploy:** push to `master`. The [.github/workflows/deploy.yml](.github/workflows/deploy.yml) workflow uploads the repo root as a Pages artifact via `actions/upload-pages-artifact@v3` and deploys with `actions/deploy-pages@v4`. Live site: https://clemhuang-sys.github.io/first-clude-app/

## Architecture

Three files, each with a single responsibility:

- [index.html](index.html) — static markup with stable IDs the JS queries by (`task-input`, `add-task-btn`, `task-list`, `empty-state`, `tasks-summary`, `tasks-count-chip`, `tasks-remaining-label`, `tasks-completed-label`). Changing these IDs breaks [script.js](script.js).
- [styles.css](styles.css) — dark-themed design system driven by CSS custom properties on `:root` (`--primary`, `--accent`, `--text`, `--muted`, etc.). State is expressed via class toggles (`.task-item.completed`) rather than inline styles.
- [script.js](script.js) — state lives in `localStorage` under key `modern_todo_tasks_v1`. Every mutation calls `loadTasks()` → mutate → `saveTasks()` → `renderTasks()`. `renderTasks` wipes and rebuilds the full list; there is no diffing. Click handling uses a single delegated listener on `#task-list` that dispatches on `.task-checkbox` vs `.icon-btn` via `closest()`.

Because GitHub Pages is served from the repo root (not a `dist/` folder), any asset path added to HTML must resolve relative to the root.

## Deployment gotcha

Pages is configured with `build_type=workflow` (Actions), not branch source. Do not re-enable the legacy branch source — it conflicts with the workflow. CDN caching means deploys take up to a minute to propagate; hard-refresh (`Ctrl+Shift+R`) when verifying.
