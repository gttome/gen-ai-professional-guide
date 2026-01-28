# Book Cover Tester — Analytics Dashboard (Handoff)

**Build:** v6.0.5 (Release 6 hotfix + UX)

**v6.0.5 hotfix:** Anomalies tab now shows an explicit empty-state message when no anomalies match the current dataset/filters (prevents the table from looking broken).

**Notes:**
- Fix: Drilldown pages load seed sessions from `data/manifest.json` using the `sessions` list (older manifests may have used `files`).
- Fix: Drilldown fetch paths no longer double-prefix/URL-encode manifest entries.
- Enh: Anomalies table now lists **specific DQ rule codes** (e.g., `missing_method`, `missing_exposure_rows`) instead of a generic `dq_issue`.
- Enh: Added PII-safe tooltips across key UI elements (tabs, filters, KPIs, tables) to make the dashboard self-explanatory.

**App type:** Static HTML5 (GitHub Pages compatible)
**Privacy:** The dashboard never displays respondent fields and exports never include PII.

---

## What this app does
This dashboard:
- Loads a **seed dataset** of `.txt` session files listed in `data/manifest.json`
- Extracts the embedded JSON block from each TXT file
- Builds normalized tables in memory and renders KPIs + charts across multiple tabs
- Lets you import additional sessions (TXT or ZIP) into **localStorage** (browser-local only)

**Hotfix note (v6.0.0):** Tab buttons are now resilient if the HTML does not include `data-tab` attributes.

---

## Project layout (high level)
- `index.html` — UI shell + containers
- `css/styles.css` — styles (dark/light)
- `js/app.js` — data load, parsing, aggregation, rendering, exports
- `data/manifest.json` — list of seed session TXT paths
- `data/sessions/*.txt` — seed session files (each contains embedded JSON)
- `handoff/` — handoff docs + Release 5 specs

---

## Run locally

> Note: `server-start.bat` defaults to port **5520** (to reduce conflicts). If that port is busy, edit the BAT file to change the port.

1. Double-click **server-start.bat**
2. Open: `http://localhost:5520/index.html`

> GitHub Pages usage: deploy the repo as a static site; no server code required.

---

## Seed dataset format
Each seed `.txt` file contains a JSON payload embedded between markers like:

- `---BEGIN_JSON---`
- `---END_JSON---`

`js/app.js` extracts the JSON block and parses it into a session object.

---

## Importing additional sessions (stored locally)
You can extend the dataset without modifying the repo:

- **Add TXT Files**: select one or more `.txt` files
- **Import ZIP**: select a `.zip` containing `.txt` session files (nested folders are OK)

Imported sessions are stored in **localStorage** only (browser-local).  
Use **Clear Added** to remove them.

> ZIP import is implemented without JSZip to keep dependencies minimal; it relies on modern browser support for `DecompressionStream`.

---

## Filters (Release 5)
Filters apply to all charts and tables:
- Device (All / Mobile / Desktop / Unknown)
- Method (dataset-derived)
- Version (dataset-derived)
- Date range (submitted date, fallback: started date)

---

## Exports (no PII)
- **Export CSV** — key aggregates (Top‑1 wins, Top‑3 appearances)
- **Export JSONL** — cleaned normalized sessions (no respondent fields)
- **Export Anomalies** — anomaly + data-quality log (CSV), including:
  - seed load failures
  - import failures (TXT/ZIP)
  - build anomalies (duplicates/missing IDs)
  - schema/data-quality issues

---

## Troubleshooting
- If the seed dataset does not load, confirm `data/manifest.json` is present and paths are correct.
- If ZIP import fails, confirm you are using a modern Chromium-based browser (Edge/Chrome).

## Release 6 Notes (v6.0.0)
- Added filter presets (saved in localStorage, PII-safe).
- Added Compare tab (Slice A vs Slice B) with KPI delta.
- Added drilldown pages: image.html and session.html (PII-safe).
- Added Anomalies tab for review + filtering.
- ZIP import robustness: tries both deflate-raw and deflate.
