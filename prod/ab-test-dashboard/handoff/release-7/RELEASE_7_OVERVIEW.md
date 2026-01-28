# Release 7 — Performance Pass (Planned)

**Date:** 2026-01-27

**Status:** Planned

## Objective
Improve responsiveness and scalability for larger datasets by reducing recomputation and DOM churn.

## Scope
- Precompute aggregates once per rebuild
- Cache intermediate tables keyed by current slice
- Render charts from cached aggregates
- Maintain deterministic rendering (no observers)

## Constraints
- Static HTML5 (GitHub Pages compatible)
- Minimal dependencies
- Privacy-first
