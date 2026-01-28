# Release 6 PRD (Tight)

**Status:** Implemented (v6.0.5)

## Problem
Users need faster iterative analysis across dataset slices and better diagnostics without leaving the dashboard.

## Goals
- Save and reapply commonly used filters
- Compare two dataset slices side-by-side
- Enable image and session drilldowns (without revealing PII)
- Make anomalies reviewable in-app
- Make imports more reliable and transparent

## Non-Goals
- Any backend services
- Any display/export of respondent fields (PII)
- Performance pass beyond basic hygiene (explicitly deferred)

## Requirements (P0)
1) Presets
- Create/rename/delete preset
- Apply preset (updates all filters)
- Stored in localStorage only

2) Compare Mode
- Toggle Compare Mode on/off
- Independent filters for Slice A and Slice B
- KPI panel shows A, B, and delta

3) Image Drilldown
- Click imageId → drilldown
- Shows: rank distribution, exposures, opens, top3 counts, and breakdown by method/version

4) Session Drilldown
- Click sessionId → drilldown
- Shows operational metrics only (timings/counts/device/version/method + selected imageIds)

5) Anomaly Review
- Table with severity/code/source filters
- Export anomaly CSV remains (no PII)

6) Import Robustness
- Clear “import summary” (ok/failed + reason categories)
- Extend ZIP import compatibility where feasible for a static site

## Acceptance Criteria
- All features work offline via local static server
- No PII fields rendered anywhere
- No reliance on mutation observers for core rendering
