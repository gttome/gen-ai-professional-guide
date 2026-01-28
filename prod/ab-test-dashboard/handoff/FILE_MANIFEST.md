# File Manifest

- `index.html` — Dashboard UI (static).
- `css/styles.css` — Dashboard styling.
- `js/app.js` — Parsing, normalization, aggregations, rendering, export.
- `data/manifest.json` — Startup manifest listing seed session TXT files.
- `data/sessions/*.txt` — Seed dataset TXT files (embedded JSON).
- `server-start.bat (only; server-start.bat removed)` — Local Python HTTP server runner (opens browser).
- `rebuild-manifest.bat` — Rebuilds manifest.json after adding new TXT files.
- `tools/rebuild_manifest.py` — Helper script used by rebuild-manifest.bat.
- `handoff/HANDOFF_README.md` — How to run, add data, and privacy notes.
- `handoff/FILE_MANIFEST.md` — This file list.
- `handoff/ARCHITECTURE_OVERVIEW.md` — How the dashboard works.
- `handoff/START_NEW_CHAT_PROMPT.txt` — Paste into a new chat to continue development.

- `handoff/release-5/RELEASE_5_OVERVIEW.md` — Release 5 scope and constraints.
- `handoff/release-5/RELEASE_5_PRD.md` — Release 5 PRD for P0 items 1–9.
- `handoff/release-5/RELEASE_5_BACKLOG.md` — Release 5 backlog checklist.
- `handoff/release-5/RELEASE_5_IMPLEMENTATION_PLAN.md` — Implementation plan.
- `handoff/START_NEW_CHAT_PROMPT_RELEASE5.txt` — Prompt to start the next chat on Release 5.
- `server-start.bat` — Updated launcher (default port 5510).


## Planned release docs
- handoff/release-6/
- handoff/release-7/

## Release 6 additions
- image.html — Image drilldown page (PII-safe)
- session.html — Session drilldown page (PII-safe)
- js/drilldown.js — Data loader + render logic for drilldown pages
