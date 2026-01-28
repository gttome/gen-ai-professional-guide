# Release 6 Implementation Plan (High-Level)

1) Presets
- Define filter state schema (device/method/version/date)
- CRUD UI (modal or side panel)
- Persist to localStorage

2) Compare Mode
- Introduce sliceA/sliceB state
- Compute aggregates for each slice
- Render KPI deltas

3) Drilldowns
- Add simple hash routing (no framework)
- Image view → aggregates by imageId
- Session view → safe session metrics

4) Anomalies UI
- Render anomaly rows from existing anomaly sources
- Add filtering + export button

5) Import improvements
- Add per-file and per-zip summary, reason breakdown
- Expand ZIP reader compatibility where feasible while staying dependency-light
