---
description: Push code, create/update README, and capture screenshot — each as its own commit pushed to GitHub
argument-hint: (no arguments)
---

Run the following three steps in order. Each step produces its own commit and `git push`. If a step has nothing to commit, skip its commit/push and move on.

## Step 1 — Push current code

1. Run `git status` and `git diff` in parallel to see pending changes.
2. If there are uncommitted changes unrelated to README/screenshot work, stage them by file name (not `git add -A`) and create a single commit describing the change. Then `git push`.
3. If the working tree is clean, still run `git push` so any local commits ahead of the remote are synced.

## Step 2 — Create or update the README

1. Read [README.md](README.md) if it exists; otherwise create it.
2. Ensure it contains, at minimum: project name, one-paragraph description, how to run locally, how to deploy, and the live site URL. Pull these facts from [CLAUDE.md](CLAUDE.md) and [index.html](index.html) — do not invent features that aren't in the code.
3. If the README already covers this, only make edits that are genuinely needed. Do not churn the file.
4. If anything changed, commit with message `docs: update README` (or `docs: add README` if new) and `git push`.

## Step 3 — Capture a screenshot and embed it

1. Use the Playwright MCP tools to take a screenshot of the live site at https://clemhuang-sys.github.io/first-clude-app/ (fall back to opening [index.html](index.html) via `file://` if the live site is unreachable).
   - `mcp__playwright__browser_navigate` to the URL
   - `mcp__playwright__browser_resize` to 1280x800 for a consistent frame
   - `mcp__playwright__browser_take_screenshot` with `filename: "screenshot.png"` and `fullPage: false`
2. Move/copy the resulting PNG to the repo root as `screenshot.png` (overwrite if it exists).
3. Ensure [README.md](README.md) embeds it via `![TodayStack screenshot](screenshot.png)` near the top. If the embed is already present and the image is just being refreshed, no README edit is needed.
4. Stage `screenshot.png` (and README.md if edited), commit with message `docs: refresh site screenshot`, and `git push`.

## Rules

- Never use `--no-verify`, `--force`, or `git add -A`/`git add .`.
- Each step is independent: if step 1 has nothing to push, still run steps 2 and 3.
- Report at the end: which steps produced a commit, and the final `git log --oneline -5`.
