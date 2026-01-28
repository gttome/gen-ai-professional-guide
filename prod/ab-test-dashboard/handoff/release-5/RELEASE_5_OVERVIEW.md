# Release 5 (P0) — Analytics Dashboard Enhancements

**Date:** 2026-01-27

**Status:** Implemented in **Build v5.0**

## Objective
Deliver **Release 5** focusing on **P0 items 1–9** (highest value, minimal complexity) to improve insight quality and data operations while keeping the dashboard **static (GitHub Pages compatible)** and **privacy-first**.

## Constraints
- Must remain a **static** HTML5 app (no backend).
- Must load the **seed dataset** automatically from `data/manifest.json`.
- Must support adding more session TXT files over time.
- Must not display or export respondent PII (name/email).

## Release scope (P0 items 1–9)
1. Rank Heatmap (ImageId × Rank 1/2/3)
2. Exposure Totals Chart (per imageId)
3. Full-Res Opens Chart (per imageId)
4. Exposure vs Selection Scatter
5. Method + Version Filters
6. Date Range Filter (submittedAt fallback startedAt)
7. Import ZIP of TXT files
8. Persistent Dataset Summary block
9. Export “Anomaly Log” (CSV)

## Out of scope
- Pairwise comparison charts (until comparisonsMade > 0 and events are present)
- Advanced statistical inference / experimentation tooling
- Backend storage or server-side compute
