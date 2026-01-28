# Book Cover Tester — Analytics Dashboard

**Build:** v5.0 (Release 5 P0)  
Static HTML5 dashboard for analyzing Book Cover Tester session logs (GitHub Pages compatible).

## Run locally
1. Double-click `server-start.bat`
2. Open `http://localhost:5510/index.html`

## Seed dataset
Seed sessions are `.txt` files listed in `data/manifest.json` (typically under `data/sessions/`).  
Each TXT contains an embedded JSON block between markers like `---BEGIN_JSON---` / `---END_JSON---`.

## Import more sessions (browser-local)
- **Add TXT Files**: import `.txt` session files
- **Import ZIP**: import a `.zip` containing `.txt` session files  
Imported sessions are stored in **localStorage** only. Use **Clear Added** to remove them.

## Release 5 highlights
- Method/version/date filters + persistent dataset summary (All vs Filtered)
- Rank heatmap (imageId × rank) with Count / % toggle
- Exposure totals + full‑res opens (Top 25)
- Exposure vs selection scatter
- Export Anomalies (CSV) including ingest/build/DQ issues

## Docs
See `handoff/HANDOFF_README.md` for full handoff notes and `handoff/release-5/` for Release 5 specs.
