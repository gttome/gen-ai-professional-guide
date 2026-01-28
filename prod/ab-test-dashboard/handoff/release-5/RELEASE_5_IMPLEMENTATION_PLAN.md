# Release 5 Implementation Plan (P0)

**Status:** Implemented in **Build v5.0** (2026-01-27)

This plan remains as the design record of what was shipped, with a few notes where the implementation intentionally differs from the original draft to keep dependencies minimal.

## Step 0 — Baseline verification
- ✅ Updated `version.txt` now reports **Build v5.0**
- ✅ `start-server.bat` / `server-start.bat` runs the static app on port **5510**

## Step 1 — Data layer changes (js/app.js)
- ✅ Rank matrix computed from `results.top3` (counts by imageId × rank)
- ✅ Exposure totals aggregated from `metrics.exposures` (imageId 1..25)
- ✅ Full‑res opens totals aggregated from `metrics.fullResOpens` (imageId 1..25)
- ✅ Method + version distinct lists computed from the dataset and used to populate dropdowns
- ✅ Date parsing uses `submittedAt` with fallback to `startedAt` (normalized to `YYYY-MM-DD`)
- ✅ Expanded anomaly model includes:
  - source: `seed` vs `added`
  - filename when available (seed path, imported TXT name, ZIP member name)

## Step 2 — UI changes (index.html + css)
- ✅ Filters: **Device + Method + Version + Date range**
- ✅ Persistent dataset summary block (All vs Filtered)
- ✅ New visual blocks:
  - Rank heatmap + Mode toggle (Count / %)
  - Exposure totals + Full‑res opens (Top 25)
  - Exposure vs selection scatter
- ✅ New actions:
  - Import ZIP
  - Export Anomalies (CSV)

## Step 3 — Rendering additions
- ✅ Heatmap: table + intensity shading (relative within slice)
- ✅ Bar charts: reuse existing bar renderer with 25 items
- ✅ Scatter: dependency‑free SVG with hover tooltip

## Step 4 — ZIP import (dependency-minimal)
**Original draft:** vendor JSZip under `/lib/` (no CDN).  
**Implemented:** a minimal ZIP reader using:
- central directory parsing
- store + deflate support via native `DecompressionStream('deflate-raw')`

This keeps the build lean and fully static. Note: ZIP import requires a modern Chromium-based browser (Edge/Chrome) that supports `DecompressionStream`.

## Step 5 — Testing checklist
- ✅ Filters update charts deterministically (no DOM observers)
- ✅ Date filter boundaries are inclusive (`start ≤ dateKey ≤ end`)
- ✅ ZIP import tested for:
  - ZIP with valid TXT members
  - ZIP with non‑TXT members (ignored)
  - TXT members with missing/invalid JSON (logged as anomalies)
- ✅ Anomaly export includes:
  - seed load failures
  - import failures (TXT and ZIP)
  - build anomalies (duplicates, missing sessionId)
  - data quality issues
