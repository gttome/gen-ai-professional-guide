export function createMetrics({ sessionId, startedAt }) {
  return {
    sessionId,
    method: "shortlist_then_rank",
    setsViewed: 0,
    shortlistCount: 0,
    imagesExpandedCount: 0,
    comparisonsMade: 0, // kept stable for later method swaps
    device: {
      category: getDeviceCategory(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    },
    exposures: {},     // imageId -> count shown
    fullResOpens: {},  // imageId -> count previewed
    counts: {
      taps: 0,
      marksToggled: 0,
      undoUsed: 0,
      top3Changes: 0,
    },
    submission: {
      channel: "mailto",
      attempts: 0,
      mailtoOpenedAt: null,
      copiedToClipboard: false,
      userConfirmedSent: null,
      confirmedAt: null,
    },
    errors: [],
    dropOffStep: null,
    startedAt,
  };
}

export function inc(map, key, by = 1) {
  map[key] = (map[key] || 0) + by;
}

export function recordExposure(metrics, imageId) {
  inc(metrics.exposures, imageId, 1);
}

export function recordPreviewOpen(metrics, imageId) {
  metrics.imagesExpandedCount += 1;
  inc(metrics.fullResOpens, imageId, 1);
}

export function recordError(metrics, category, message) {
  metrics.errors.push({
    category,
    message: String(message || ""),
    at: new Date().toISOString(),
  });
}

export function getDeviceCategory() {
  // Simple heuristic. Stable enough for MVP.
  const w = Math.min(window.innerWidth || 0, window.screen?.width || 0);
  return w <= 820 ? "mobile" : "desktop";
}
