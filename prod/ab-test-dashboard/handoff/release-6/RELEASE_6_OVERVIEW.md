# Release 6 (P0) — Tight Scope: Slice Controls + Drilldowns (Planned)

**Date:** 2026-01-27

**Status:** Implemented (v6.0.0)

## Objective
Ship a **tight** release focused on **P0 items 1–6** only:
- Improve analysis workflow (save/compare/filter)
- Add drilldowns for images and sessions (PII-safe)
- Add anomaly review UX and import hardening

**Performance optimization** work is explicitly deferred to **Release 7**.

## Constraints
- Static HTML5 (GitHub Pages compatible)
- Deterministic rendering (no fragile observers)
- Privacy-first (never display respondent fields; never export PII)

## P0 Scope (Items 1–6)
1. Saved filter presets (localStorage)
2. Compare mode (Slice A/B) with KPI deltas
3. Image-level drilldown (click imageId anywhere)
4. Session-level drilldown (PII-safe)
5. Anomaly review UI (filterable by severity/code/source)
6. Import robustness (better ZIP coverage + clearer summary)

## Out of Scope (Moved)
- Performance pass (aggregation caching, render from caches) → **Release 7**

### UX Improvements (Patch)
- Tab click now auto-scrolls to the active section so users immediately see the selected panel.
- Dataset Summary auto-collapses on non-Overview tabs (toggle to expand), reducing above-the-fold clutter.

