# Release 5 PRD — Book Cover Tester Analytics Dashboard (P0)

## 1. Problem
The dashboard currently provides a minimal set of insights. Key product questions require:
- Understanding rank distribution (not just Top1/Top3 counts)
- Validating exposure patterns and preview behavior
- Relating exposure and selection outcomes (bias/proxy effects)
- Basic dataset operations (ZIP import, anomaly export, richer filtering)

## 2. Goals
- Add high-value charts and filters without adding backend dependencies.
- Make ongoing data ingestion easy for non-technical workflows.
- Improve confidence in conclusions via exposure and quality diagnostics.

## 3. Users
- Primary: You (owner) reviewing cover preference signals and UX friction
- Secondary: Stakeholders viewing summarized results

## 4. Success metrics
- Ability to answer, within 60 seconds:
  - “What are the top winners and how do they distribute across ranks?”
  - “Are exposures balanced and do exposures correlate with picks?”
  - “Which images trigger full-res inspection?”
  - “Which dataset slice (device/method/version/date) is being viewed?”
- Importing new data: ZIP ingestion works in one step and updates metrics immediately.
- Data quality: anomaly export surfaces parsing failures and schema violations.

## 5. Functional requirements (P0)

### FR1 — Rank heatmap
- Show table/heatmap of imageId vs ranks 1–3.
- Support counts and percentage mode toggle (optional if time allows).
- Driven from: `results.top3[].{rank,imageId}`

### FR2 — Exposure totals chart
- Bar chart: total exposures per imageId across filtered sessions.
- Driven from: `metrics.exposures[imageId]`

### FR3 — Full-res opens chart
- Bar chart: total full-res opens per imageId across filtered sessions.
- Secondary KPI: % sessions with any full-res opens.
- Driven from: `metrics.fullResOpens[imageId]` and session-level totals.

### FR4 — Exposure vs selection scatter
- Scatter plot:
  - x = exposure totals per imageId
  - y = Top3 appearances per imageId (or Top1 wins toggle)
- Optional: tooltips show imageId and values.

### FR5 — Method + version filters
- Dropdown filters populated dynamically from dataset:
  - `metrics.method`
  - `version`
- “All” option always present.

### FR6 — Date range filter
- Filter sessions based on:
  - primary: `submittedAt`
  - fallback: `startedAt`
- UI: start date / end date inputs.
- Default: All time.

### FR7 — Import ZIP of TXT files
- UI: “Import ZIP” button.
- Accept a .zip containing `.txt` files with embedded JSON markers.
- Parse like current TXT import.
- Store imported sessions in localStorage (same as current “Add TXT Files”), unless you decide to “seed add” them manually.

### FR8 — Dataset summary block (persistent)
- Always-visible block showing:
  - N sessions (filtered + unfiltered)
  - device distribution
  - version distribution
  - method distribution
  - date range (min/max)
  - parsed/failed counts (seed + added)

### FR9 — Export anomaly log CSV
- Export CSV listing:
  - sessionId (or “?” if missing)
  - issue / code
  - severity
  - source (“seed” or “added”)
  - file name where known (ZIP member name or TXT name)

## 6. Non-functional requirements
- Must remain static + fast (client-side compute).
- No PII displayed or exported in analytics exports.
- Clear “Build” indicator in UI.
- Avoid fragile DOM observers; rely on deterministic rendering.

## 7. Acceptance criteria
- Each FR above has a visible UI element and updates when filters change.
- ZIP import updates “Added” count and refreshes charts without reload.
- Anomaly CSV exports and includes rows for parse failures and DQ issues.
