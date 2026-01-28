# Architecture Overview — Book Cover Tester Analytics Dashboard

## Summary
This is a **static dashboard** intended for GitHub Pages and local static hosting.
It loads a seed dataset from `data/manifest.json` and `data/sessions/*.txt`, parses embedded JSON,
builds a normalized in-memory dataset, then renders KPIs, bar charts, histograms, and tables.

## Data flow
1. `index.html` loads `js/app.js`
2. `app.js` fetches `data/manifest.json` (cache-busted by server URL parameter if desired)
3. For each TXT path in `manifest.sessions[]`, fetch text, extract JSON block
4. Parse JSON, accumulate raw session objects
5. Merge with "extras" (added via TXT import or ZIP import) stored in localStorage
6. Deduplicate by `metrics.sessionId` (keeps latest `submittedAt`)
7. Normalize into:
   - sessions (1 row per session)
   - selections (3 rows per session)
   - exposures (25 rows per session)
   - opens (rows per session/image where openCount > 0)
8. Run data quality checks and render UI

## Why manifest.json exists
Browsers cannot list files in a directory on a static host. The manifest provides an explicit file list.
When you add TXT files permanently, run `rebuild-manifest.bat` to regenerate the manifest.

## Adding data over time
- Permanent: add `.txt` to `data/sessions/` + run `rebuild-manifest.bat`
- Quick: use in-app "Add TXT Files" (stored locally in the browser)

## Privacy
The dashboard intentionally does not surface `respondent` fields.
Exports are from normalized sessions and omit respondent PII.

## Extensibility
- If you add new methods (pairwise, maxdiff, bracket), extend:
  - normalization to capture new event/aggregate fields
  - charts to show comparisonsMade, undoUsed, etc.
- If you add step-level timings, extend KPI + effort tab with step breakdown charts.

