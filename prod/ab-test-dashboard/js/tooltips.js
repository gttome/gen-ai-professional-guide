/*
  Global tooltips helper (native title tooltips; no dependencies)
  - Adds helpful, PII-safe titles to key UI elements.
  - Deterministic: invoke explicitly after renders; no DOM observers.
*/
(function () {
  const ID_TIPS = {
    device_btn: "Filter sessions by device category (mobile/desktop/unknown)",
    method_btn: "Filter sessions by method",
    version_btn: "Filter sessions by app version",
    date_start: "Start date filter (inclusive) using submitted date (fallback: started date)",
    date_end: "End date filter (inclusive) using submitted date (fallback: started date)",
    btn_clear_filters: "Clear method/version/date filters (keeps device filter)",
    preset_btn: "Select a saved filter preset (local only)",
    btn_preset_save: "Save current filters as a named preset (local only)",
    btn_preset_delete: "Delete the selected preset (local only)",
    import_zip: "Import a ZIP of TXT session files (stored locally in your browser)",
    import_txt: "Add one or more TXT session files (stored locally in your browser)",
    btn_theme: "Toggle light/dark theme",
    btn_clear_extras: "Remove locally added sessions (keeps seed sessions)",
    btn_export_csv: "Export key aggregates as CSV (no PII)",
    btn_export_jsonl: "Export cleaned sessions as JSONL (no PII)",
    btn_export_anomalies: "Export anomaly + data-quality log as CSV (no PII)",
    dataset_summary_toggle: "Collapse/expand dataset summary (auto-collapses outside Overview)",
    anom_severity: "Filter anomalies by severity",
    anom_source: "Filter anomalies by source",
    anom_search: "Search anomalies by sessionId/code/filename/issue"
  };

  const KPI_TIPS = {
    "Sessions (filtered)": "Number of sessions included in the current filtered slice",
    "Completed": "Percent of sessions that have a submittedAt timestamp",
    "Median time": "Median time-to-complete (seconds) for the filtered slice",
    "p90 time": "90th percentile time-to-complete (seconds) for the filtered slice",
    "Full-res usage": "Percent of sessions that opened at least one full-resolution image",
    "Mailto opened": "Percent of sessions that opened the mailto link on submission"
  };

  const SEV_TIPS = {
    bad: "bad: likely corrupted/incomplete in a way that can skew results",
    warn: "warn: usable but incomplete or suspicious; may under/over-count some charts",
    info: "info: informational; not expected to skew results"
  };

  function setTitleIfMissing(el, title) {
    if (!el || !title) return;
    if (el.getAttribute("title")) return;
    el.setAttribute("title", title);
  }

  function normalizeText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function applyTooltips(root) {
    const r = root || document;

    // Explicit id tips
    for (const [id, tip] of Object.entries(ID_TIPS)) {
      const el = r.getElementById ? r.getElementById(id) : document.getElementById(id);
      setTitleIfMissing(el, tip);
    }

    // Tabs
    r.querySelectorAll?.(".tab")?.forEach((t) => {
      const label = normalizeText(t.textContent);
      setTitleIfMissing(t, label ? `Show ${label} section` : "Switch tab");
    });

    // KPI cards
    r.querySelectorAll?.(".kpi")?.forEach((k) => {
      const label = normalizeText(k.querySelector(".label")?.textContent);
      if (!label) return;
      setTitleIfMissing(k, KPI_TIPS[label] || `KPI: ${label}`);
    });

    // Table headers
    r.querySelectorAll?.("th")?.forEach((th) => {
      const label = normalizeText(th.textContent);
      setTitleIfMissing(th, label);
    });

    // Severity pills
    r.querySelectorAll?.(".pill.bad, .pill.warn")?.forEach((p) => {
      const sev = p.classList.contains("bad") ? "bad" : (p.classList.contains("warn") ? "warn" : "info");
      setTitleIfMissing(p, SEV_TIPS[sev] || sev);
    });

    // Buttons/links/labels missing a title: fall back to their text
    r.querySelectorAll?.("button, a.btn, label.btn")?.forEach((b) => {
      const txt = normalizeText(b.textContent);
      if (!txt) return;
      setTitleIfMissing(b, txt);
    });

    // Chart containers: use nearest heading as tooltip
    r.querySelectorAll?.(".bars, .heatmap, .scatter")?.forEach((c) => {
      const card = c.closest?.(".card");
      const h = card?.querySelector?.("h2, h3");
      const label = normalizeText(h?.textContent);
      if (label) setTitleIfMissing(c, `Chart: ${label}`);
    });
  }

  // Expose for app/drilldown scripts
  window.applyTooltips = applyTooltips;
  window.__sevTip = (sev) => SEV_TIPS[String(sev || "info").toLowerCase()] || String(sev || "info");
})();
