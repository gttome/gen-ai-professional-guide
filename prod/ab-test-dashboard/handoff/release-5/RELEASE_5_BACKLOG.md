# Release 5 Backlog (P0 items 1–9)

## P0-1 Rank heatmap
- [x] Compute counts by (imageId, rank)
- [x] Render heatmap table
- [x] Add legend + count/percent toggle (optional)

## P0-2 Exposure totals chart
- [x] Aggregate exposures per imageId
- [x] Render chart (Top 25)

## P0-3 Full-res opens chart
- [x] Aggregate opens per imageId
- [x] Render chart (Top 25)
- [x] KPI: sessions with any full-res opens

## P0-4 Exposure vs selection scatter
- [x] Build per-image dataset
- [x] Render scatter (SVG)
- [x] Tooltip on hover

## P0-5 Method + version filters
- [x] Populate from dataset
- [x] Wire filter state + re-render

## P0-6 Date range filter
- [x] Add UI
- [x] Parse ISO timestamps safely
- [x] Filter sessions by date

## P0-7 Import ZIP of TXT files
- [x] Add UI (Import ZIP)
- [x] Implement ZIP import without JSZip (native DecompressionStream + minimal ZIP parser)
- [x] Parse zip members + update added sessions store
- [x] Track member filename in anomalies

## P0-8 Persistent dataset summary
- [x] Create summary component
- [x] Show distributions + min/max dates

## P0-9 Export anomaly log CSV
- [x] Compile anomalies + DQ issues into a flat table
- [x] Export CSV download
