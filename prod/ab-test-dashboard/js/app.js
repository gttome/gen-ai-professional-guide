// Book Cover Tester Analytics Dashboard (Static, GitHub Pages friendly)
// Release 5 (P0) implementation
// - Adds method/version/date filters, persistent dataset summary
// - Adds rank heatmap, exposure + full-res charts, exposure-vs-selection scatter
// - Adds ZIP import (no CDN deps) and anomaly CSV export
//
// Privacy: the dashboard never renders respondent fields and exports do not include PII.

const STORAGE_KEY_EXTRA = "bct_dashboard_extra_sessions_v1"; // backward compatible key
const STORAGE_KEY_IMPORT_ANOMS = "bct_dashboard_import_anomalies_v1";
const STORAGE_KEY_PRESETS = "bct_dashboard_filter_presets_v1";
const THEME_KEY = "bct_dashboard_theme_v1";

const BUILD = "5.0.1";

const state = {
  // normalized
  sessions: [],
  selections: [],
  exposures: [],
  opens: [],
  dq: [],

  // anomaly log (flat rows)
  anomalies: [],

  // ingest stats
  ingest: {
    seedTotal: 0, seedParsed: 0, seedFailed: 0,
    addedTotal: 0, addedParsed: 0, addedFailed: 0,
  },

  // UI
  filters: {
    device: "all",
    method: "all",
    version: "all",
    dateStart: "",
    dateEnd: ""
  },
  presets: {
    selected: "__none__",
    list: [] // [{name, filters}]
  },
  compare: {
    A: { device:"all", method:"all", version:"all", dateStart:"", dateEnd:"" },
    B: { device:"all", method:"all", version:"all", dateStart:"", dateEnd:"" }
  },
  heatmapMode: "count", // count | pct
  activeTab: "overview",
  summaryCollapsed: false,
  meta: { methods: [], versions: [] }
};

// -------------------------------
// DOM helpers
// -------------------------------
const $ = (sel) => document.querySelector(sel);


function setDatasetSummaryCollapsed(collapsed) {
  state.summaryCollapsed = !!collapsed;
  const card = $("#dataset_summary");
  const body = $("#dataset_summary_body");
  const btn = $("#dataset_summary_toggle");
  if (!card || !body || !btn) return;
  body.style.display = state.summaryCollapsed ? "none" : "";
  card.classList.toggle("collapsed", state.summaryCollapsed);
  btn.textContent = state.summaryCollapsed ? "Expand" : "Collapse";
  btn.setAttribute("aria-expanded", String(!state.summaryCollapsed));
}

function scrollToActivePanel(tabKey) {
  const key = String(tabKey || "overview");
  if (key === "overview") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const panel = $(`#panel_${key}`);
  if (!panel) return;
  const header = document.querySelector("header");
  const offset = (header ? header.getBoundingClientRect().height : 0) + 12;
  const y = panel.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

function setStatus(msg) {
  const el = $("#status");
  if (el) el.textContent = msg;
}
function setStatusDetail(msg) {
  const el = $("#status_detail");
  if (el) el.textContent = msg;
}

function updateThemeButton() {
  const cur = document.documentElement.dataset.theme || "dark";
  const btn = $("#btn_theme");
  if (!btn) return;
  btn.textContent = cur === "dark" ? "Light theme" : "Dark theme";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  updateThemeButton();
}

// -------------------------------
// Parsing helpers
// -------------------------------
function extractJsonBlock(text) {
  // expects a JSON block embedded between markers in the TXT file
  // markers are tolerant: looks for first '{' after "BEGIN_JSON" and last '}' before "END_JSON"
  const s = String(text || "");
  const begin = s.indexOf("BEGIN_JSON");
  const end = s.indexOf("END_JSON");
  if (begin >= 0 && end > begin) {
    const chunk = s.slice(begin, end);
    const first = chunk.indexOf("{");
    const last = chunk.lastIndexOf("}");
    if (first >= 0 && last >= 0 && last > first) return chunk.slice(first, last + 1);
  }
  // fallback: find first '{' and last '}' in file
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last >= 0 && last > first) return s.slice(first, last + 1);
  return "";
}

function safeJsonParse(jsonText) {
  try {
    if (!jsonText) return null;
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function parseViewport(vp) {
  const s = String(vp || "");
  const m = s.match(/(\d+)x(\d+)/);
  if (!m) return { vpW: null, vpH: null };
  return { vpW: Number(m[1]), vpH: Number(m[2]) };
}

function isoDateKey(ts) {
  // returns YYYY-MM-DD or null
  if (!ts) return null;
  const s = String(ts);
  // accept ISO-ish (seed uses ISO)
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  // try Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

function compareDateKeys(a, b) {
  // a, b are YYYY-MM-DD or null; null sorts last
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a < b ? -1 : a > b ? 1 : 0;
}

// -------------------------------
// Data quality checks (schema-level signals)
// -------------------------------
function runDataQualityChecks(obj) {
  const issues = [];
  const m = obj?.metrics || {};
  const r = obj?.results || {};
  const top3 = Array.isArray(r.top3) ? r.top3 : [];

  if (!m.sessionId) issues.push({ code: "missing_sessionId", severity: "bad" });
  if (m.timeToCompleteSeconds == null) issues.push({ code: "missing_time", severity: "warn" });

  // Top3 ranks valid
  const ranks = top3.map(x => x.rank).slice().sort((a,b)=>a-b);
  const rankOk = JSON.stringify(ranks) === JSON.stringify([1,2,3]);
  if (!rankOk) issues.push({ code: "top3_rank_invalid", severity: "bad" });

  // unique imageIds
  const ids = top3.map(x => String(x.imageId));
  const unique = new Set(ids);
  if (unique.size !== ids.length) issues.push({ code: "top3_duplicate_image", severity: "bad" });

  // favorite == top1
  const top1 = top3.find(x => x.rank === 1)?.imageId;
  const fav = r?.favorite?.imageId;
  if (top1 != null && fav != null && String(top1) !== String(fav)) {
    issues.push({ code: "favorite_not_top1", severity: "warn" });
  }

  // exposures include 1..25
  const exp = m.exposures || {};
  let missing = false;
  for (let i = 1; i <= 25; i++) {
    if (!(String(i) in exp)) { missing = true; break; }
  }
  if (missing) issues.push({ code: "exposures_missing_keys", severity: "warn" });

  return { sessionId: m.sessionId || "(missing)", issues };
}

// -------------------------------
// Dataset build + aggregation
// -------------------------------
function unwrapEntry(entry) {
  if (entry && typeof entry === "object" && "data" in entry && entry.data) {
    return { obj: entry.data, meta: entry.meta || {} };
  }
  return { obj: entry, meta: {} };
}

function buildDataset(rawEntries) {
  // Deduplicate by sessionId: prefer latest submittedAt (then startedAt)
  const byId = new Map();
  const anomalies = [];

  for (const ent of rawEntries || []) {
    const { obj, meta } = unwrapEntry(ent);
    const sid = obj?.metrics?.sessionId;

    if (!sid) {
      anomalies.push({
        sessionId: "?",
        code: "missing_sessionId",
        issue: "Missing sessionId (skipped)",
        severity: "bad",
        source: meta.source || "unknown",
        filename: meta.filename || ""
      });
      continue;
    }

    const existing = byId.get(sid);
    if (!existing) {
      byId.set(sid, { obj, meta });
    } else {
      const a = isoDateKey(existing.obj?.submittedAt) || isoDateKey(existing.obj?.startedAt) || "";
      const b = isoDateKey(obj?.submittedAt) || isoDateKey(obj?.startedAt) || "";
      if (b && (!a || b > a)) byId.set(sid, { obj, meta });
      anomalies.push({
        sessionId: sid,
        code: "duplicate_sessionId",
        issue: "Duplicate sessionId (kept latest date)",
        severity: "warn",
        source: meta.source || "unknown",
        filename: meta.filename || ""
      });
    }
  }

  const sessions = [];
  const selections = [];
  const exposures = [];
  const opens = [];
  const dq = [];

  for (const { obj, meta } of byId.values()) {
    const m = obj.metrics || {};
    const r = obj.results || {};
    const dev = m.device || {};
    const counts = m.counts || {};
    const sub = m.submission || {};

    const dateKey = isoDateKey(obj.submittedAt) || isoDateKey(obj.startedAt);

    sessions.push({
      sessionId: m.sessionId,
      app: obj.app,
      version: obj.version,
      startedAt: obj.startedAt,
      submittedAt: obj.submittedAt,
      dateKey,

      method: m.method,
      deviceCategory: dev.category,
      viewport: dev.viewport,
      ...parseViewport(dev.viewport),

      timeSec: m.timeToCompleteSeconds,
      setsViewed: m.setsViewed,
      shortlistCount: m.shortlistCount,
      comparisonsMade: m.comparisonsMade,

      taps: counts.taps,
      marksToggled: counts.marksToggled,
      undoUsed: counts.undoUsed,
      top3Changes: counts.top3Changes,
      expands: m.imagesExpandedCount,

      submitAttempts: sub.attempts,
      mailtoOpenedAt: sub.mailtoOpenedAt,
      copiedToClipboard: sub.copiedToClipboard,
      userConfirmedSent: sub.userConfirmedSent,
      confirmedAt: sub.confirmedAt,

      dropOffStep: m.dropOffStep,
      errorsCount: Array.isArray(m.errors) ? m.errors.length : 0,

      source: meta.source || "unknown",
      filename: meta.filename || ""
    });

    const top3 = Array.isArray(r.top3) ? r.top3 : [];
    for (const it of top3) {
      selections.push({
        sessionId: m.sessionId,
        rank: it.rank,
        imageId: String(it.imageId),
      });
    }

    const exp = m.exposures || {};
    for (const [imageId, count] of Object.entries(exp)) {
      exposures.push({
        sessionId: m.sessionId,
        imageId: String(imageId),
        exposureCount: Number(count || 0),
      });
    }

    const fr = m.fullResOpens || {};
    for (const [imageId, count] of Object.entries(fr)) {
      const c = Number(count || 0);
      if (c > 0) {
        opens.push({
          sessionId: m.sessionId,
          imageId: String(imageId),
          openCount: c,
        });
      }
    }

    const dqq = runDataQualityChecks(obj);
    dqq.source = meta.source || "unknown";
    dqq.filename = meta.filename || "";
    dq.push(dqq);
  }

  return { sessions, selections, exposures, opens, dq, anomalies };
}

// -------------------------------
// Stats utilities
// -------------------------------
function median(arr) { return percentile(arr, 0.5); }
function percentile(arr, p) {
  const a = arr.filter(Number.isFinite).slice().sort((x,y)=>x-y);
  if (!a.length) return null;
  const i = (a.length - 1) * p;
  const lo = Math.floor(i), hi = Math.ceil(i);
  if (lo === hi) return a[lo];
  return a[lo] + (a[hi]-a[lo]) * (i - lo);
}
function mean(arr) {
  const a = arr.filter(Number.isFinite);
  if (!a.length) return null;
  return a.reduce((s,x)=>s+x,0)/a.length;
}
function std(arr) {
  const m = mean(arr);
  if (m == null) return null;
  const a = arr.filter(Number.isFinite);
  const v = a.reduce((s,x)=>s+(x-m)*(x-m),0)/a.length;
  return Math.sqrt(v);
}
function cv(arr) {
  const m = mean(arr);
  const sd = std(arr);
  if (m == null || sd == null || m === 0) return null;
  return sd / m;
}
function gini(arr) {
  const a = arr.filter(x => Number.isFinite(x) && x >= 0).slice().sort((x,y)=>x-y);
  if (!a.length) return 0;
  const n = a.length;
  const sum = a.reduce((s,x)=>s+x,0);
  if (sum === 0) return 0;
  let cum = 0;
  for (let i=0;i<n;i++) cum += (2*(i+1)-n-1)*a[i];
  return cum / (n * sum);
}

// -------------------------------
// Filtering + lookups
// -------------------------------
function filteredSessions() {
  const { device, method, version, dateStart, dateEnd } = state.filters;
  const ds = dateStart || "";
  const de = dateEnd || "";

  return state.sessions.filter(s => {
    if (device !== "all") {
      const cat = s.deviceCategory || "unknown";
      if (cat !== device) return false;
    }
    if (method !== "all") {
      if ((s.method || "unknown") !== method) return false;
    }
    if (version !== "all") {
      if ((s.version || "unknown") !== version) return false;
    }
    if (ds) {
      const k = s.dateKey;
      if (!k || k < ds) return false;
    }
    if (de) {
      const k = s.dateKey;
      if (!k || k > de) return false;
    }
    return true;
  });
}

function selectionRowsForSessions(ids) {
  const set = new Set(ids);
  return state.selections.filter(r => set.has(r.sessionId));
}
function exposuresRowsForSessions(ids) {
  const set = new Set(ids);
  return state.exposures.filter(r => set.has(r.sessionId));
}
function opensRowsForSessions(ids) {
  const set = new Set(ids);
  return state.opens.filter(r => set.has(r.sessionId));
}

function countBy(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]);
}

function fmtPct(n, d) {
  if (!d) return "0%";
  return (n/d*100).toFixed(1) + "%";
}

function fmtDateRange(minKey, maxKey) {
  if (!minKey && !maxKey) return "—";
  if (minKey && maxKey) return `${minKey} → ${maxKey}`;
  return minKey || maxKey || "—";
}

function activeSliceLabel() {
  const parts = [];
  parts.push(`device=${state.filters.device}`);
  parts.push(`method=${state.filters.method}`);
  parts.push(`version=${state.filters.version}`);
  const ds = state.filters.dateStart || "—";
  const de = state.filters.dateEnd || "—";
  parts.push(`date=${ds}..${de}`);
  return parts.join(" | ");
}

// -------------------------------
// Rendering primitives
// -------------------------------
function renderBars(containerId, rows, labelPrefix="", maxItems=10) {
  const el = $(containerId);
  if (!el) return;
  el.innerHTML = "";
  const top = rows.slice(0, maxItems);
  const max = top.reduce((m, [,v]) => Math.max(m, v), 1);
  for (const [k, v] of top) {
    const row = document.createElement("div");
    row.className = "barRow";

    const lab = document.createElement("div");
    lab.className = "barLabel";
    const kk = String(k);
    if (kk.startsWith("#")) {
      const n = Number(kk.replace(/^#/, ""));
      if (Number.isFinite(n)) {
        lab.innerHTML = `${escapeHtml(labelPrefix)}${linkImageId(n)}`;
      } else {
        lab.textContent = labelPrefix + kk;
      }
    } else {
      lab.textContent = labelPrefix + kk;
    }

    const track = document.createElement("div");
    track.className = "barTrack";
    const fill = document.createElement("div");
    fill.className = "barFill";
    fill.style.width = (v / max * 100).toFixed(1) + "%";
    track.appendChild(fill);

    const val = document.createElement("div");
    val.className = "barVal";
    val.textContent = v;

    row.appendChild(lab);
    row.appendChild(track);
    row.appendChild(val);

    el.appendChild(row);
  }
  if (!top.length) {
    const h = document.createElement("div");
    h.className = "hint";
    h.textContent = "No data in the current slice.";
    el.appendChild(h);
  }
}

function renderHistogram(containerId, values, bins=10) {
  const el = $(containerId);
  if (!el) return;
  el.innerHTML = "";
  const a = values.filter(Number.isFinite);
  if (!a.length) {
    el.innerHTML = '<div class="hint">No data.</div>';
    return;
  }
  const min = Math.min(...a);
  const max = Math.max(...a);
  const span = max - min || 1;
  const counts = Array.from({length: bins}, () => 0);
  for (const v of a) {
    const idx = Math.min(bins - 1, Math.floor((v - min) / span * bins));
    counts[idx]++;
  }
  const rows = counts.map((c, i) => [`${Math.round(min + i*span/bins)}–${Math.round(min + (i+1)*span/bins)}`, c]);
  renderBars(containerId, rows, "", bins);
}

function escapeHtml(s){
  return String(s ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
function fmtNum(x){
  if (x == null || x === "") return "—";
  const n = Number(x);
  if (!Number.isFinite(n)) return "—";
  return String(Math.round(n));
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// -------------------------------
// New visualizations (Release 5)
// -------------------------------
function renderDatasetSummary() {
  const all = state.sessions;
  const filtered = filteredSessions();

  const rows = [];

  rows.push(["Sessions", String(all.length), String(filtered.length)]);

  const seedAll = all.filter(s => s.source === "seed").length;
  const addedAll = all.filter(s => s.source === "added").length;
  const seedF = filtered.filter(s => s.source === "seed").length;
  const addedF = filtered.filter(s => s.source === "added").length;
  rows.push(["Source (seed/added)", `${seedAll}/${addedAll}`, `${seedF}/${addedF}`]);

  // Date ranges
  const allDates = all.map(s => s.dateKey).filter(Boolean).slice().sort();
  const fDates = filtered.map(s => s.dateKey).filter(Boolean).slice().sort();
  rows.push(["Date range", fmtDateRange(allDates[0], allDates[allDates.length-1]), fmtDateRange(fDates[0], fDates[fDates.length-1])]);

  // Distributions
  const fmtDist = (arr, keyFn) => {
    const total = arr.length || 1;
    const counts = countBy(arr, keyFn);
    return counts.map(([k,v]) => `${k}=${v} (${fmtPct(v,total)})`).join(", ") || "—";
  };

  rows.push(["Devices", fmtDist(all, s => s.deviceCategory || "unknown"), fmtDist(filtered, s => s.deviceCategory || "unknown")]);
  rows.push(["Methods", fmtDist(all, s => s.method || "unknown"), fmtDist(filtered, s => s.method || "unknown")]);
  rows.push(["Versions", fmtDist(all, s => s.version || "unknown"), fmtDist(filtered, s => s.version || "unknown")]);

  const seedParsed = state.ingest.seedParsed;
  const seedFailed = state.ingest.seedFailed;
  const addedParsed = state.ingest.addedParsed;
  const addedFailed = state.ingest.addedFailed;
  rows.push(["Parsed/failed (seed)", `${seedParsed}/${seedFailed}`, "—"]);
  rows.push(["Parsed/failed (added)", `${addedParsed}/${addedFailed}`, "—"]);

  const tbody = $("#summary_table tbody");
  if (tbody) {
    tbody.innerHTML = "";
    for (const [metric, a, f] of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(metric)}</td><td>${escapeHtml(a)}</td><td>${escapeHtml(f)}</td>`;
      tbody.appendChild(tr);
    }
  }

  const slice = $("#summary_slice");
  if (slice) slice.textContent = activeSliceLabel();
}

function renderRankHeatmap() {
  const ids = filteredSessions().map(s => s.sessionId);
  const sel = selectionRowsForSessions(ids);

  const totalSessions = ids.length || 1;

  // counts[imageId][rank] = count
  const counts = {};
  for (let i=1;i<=25;i++) counts[String(i)] = { 1:0, 2:0, 3:0 };

  for (const r of sel) {
    const img = String(r.imageId);
    const rank = Number(r.rank);
    if (counts[img] && (rank === 1 || rank === 2 || rank === 3)) counts[img][rank] += 1;
  }

  // find max for intensity
  let max = 0;
  for (let i=1;i<=25;i++){
    const c = counts[String(i)];
    max = Math.max(max, c[1], c[2], c[3]);
  }
  max = max || 1;

  const mode = state.heatmapMode;

  const wrap = $("#rank_heatmap");
  if (!wrap) return;
  wrap.innerHTML = "";

  const tbl = document.createElement("table");
  tbl.className = "heatmap";
  tbl.innerHTML = `
    <thead>
      <tr>
        <th>imageId</th>
        <th>Rank 1</th>
        <th>Rank 2</th>
        <th>Rank 3</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tbl.querySelector("tbody");

  for (let i=1;i<=25;i++){
    const img = String(i);
    const c = counts[img];
    const tr = document.createElement("tr");
    const cell = (rank) => {
      const v = c[rank];
      const intensity = v / max;
      const alpha = 0.10 + intensity * 0.75;
      const display = mode === "pct" ? fmtPct(v, totalSessions) : String(v);
      return `<td><span class="heatCell" style="background: rgba(var(--accent-rgb), ${alpha.toFixed(3)});" title="imageId ${img}, rank ${rank}: ${v}">${escapeHtml(display)}</span></td>`;
    };
    tr.innerHTML = `<td>${linkImageId(img)}</td>${cell(1)}${cell(2)}${cell(3)}`;
    tbody.appendChild(tr);
  }

  wrap.appendChild(tbl);

  const legend = $("#rank_heatmap_legend");
  if (legend) {
    legend.innerHTML = `<span class="hint">Intensity: low → high</span><span class="legendSwatch" aria-hidden="true"></span><span class="hint">max cell count: ${max}</span>`;
  }
}

function renderExposureChartsAndScatter() {
  const ids = filteredSessions().map(s => s.sessionId);

  // Exposure totals
  const expRows = exposuresRowsForSessions(ids);
  const expTotals = new Map();
  for (const r of expRows) expTotals.set(r.imageId, (expTotals.get(r.imageId) || 0) + r.exposureCount);

  const expArr = [];
  for (let i=1;i<=25;i++) expArr.push([String(i), expTotals.get(String(i)) || 0]);
  expArr.sort((a,b)=>b[1]-a[1]);
  renderBars("#exposure_totals_bars", expArr, "", 25);

  // Full-res opens totals + sessions with any
  const openRows = opensRowsForSessions(ids);
  const openTotals = new Map();
  const sessionsWithOpen = new Set();
  for (const r of openRows) {
    openTotals.set(r.imageId, (openTotals.get(r.imageId) || 0) + r.openCount);
    sessionsWithOpen.add(r.sessionId);
  }
  const openArr = [];
  for (let i=1;i<=25;i++) openArr.push([String(i), openTotals.get(String(i)) || 0]);
  openArr.sort((a,b)=>b[1]-a[1]);
  renderBars("#fullres_opens_bars", openArr, "", 25);

  const kpi = $("#kpi_fullres_sessions");
  if (kpi) kpi.textContent = `${sessionsWithOpen.size} (${fmtPct(sessionsWithOpen.size, ids.length || 1)})`;

  // Scatter: x = exposure totals, y = top3 appearances
  const sel = selectionRowsForSessions(ids);
  const top3Counts = new Map();
  for (const r of sel) top3Counts.set(r.imageId, (top3Counts.get(r.imageId) || 0) + 1);

  const points = [];
  for (let i=1;i<=25;i++){
    const img = String(i);
    points.push({
      imageId: img,
      x: expTotals.get(img) || 0,
      y: top3Counts.get(img) || 0
    });
  }
  renderScatter("#exposure_selection_scatter", points);
}

function renderScatter(containerId, points) {
  const el = $(containerId);
  if (!el) return;
  el.innerHTML = "";

  const w = 760, h = 420;
  const pad = { l: 56, r: 18, t: 18, b: 54 };

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const xMax = Math.max(1, ...xs);
  const yMax = Math.max(1, ...ys);

  const xScale = (x) => pad.l + (x / xMax) * (w - pad.l - pad.r);
  const yScale = (y) => (h - pad.b) - (y / yMax) * (h - pad.t - pad.b);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const axis = (x1,y1,x2,y2) => {
    const ln = document.createElementNS(svg.namespaceURI, "line");
    ln.setAttribute("x1", x1); ln.setAttribute("y1", y1);
    ln.setAttribute("x2", x2); ln.setAttribute("y2", y2);
    ln.setAttribute("stroke", "currentColor");
    ln.setAttribute("opacity", "0.35");
    ln.setAttribute("stroke-width", "1");
    return ln;
  };

  svg.appendChild(axis(pad.l, pad.t, pad.l, h - pad.b));
  svg.appendChild(axis(pad.l, h - pad.b, w - pad.r, h - pad.b));

  const mkText = (x,y,txt,anchor="middle") => {
    const t = document.createElementNS(svg.namespaceURI, "text");
    t.setAttribute("x", x); t.setAttribute("y", y);
    t.setAttribute("fill", "currentColor");
    t.setAttribute("opacity", "0.75");
    t.setAttribute("font-size", "12");
    t.setAttribute("text-anchor", anchor);
    t.textContent = txt;
    return t;
  };

  svg.appendChild(mkText(pad.l, h - pad.b + 36, "Exposure totals", "start"));
  svg.appendChild(mkText(10, pad.t + 10, "Top‑3 appearances", "start"));

  const tip = document.createElement("div");
  tip.className = "scatterTip";
  tip.style.display = "none";
  el.appendChild(tip);

  const showTip = (evt, p) => {
    const rect = el.getBoundingClientRect();
    tip.style.display = "block";
    tip.innerHTML = `<div><b>imageId ${escapeHtml(p.imageId)}</b></div>
      <div class="muted">exposures: ${escapeHtml(p.x)}</div>
      <div class="muted">top‑3: ${escapeHtml(p.y)}</div>`;
    const x = (evt.clientX - rect.left) + 12;
    const y = (evt.clientY - rect.top) + 12;
    tip.style.left = Math.min(x, rect.width - 260) + "px";
    tip.style.top = Math.min(y, rect.height - 90) + "px";
  };
  const hideTip = () => { tip.style.display = "none"; };

  for (const p of points) {
    const cx = xScale(p.x);
    const cy = yScale(p.y);

    const c = document.createElementNS(svg.namespaceURI, "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", 6.2);
    c.setAttribute("fill", "currentColor");
    c.setAttribute("opacity", "0.65");

    c.addEventListener("mouseenter", (e) => showTip(e, p));
    c.addEventListener("mousemove", (e) => showTip(e, p));
    c.addEventListener("mouseleave", hideTip);

    svg.appendChild(c);

    const lab = mkText(cx, cy - 10, String(p.imageId), "middle");
    lab.setAttribute("font-size", "11");
    lab.setAttribute("opacity", "0.55");
    svg.appendChild(lab);
  }

  svg.addEventListener("mouseleave", hideTip);

  el.appendChild(svg);
}

// -------------------------------
// Existing tables + KPIs
// -------------------------------
function renderKPIs() {
  const s = filteredSessions();
  const ids = s.map(x => x.sessionId);

  const times = s.map(x => Number(x.timeSec)).filter(Number.isFinite);

  const mTime = median(times);
  const p90Time = percentile(times, 0.9);

  // full-res usage: prefer opens rows if present, else fallback to expands>0 proxy
  const sessionsWithOpen = new Set(opensRowsForSessions(ids).map(r => r.sessionId));
  const fullResUsers = sessionsWithOpen.size || s.filter(x => Number(x.expands) > 0).length;
  const mailtoOpened = s.filter(x => x.mailtoOpenedAt != null).length;

  $("#kpi_sessions").textContent = s.length;
  $("#kpi_completed").textContent = fmtPct(s.filter(x => x.submittedAt != null).length, s.length || 1);
  $("#kpi_median_time").textContent = mTime == null ? "—" : Math.round(mTime) + "s";
  $("#kpi_p90_time").textContent = p90Time == null ? "—" : Math.round(p90Time) + "s";
  $("#kpi_fullres").textContent = fmtPct(fullResUsers, s.length || 1);
  $("#kpi_mailto").textContent = fmtPct(mailtoOpened, s.length || 1);

  const devCounts = countBy(s, x => x.deviceCategory || "unknown");
  const slice = activeSliceLabel();
  $("#dataset_meta").textContent = `Filtered N=${s.length} | ` + (devCounts.map(([k,v]) => `${k}=${v}`).join(", ") || "—") + ` | ${slice}`;
}

function renderOverviewAndTables() {
  const s = filteredSessions();
  const ids = s.map(x => x.sessionId);

  const sel = selectionRowsForSessions(ids);
  const top1 = sel.filter(r => r.rank === 1);
  const top1Counts = countBy(top1, r => r.imageId);
  renderBars("#top1_bars", top1Counts, "", 10);

  const top3Counts = countBy(sel, r => r.imageId);
  renderBars("#top3_bars", top3Counts, "", 10);

  // time histogram
  const times = s.map(x => Number(x.timeSec)).filter(Number.isFinite);
  renderHistogram("#time_hist", times, 10);

  // Outliers (top 10 longest)
  const out = s.slice().sort((a,b)=>Number(b.timeSec||0)-Number(a.timeSec||0)).slice(0,10);
  const tbody = $("#outliers tbody");
  if (tbody) {
    tbody.innerHTML = "";
    for (const r of out) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(r.sessionId)}</td>
        <td>${escapeHtml(r.deviceCategory || "—")}</td>
        <td>${fmtNum(r.timeSec)}</td>
        <td>${fmtNum(r.taps)}</td>
        <td>${fmtNum(r.expands)}</td>
        <td>${fmtNum(r.top3Changes)}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  // Selection panel duplicates
  renderBars("#top1_bars_sel", top1Counts, "", 10);
  renderBars("#top3_bars_sel", top3Counts, "", 10);

  // Submission attempts
  const attemptsCounts = countBy(s, x => String(x.submitAttempts ?? "null"));
  const attemptRows = attemptsCounts.map(([k,v]) => [k === "null" ? "null" : k, v]);
  renderBars("#attempts_bars", attemptRows, "", 10);

  // Exposure fairness KPIs (on filtered dataset)
  const expRows = exposuresRowsForSessions(ids);
  const totals = new Map();
  for (const r of expRows) totals.set(r.imageId, (totals.get(r.imageId) || 0) + r.exposureCount);

  const vals = [];
  for (let i=1;i<=25;i++) vals.push(totals.get(String(i)) || 0);

  const cvv = cv(vals);
  const gin = gini(vals);
  $("#fairness_cv").textContent = cvv == null ? "—" : cvv.toFixed(3);
  $("#fairness_gini").textContent = gin.toFixed(3);

  // DQ summary + table
  const dqFiltered = state.dq.filter(d => ids.includes(d.sessionId));
  const totalIssues = dqFiltered.reduce((s, d) => s + d.issues.length, 0);
  const bad = dqFiltered.reduce((s, d) => s + d.issues.filter(i => i.severity === "bad").length, 0);
  const warn = dqFiltered.reduce((s, d) => s + d.issues.filter(i => i.severity === "warn").length, 0);
  $("#dq_total").textContent = totalIssues;
  $("#dq_bad").textContent = bad;
  $("#dq_warn").textContent = warn;

  const tbody2 = $("#dq_table tbody");
  if (tbody2) {
    tbody2.innerHTML = "";
    for (const d of dqFiltered) {
      for (const i of d.issues) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(d.sessionId)}</td>
          <td>${escapeHtml(i.code)}</td>
          <td><span class="pill ${i.severity}">${i.severity}</span></td>
        `;
        tbody2.appendChild(tr);
      }
    }
    if (!totalIssues) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="3" class="hint">No data quality issues detected in the filtered dataset.</td>`;
      tbody2.appendChild(tr);
    }
  }
}

// -------------------------------
// Exports
// -------------------------------
function exportAggregatesCSV() {
  const s = filteredSessions();
  const ids = s.map(x => x.sessionId);
  const sel = selectionRowsForSessions(ids);

  const top1 = sel.filter(r => r.rank === 1);
  const top1Counts = countBy(top1, r => r.imageId);
  const top3Counts = countBy(sel, r => r.imageId);

  let csv = "metric,imageId,value\n";
  for (const [img, v] of top1Counts) csv += `top1_wins,${img},${v}\n`;
  for (const [img, v] of top3Counts) csv += `top3_appearances,${img},${v}\n`;

  downloadText("bct_dashboard_aggregates.csv", csv);
}

function exportCleanedSessionsJSONL() {
  // export filtered normalized sessions (PII removed)
  const s = filteredSessions();
  const jsonl = s.map(x => JSON.stringify(x)).join("\n");
  downloadText("bct_dashboard_sessions_clean.jsonl", jsonl);
}

function exportAnomaliesCSV() {
  // compile: ingest anomalies + build anomalies + DQ issues (flat)
  const rows = [];

  // ingest/build anomalies
  for (const a of state.anomalies) {
    rows.push({
      sessionId: a.sessionId || "?",
      code: a.code || "",
      issue: a.issue || "",
      severity: a.severity || "",
      source: a.source || "",
      filename: a.filename || ""
    });
  }

  // DQ issues
  for (const d of state.dq) {
    for (const i of d.issues || []) {
      rows.push({
        sessionId: d.sessionId || "?",
        code: i.code,
        issue: `DQ: ${i.code}`,
        severity: i.severity,
        source: d.source || "",
        filename: d.filename || ""
      });
    }
  }

  // import anomalies persisted (if any)
  const persisted = loadImportAnomalies();
  for (const a of persisted) {
    rows.push({
      sessionId: a.sessionId || "?",
      code: a.code || "",
      issue: a.issue || "",
      severity: a.severity || "",
      source: a.source || "",
      filename: a.filename || ""
    });
  }

  // dedup identical rows
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = [r.sessionId,r.code,r.issue,r.severity,r.source,r.filename].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }

  // CSV
  const esc = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) return "\"" + s.replaceAll("\"", "\"\"") + "\"";
    return s;
  };

  let csv = "sessionId,code,issue,severity,source,filename\n";
  for (const r of out) csv += `${esc(r.sessionId)},${esc(r.code)},${esc(r.issue)},${esc(r.severity)},${esc(r.source)},${esc(r.filename)}\n`;

  downloadText("bct_dashboard_anomalies.csv", csv);
}

// -------------------------------
// Storage: extras + import anomalies
// -------------------------------
function loadExtrasFromStorage() {
  try {
    const s = localStorage.getItem(STORAGE_KEY_EXTRA);
    if (!s) return [];
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) return [];

    // support both formats:
    // - v1: [rawObj, rawObj, ...]
    // - v2: [{data:{...}, meta:{...}}, ...]
    const out = [];
    for (const it of arr) {
      if (it && typeof it === "object" && "data" in it && it.data) out.push(it);
      else if (it && typeof it === "object") out.push({ data: it, meta: { source: "added", filename: "" } });
    }
    return out;
  } catch {
    return [];
  }
}

function saveExtrasToStorage(extraEntries) {
  localStorage.setItem(STORAGE_KEY_EXTRA, JSON.stringify(extraEntries));
}

function loadImportAnomalies() {
  try {
    const s = localStorage.getItem(STORAGE_KEY_IMPORT_ANOMS);
    if (!s) return [];
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function appendImportAnomalies(rows) {
  try {
    const cur = loadImportAnomalies();
    const next = cur.concat(rows || []).slice(-2000); // cap
    localStorage.setItem(STORAGE_KEY_IMPORT_ANOMS, JSON.stringify(next));
  } catch { /* ignore */ }
}


// -------------------------------
// Filter presets (Release 6)
// -------------------------------
function loadPresets() {
  try {
    const s = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (!s) return [];
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(p => p && typeof p.name === "string" && p.name.trim())
      .map(p => ({ name: p.name.trim(), filters: sanitizeFilters(p.filters || {}) }));
  } catch { return []; }
}

function savePresets(list) {
  try {
    const next = Array.isArray(list) ? list.slice(0, 200) : [];
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(next));
  } catch { /* ignore */ }
}

function sanitizeFilters(f) {
  const out = {
    device: typeof f.device === "string" ? f.device : "all",
    method: typeof f.method === "string" ? f.method : "all",
    version: typeof f.version === "string" ? f.version : "all",
    dateStart: typeof f.dateStart === "string" ? f.dateStart : "",
    dateEnd: typeof f.dateEnd === "string" ? f.dateEnd : ""
  };
  return out;
}

// -------------------------------
// Imports: TXT + ZIP
// -------------------------------
async function importMoreTxtFiles(fileList) {
  const files = Array.from(fileList || []).filter(f => f.name.toLowerCase().endsWith(".txt"));
  if (!files.length) return;

  const extras = loadExtrasFromStorage();
  let added = 0;
  const anoms = [];

  for (const f of files) {
    const txt = await f.text();
    const jsonText = extractJsonBlock(txt);
    const obj = safeJsonParse(jsonText);
    if (!obj) {
      const row = { sessionId:"?", code:"txt_json_parse_failed", issue:`JSON parse failed for imported file ${f.name}`, severity:"warn", source:"added", filename:f.name };
      state.anomalies.push(row);
      anoms.push(row);
      continue;
    }
    extras.push({ data: obj, meta: { source: "added", filename: f.name } });
    added++;
  }

  appendImportAnomalies(anoms);
  saveExtrasToStorage(dedupExtras(extras));
  setStatus(`Imported ${added} TXT file(s).`);
  await rebuildAll();
}

function dedupExtras(extras) {
  // prefer latest submittedAt by sessionId
  const byId = new Map();
  const keep = [];
  for (const ent of extras) {
    const { obj, meta } = unwrapEntry(ent);
    const sid = obj?.metrics?.sessionId;
    if (!sid) { keep.push(ent); continue; }
    const ex = byId.get(sid);
    if (!ex) byId.set(sid, ent);
    else {
      const a = isoDateKey(ex.data?.submittedAt) || isoDateKey(ex.data?.startedAt) || "";
      const b = isoDateKey(obj?.submittedAt) || isoDateKey(obj?.startedAt) || "";
      if (b && (!a || b > a)) byId.set(sid, ent);
    }
  }
  return Array.from(byId.values()).concat(keep.filter(ent => {
    const { obj } = unwrapEntry(ent);
    return !obj?.metrics?.sessionId;
  }));
}

async function clearExtras() {
  localStorage.removeItem(STORAGE_KEY_EXTRA);
  localStorage.removeItem(STORAGE_KEY_IMPORT_ANOMS);
  setStatus("Cleared locally added sessions.");
  await rebuildAll();
}

// Minimal ZIP reader (store + deflate) using native DecompressionStream where available.
// This avoids bundling JSZip while keeping the app fully static and offline-friendly.

async function tryInflate(compBytes, algo) {
  if (typeof DecompressionStream === "undefined") throw new Error("DecompressionStream not supported in this browser");
  const ds = new DecompressionStream(algo);
  const stream = new Response(compBytes).body.pipeThrough(ds);
  const ab = await new Response(stream).arrayBuffer();
  return new Uint8Array(ab);
}

async function importZipFile(file) {
  if (!file) return;
  const name = file.name || "import.zip";
  const bytes = new Uint8Array(await file.arrayBuffer());

  const entries = [];
  const anoms = [];

  try {
    const files = await unzipList(bytes);
    const txtMembers = files.filter(f => f.name.toLowerCase().endsWith(".txt"));

    if (!txtMembers.length) {
      const row = { sessionId:"?", code:"zip_no_txt", issue:`ZIP contains no .txt files (${name})`, severity:"warn", source:"added", filename:name };
      state.anomalies.push(row); anoms.push(row);
      appendImportAnomalies(anoms);
      return;
    }

    for (const mem of txtMembers) {
      try {
        const txt = await mem.text();
        const jsonText = extractJsonBlock(txt);
        const obj = safeJsonParse(jsonText);
        if (!obj) {
          const row = { sessionId:"?", code:"zip_member_json_parse_failed", issue:`JSON parse failed for ZIP member ${mem.name}`, severity:"warn", source:"added", filename:mem.name };
          state.anomalies.push(row); anoms.push(row);
          continue;
        }
        entries.push({ data: obj, meta: { source: "added", filename: mem.name } });
      } catch (e) {
        const row = { sessionId:"?", code:"zip_member_read_failed", issue:`Failed to read ZIP member ${mem.name}`, severity:"warn", source:"added", filename:mem.name };
        state.anomalies.push(row); anoms.push(row);
      }
    }
  } catch (e) {
    const row = { sessionId:"?", code:"zip_parse_failed", issue:`Failed to parse ZIP (${name}). ${String(e?.message || e)}`, severity:"bad", source:"added", filename:name };
    state.anomalies.push(row); anoms.push(row);
  }

  appendImportAnomalies(anoms);

  if (entries.length) {
    const extras = dedupExtras(loadExtrasFromStorage().concat(entries));
    saveExtrasToStorage(extras);
    setStatus(`Imported ${entries.length} session(s) from ZIP.`);
    await rebuildAll();
  } else {
    setStatus("ZIP import completed with no valid sessions.");
    await rebuildAll();
  }
}

async function importZipFiles(fileList) {
  const files = Array.from(fileList || []).filter(f => (f.name || "").toLowerCase().endsWith(".zip"));
  if (!files.length) return;
  // process sequentially for predictable status
  for (const f of files) await importZipFile(f);
}

// -------------------------------
// ZIP implementation
// -------------------------------
function u32(b, o){ return (b[o] | (b[o+1]<<8) | (b[o+2]<<16) | (b[o+3]<<24)) >>> 0; }
function u16(b, o){ return b[o] | (b[o+1]<<8); }

async function unzipList(bytes) {
  // Find End of Central Directory (EOCD)
  const maxBack = Math.min(bytes.length, 65557);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= bytes.length - maxBack; i--) {
    if (i < 0) break;
    if (bytes[i] === 0x50 && bytes[i+1] === 0x4b && bytes[i+2] === 0x05 && bytes[i+3] === 0x06) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("EOCD not found");

  const cdCount = u16(bytes, eocd + 10);
  const cdSize  = u32(bytes, eocd + 12);
  const cdOff   = u32(bytes, eocd + 16);

  let p = cdOff;
  const out = [];
  for (let i=0; i<cdCount; i++) {
    if (u32(bytes, p) !== 0x02014b50) throw new Error("Central directory signature missing");
    const method = u16(bytes, p + 10);
    const compSize = u32(bytes, p + 20);
    const uncompSize = u32(bytes, p + 24);
    const nameLen = u16(bytes, p + 28);
    const extraLen = u16(bytes, p + 30);
    const commentLen = u16(bytes, p + 32);
    const lfhOff = u32(bytes, p + 42);

    const nameBytes = bytes.slice(p + 46, p + 46 + nameLen);
    const name = new TextDecoder("utf-8").decode(nameBytes);

    const isDir = name.endsWith("/");
    if (!isDir) {
      out.push({
        name,
        method,
        compSize,
        uncompSize,
        lfhOff,
        async bytes() { return extractZipFile(bytes, { method, compSize, uncompSize, lfhOff, nameLen }); },
        async text() {
          const b = await this.bytes();
          return new TextDecoder("utf-8").decode(b);
        }
      });
    }

    p += 46 + nameLen + extraLen + commentLen;
    if (p > cdOff + cdSize + 64) break;
  }
  return out;
}

async function extractZipFile(all, info) {
  const { lfhOff, nameLen } = info;

  if (u32(all, lfhOff) !== 0x04034b50) throw new Error("LFH signature missing");
  const method = u16(all, lfhOff + 8);
  const compSize = u32(all, lfhOff + 18);
  const uncompSize = u32(all, lfhOff + 22);
  const extraLen = u16(all, lfhOff + 28);

  const dataOff = lfhOff + 30 + nameLen + extraLen;
  const comp = all.slice(dataOff, dataOff + compSize);

  if (method === 0) return comp; // store

  if (method === 8) {
    if (typeof DecompressionStream === "undefined") throw new Error("DecompressionStream not supported in this browser");
    const ds = new DecompressionStream("deflate-raw");
    const stream = new Response(comp).body.pipeThrough(ds);
    const ab = await new Response(stream).arrayBuffer();
    const out = new Uint8Array(ab);
    return uncompSize ? out.slice(0, uncompSize) : out;
  }

  throw new Error(`Unsupported ZIP compression method: ${method}`);
}

// -------------------------------
// Filters UI wiring
// -------------------------------
function wireDropdown({ ddSel, btnSel, menuSel, setFn, labelFn }) {
  const btn = $(btnSel);
  const menu = $(menuSel);
  if (!btn || !menu) return;

  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  const toggle = () => {
    const open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
  };

  btn.addEventListener("click", (e) => { e.preventDefault(); toggle(); });

  menu.addEventListener("click", (e) => {
    const it = e.target.closest("button[data-value]");
    if (!it) return;
    setFn(it.getAttribute("data-value"));
    close();
  });

  document.addEventListener("click", (e) => {
    const within = e.target.closest(ddSel);
    if (!within) close();
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // initial label
  if (labelFn) btn.innerHTML = `${labelFn(state.filters[ddSel.replace("#","").split("_")[0]] || "all")} <span class="caret">▾</span>`;
}

function setDeviceFilter(value) {
  state.filters.device = value || "all";
  const btn = $("#device_btn");
  const label = value === "all" ? "Device: All"
              : value === "mobile" ? "Device: Mobile"
              : value === "desktop" ? "Device: Desktop"
              : "Device: Unknown";
  if (btn) btn.innerHTML = `${label} <span class="caret">▾</span>`;
  rerenderAll();
}

function setMethodFilter(value) {
  state.filters.method = value || "all";
  const btn = $("#method_btn");
  const label = value === "all" ? "Method: All" : `Method: ${value}`;
  if (btn) btn.innerHTML = `${escapeHtml(label)} <span class="caret">▾</span>`;
  rerenderAll();
}

function setVersionFilter(value) {
  state.filters.version = value || "all";
  const btn = $("#version_btn");
  const label = value === "all" ? "Version: All" : `Version: ${value}`;
  if (btn) btn.innerHTML = `${escapeHtml(label)} <span class="caret">▾</span>`;
  rerenderAll();
}

function populateMethodVersionMenus() {
  const methods = Array.from(new Set(state.sessions.map(s => s.method || "unknown"))).sort();
  const versions = Array.from(new Set(state.sessions.map(s => s.version || "unknown"))).sort();
  state.meta.methods = methods;
  state.meta.versions = versions;

  const buildMenu = (menuSel, items, prefix) => {
    const menu = $(menuSel);
    if (!menu) return;
    menu.innerHTML = `<button class="item" type="button" data-value="all">${prefix}: All</button>`;
    for (const v of items) {
      const b = document.createElement("button");
      b.className = "item";
      b.type = "button";
      b.setAttribute("data-value", v);
      b.textContent = `${prefix}: ${v}`;
      menu.appendChild(b);
    }
  };

  buildMenu("#method_menu", methods, "Method");
  buildMenu("#version_menu", versions, "Version");

  populateCompareSelects();
  refreshPresetMenu();

  // refresh labels (in case current filter isn't present)
  setMethodFilter(state.filters.method || "all");
  setVersionFilter(state.filters.version || "all");
}


function populateCompareSelects() {
  const methods = state.meta.methods || [];
  const versions = state.meta.versions || [];
  const fill = (sel, values, label) => {
    const el = $(sel);
    if (!el) return;
    const cur = el.value || "all";
    el.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "all";
    optAll.textContent = `${label}: All`;
    el.appendChild(optAll);
    for (const v of values) {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      el.appendChild(o);
    }
    // keep current if possible
    el.value = values.includes(cur) ? cur : "all";
  };
  fill("#cmpA_method", methods, "Method");
  fill("#cmpB_method", methods, "Method");
  fill("#cmpA_version", versions, "Version");
  fill("#cmpB_version", versions, "Version");
}

function refreshPresetMenu() {
  state.presets.list = loadPresets();
  const menu = $("#preset_menu");
  if (!menu) return;
  menu.innerHTML = `<button class="item" type="button" data-value="__none__">Preset: None</button>`;
  for (const p of state.presets.list) {
    const b = document.createElement("button");
    b.className = "item";
    b.type = "button";
    b.setAttribute("data-value", p.name);
    b.textContent = `Preset: ${p.name}`;
    menu.appendChild(b);
  }
  // reconcile selected
  const has = state.presets.list.some(p => p.name === state.presets.selected);
  if (!has) state.presets.selected = "__none__";
  updatePresetLabelAndButtons();
}

function updatePresetLabelAndButtons() {
  const btn = $("#preset_btn");
  if (btn) {
    const name = state.presets.selected === "__none__" ? "None" : state.presets.selected;
    btn.innerHTML = `Preset: ${escapeHtml(name)} <span class="caret">▾</span>`;
  }
  const del = $("#btn_preset_delete");
  if (del) del.disabled = (state.presets.selected === "__none__");
}

// -------------------------------
// Rebuild + render
// -------------------------------
async function loadSeedEntries() {
  setStatus("Loading seed dataset…");
  setStatusDetail("—");

  const res = await fetch("data/manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data/manifest.json");

  const manifest = await res.json();
  if (!Array.isArray(manifest.sessions)) throw new Error("Manifest missing sessions[]");

  const total = manifest.sessions.length;
  state.ingest.seedTotal = total;
  state.ingest.seedParsed = 0;
  state.ingest.seedFailed = 0;

  setStatusDetail(`0/${total}`);

  const entries = [];
  let parsed = 0, failed = 0;

  for (let i = 0; i < total; i++) {
    const path = manifest.sessions[i];
    setStatus("Loading seed dataset…");
    setStatusDetail(`${i + 1}/${total}`);

    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) {
      failed++;
      state.anomalies.push({ sessionId:"?", code:"seed_fetch_failed", issue:`Failed to fetch ${path}`, severity:"bad", source:"seed", filename:path });
      continue;
    }
    const txt = await r.text();
    const jsonText = extractJsonBlock(txt);
    const obj = safeJsonParse(jsonText);
    if (!obj) {
      failed++;
      state.anomalies.push({ sessionId:"?", code:"seed_json_parse_failed", issue:`JSON parse failed for ${path}`, severity:"bad", source:"seed", filename:path });
      continue;
    }
    entries.push({ data: obj, meta: { source: "seed", filename: path } });
    parsed++;
  }

  state.ingest.seedParsed = parsed;
  state.ingest.seedFailed = failed;

  return entries;
}

async function rebuildAll() {
  state.anomalies = []; // reset per run (persisted import anomalies stay separate)
  const seedEntries = await loadSeedEntries();
  const extras = loadExtrasFromStorage();

  state.ingest.addedTotal = extras.length;
  state.ingest.addedParsed = extras.length;
  state.ingest.addedFailed = loadImportAnomalies().length;

  setStatus("Building dataset…");
  setStatusDetail("—");

  const built = buildDataset(seedEntries.concat(extras));

  state.sessions = built.sessions;
  state.selections = built.selections;
  state.exposures = built.exposures;
  state.opens = built.opens;
  state.dq = built.dq;

  // include build-level anomalies
  state.anomalies.push(...built.anomalies);

  // populate dynamic filter menus
  populateMethodVersionMenus();

  setStatus("Ready.");
  setStatusDetail(`${state.sessions.length} sessions`);

  rerenderAll();
}

function rerenderAll() {
  renderKPIs();
  renderDatasetSummary();
  renderOverviewAndTables();
  renderRankHeatmap();
  renderExposureChartsAndScatter();
  renderCompare();
  renderAnomaliesPanel();
  renderActiveTab();

  // Add/update PII-safe tooltips after deterministic renders.
  try {
    if (window.applyTooltips) window.applyTooltips(document);
  } catch (_) {}
}


function sliceSessionsByFilters(f) {
  const filters = sanitizeFilters(f || {});
  const start = filters.dateStart ? new Date(filters.dateStart + "T00:00:00") : null;
  const end = filters.dateEnd ? new Date(filters.dateEnd + "T23:59:59") : null;

  return state.sessions.filter(s => {
    if (filters.device !== "all" && (s.device || "unknown") !== filters.device) return false;
    if (filters.method !== "all" && (s.method || "unknown") !== filters.method) return false;
    if (filters.version !== "all" && (s.version || "unknown") !== filters.version) return false;

    if (start || end) {
      const d = s.submittedAt || s.startedAt || "";
      const dt = d ? new Date(d) : null;
      if (!dt || Number.isNaN(dt.getTime())) return false;
      if (start && dt < start) return false;
      if (end && dt > end) return false;
    }
    return true;
  });
}

function computeKpis(sessions) {
  const n = sessions.length;
  const ids = new Set(sessions.map(s => s.sessionId));
  const selections = state.selections.filter(r => ids.has(r.sessionId));
  const opens = state.opens.filter(r => ids.has(r.sessionId));
  const exposures = state.exposures.filter(r => ids.has(r.sessionId));

  const completed = sessions.filter(s => (s.submittedAt || "").trim()).length;
  const completionRate = n ? completed / n : 0;

  const durations = sessions.map(s => Number(s.durationMs || 0)).filter(x => x > 0).sort((a,b)=>a-b);
  const medianMs = durations.length ? durations[Math.floor(durations.length/2)] : 0;

  const fullResUsers = new Set(opens.filter(o => (o.type || "") === "full").map(o => o.sessionId)).size;
  const fullResRate = n ? fullResUsers / n : 0;

  const mailto = sessions.filter(s => (s.submitMethod || "") === "mailto").length;
  const mailtoRate = n ? mailto / n : 0;

  const expTotal = exposures.reduce((sum,r)=>sum + (Number(r.exposureCount)||0), 0);
  const openTotal = opens.filter(o => (o.type || "") === "full").length;

  return {
    sessions: n,
    completionRate,
    medianMs,
    fullResUsers,
    fullResRate,
    mailto,
    mailtoRate,
    expTotal,
    openTotal
  };
}

function fmtMs(ms){
  const s = Math.round(ms/1000);
  if (!s) return "—";
  const m = Math.floor(s/60), r = s%60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r}s`;
}

function renderKpiGrid(elSel, k) {
  const el = $(elSel);
  if (!el) return;
  const cells = [
    ["Sessions", String(k.sessions)],
    ["Completion rate", fmtPct(k.completionRate)],
    ["Median duration", fmtMs(k.medianMs)],
    ["Full‑res users", `${k.fullResUsers} (${fmtPct(k.fullResRate)})`],
    ["Mailto submits", `${k.mailto} (${fmtPct(k.mailtoRate)})`],
    ["Exposure total", String(k.expTotal)],
    ["Full‑res opens", String(k.openTotal)]
  ];
  el.innerHTML = cells.map(([a,b]) => `<div class="kpiCell"><b>${escapeHtml(a)}</b><span>${escapeHtml(b)}</span></div>`).join("");
}

function renderDeltaGrid(elSel, a, b) {
  const el = $(elSel);
  if (!el) return;
  const rows = [
    ["Sessions", b.sessions - a.sessions],
    ["Completion rate", b.completionRate - a.completionRate],
    ["Median duration (ms)", b.medianMs - a.medianMs],
    ["Full‑res users", b.fullResUsers - a.fullResUsers],
    ["Mailto submits", b.mailto - a.mailto],
    ["Exposure total", b.expTotal - a.expTotal],
    ["Full‑res opens", b.openTotal - a.openTotal]
  ];
  el.innerHTML = rows.map(([label, dv]) => {
    const isPct = label.includes("rate");
    const text = isPct ? fmtPct(dv) : (label.includes("(ms)") ? fmtMs(Math.abs(dv)) : String(dv));
    const cls = dv > 0 ? "deltaUp" : (dv < 0 ? "deltaDown" : "");
    const sign = dv > 0 ? "+" : "";
    const val = label.includes("(ms)") ? `${sign}${dv>=0?text:`-${text}`}` : `${sign}${text}`;
    return `<div class="kpiCell"><b>${escapeHtml(label)}</b><span class="${cls}">${escapeHtml(val)}</span></div>`;
  }).join("");
}

function renderCompare() {
  // Only render if panel exists (Release 6)
  if (!$("#panel_compare")) return;

  const aSessions = sliceSessionsByFilters(state.compare.A);
  const bSessions = sliceSessionsByFilters(state.compare.B);
  const a = computeKpis(aSessions);
  const b = computeKpis(bSessions);

  renderKpiGrid("#cmpA_kpis", a);
  renderKpiGrid("#cmpB_kpis", b);
  renderDeltaGrid("#cmp_delta", a, b);
}

function collectAllAnomalies() {
  // built anomalies + import anomalies (persisted) + dq issues
  const out = [];
  const add = (x) => { if (x && typeof x === "object") out.push(x); };

  // built anomalies (seed and parse/build)
  for (const a of (state.anomalies || [])) add(a);

  // import anomalies
  for (const a of loadImportAnomalies()) add(a);

  // dq issues (one row per rule so the "code" column is actionable)
  for (const d of (state.dq || [])) {
    const sid = d.sessionId || "";
    const source = d.source || "seed";
    const filename = d.filename || "";
    const ts = d.ts || "";
    const issues = Array.isArray(d.issues) ? d.issues : [];
    for (const it of issues) {
      add({
        kind: "dq",
        sessionId: sid,
        code: it?.code || "dq_issue",
        severity: it?.severity || "warn",
        source,
        filename,
        issue: `DQ: ${it?.code || "dq_issue"}`,
        ts
      });
    }
  }

  return out;
}

function renderAnomaliesPanel() {
  if (!$("#panel_anoms")) return;

  const sev = ($("#anom_severity")?.value || "all").toLowerCase();
  const src = ($("#anom_source")?.value || "all").toLowerCase();
  const q = ($("#anom_search")?.value || "").trim().toLowerCase();

  const rows = collectAllAnomalies().map(a => ({
    kind: a.kind || (a.source ? "ingest" : "unknown"),
    sessionId: a.sessionId || "",
    code: a.code || a.type || "unknown",
    severity: (a.severity || "info").toLowerCase(),
    source: (a.source || "seed").toLowerCase(),
    filename: a.filename || "",
    issue: a.issue || a.message || "",
    ts: a.ts || ""
  })).filter(r => {
    if (sev !== "all" && r.severity !== sev) return false;
    if (src !== "all" && r.source !== src && r.kind !== src) return false;
    if (q) {
      const hay = `${r.kind} ${r.sessionId} ${r.code} ${r.source} ${r.filename} ${r.issue}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const tbody = $("#anom_table tbody");
  if (!tbody) return;
  const sevTitle = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "bad") return "bad: likely corrupted/structurally invalid; can materially skew KPIs";
    if (v === "warn") return "warn: usable but incomplete/inconsistent; may undercount or affect breakdowns";
    return "info: informational";
  };

  const limited = rows.slice(0, 1000);
  tbody.innerHTML = limited.map(r => `
    <tr>
      <td>${escapeHtml(r.kind)}</td>
      <td>${r.sessionId ? linkSessionId(r.sessionId) : ""}</td>
      <td title="Rule/anomaly code">${escapeHtml(r.code)}</td>
      <td><span class="pill ${r.severity==='bad'?'bad':(r.severity==='warn'?'warn':'')}" title="${escapeHtml(sevTitle(r.severity))}">${escapeHtml(r.severity)}</span></td>
      <td>${escapeHtml(r.source)}</td>
      <td>${escapeHtml(r.filename)}</td>
      <td>${escapeHtml(r.issue)}</td>
      <td>${escapeHtml(r.ts)}</td>
    </tr>
  `).join("");
  if (!limited.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="hint">No anomalies detected for the current dataset / filters.</td></tr>`;
  }

}

function renderActiveTab() {
  document.querySelectorAll("[data-panel]").forEach(p => p.style.display = "none");
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  // If tab key is invalid (e.g., missing data-tab), fall back to overview
  let tab = $(`#tab_${state.activeTab}`);
  let panel = $(`#panel_${state.activeTab}`);
  if (!panel) {
    state.activeTab = "overview";
    tab = $(`#tab_${state.activeTab}`);
    panel = $(`#panel_${state.activeTab}`);
  }
  if (tab) tab.classList.add("active");
  if (panel) panel.style.display = "";
}

// -------------------------------
// Init + events
// -------------------------------
async function init() {
  // Theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.dataset.theme = savedTheme;
  updateThemeButton();

  // Tabs
  document.querySelectorAll(".tab").forEach(t => {
    // Backward/forward compatible:
    // - Older builds used data-tab on each tab
    // - Some builds rely on id="tab_*" only
    const derived = (t.getAttribute("data-tab") || "").trim() || String(t.id || "").replace(/^tab_/, "");
    if (derived) t.setAttribute("data-tab", derived);
    t.addEventListener("click", () => {
      state.activeTab = derived || "overview";
      // Collapse dataset summary on non-Overview tabs to make the section change obvious
      setDatasetSummaryCollapsed(state.activeTab !== "overview");
      renderActiveTab();
      // Bring the newly activated panel into view
      setTimeout(() => scrollToActivePanel(state.activeTab), 0);
    });
  });

  // Dataset summary collapse/expand
  const dsBtn = $("#dataset_summary_toggle");
  dsBtn?.addEventListener("click", () => {
    setDatasetSummaryCollapsed(!state.summaryCollapsed);
  });
  // Default state: expanded on Overview
  setDatasetSummaryCollapsed(false);

  // Device dropdown
  const deviceBtn = $("#device_btn");
  const deviceMenu = $("#device_menu");
  function closeDeviceMenu(){ if (!deviceMenu || !deviceBtn) return; deviceMenu.hidden = true; deviceBtn.setAttribute("aria-expanded","false"); }
  function toggleDeviceMenu(){ if (!deviceMenu || !deviceBtn) return; const open = !deviceMenu.hidden; deviceMenu.hidden = open; deviceBtn.setAttribute("aria-expanded", String(!open)); }
  deviceBtn?.addEventListener("click", (e) => { e.preventDefault(); toggleDeviceMenu(); });
  deviceMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]"); if (!btn) return;
    setDeviceFilter(btn.getAttribute("data-value")); closeDeviceMenu();
  });
  document.addEventListener("click", (e) => { const within = e.target.closest("#device_dd"); if (!within) closeDeviceMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDeviceMenu(); });

  // Method dropdown
  const methodBtn = $("#method_btn");
  const methodMenu = $("#method_menu");
  function closeMethodMenu(){ if (!methodMenu || !methodBtn) return; methodMenu.hidden = true; methodBtn.setAttribute("aria-expanded","false"); }
  function toggleMethodMenu(){ if (!methodMenu || !methodBtn) return; const open = !methodMenu.hidden; methodMenu.hidden = open; methodBtn.setAttribute("aria-expanded", String(!open)); }
  methodBtn?.addEventListener("click", (e) => { e.preventDefault(); toggleMethodMenu(); });
  methodMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]"); if (!btn) return;
    setMethodFilter(btn.getAttribute("data-value")); closeMethodMenu();
  });
  document.addEventListener("click", (e) => { const within = e.target.closest("#method_dd"); if (!within) closeMethodMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMethodMenu(); });

  // Version dropdown
  const versionBtn = $("#version_btn");
  const versionMenu = $("#version_menu");
  function closeVersionMenu(){ if (!versionMenu || !versionBtn) return; versionMenu.hidden = true; versionBtn.setAttribute("aria-expanded","false"); }
  function toggleVersionMenu(){ if (!versionMenu || !versionBtn) return; const open = !versionMenu.hidden; versionMenu.hidden = open; versionBtn.setAttribute("aria-expanded", String(!open)); }
  versionBtn?.addEventListener("click", (e) => { e.preventDefault(); toggleVersionMenu(); });
  versionMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]"); if (!btn) return;
    setVersionFilter(btn.getAttribute("data-value")); closeVersionMenu();
  });
  document.addEventListener("click", (e) => { const within = e.target.closest("#version_dd"); if (!within) closeVersionMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVersionMenu(); });

  
  // Presets dropdown (Release 6)
  const presetBtn = $("#preset_btn");
  const presetMenu = $("#preset_menu");
  function closePresetMenu(){ if (!presetMenu || !presetBtn) return; presetMenu.hidden = true; presetBtn.setAttribute("aria-expanded","false"); }
  function togglePresetMenu(){ if (!presetMenu || !presetBtn) return; const open = !presetMenu.hidden; presetMenu.hidden = open; presetBtn.setAttribute("aria-expanded", String(!open)); }
  presetBtn?.addEventListener("click", (e) => { e.preventDefault(); togglePresetMenu(); });
  presetMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]"); if (!btn) return;
    const name = btn.getAttribute("data-value") || "__none__";
    state.presets.selected = name;
    updatePresetLabelAndButtons();
    closePresetMenu();
    if (name === "__none__") return;
    const p = state.presets.list.find(x => x.name === name);
    if (!p) return;
    state.filters = sanitizeFilters(p.filters);
    // keep device dropdown label update too
    setDeviceFilter(state.filters.device || "all");
    setMethodFilter(state.filters.method || "all");
    setVersionFilter(state.filters.version || "all");
    $("#date_start") && ($("#date_start").value = state.filters.dateStart || "");
    $("#date_end") && ($("#date_end").value = state.filters.dateEnd || "");
    rerenderAll();
  });
  document.addEventListener("click", (e) => { const within = e.target.closest("#preset_dd"); if (!within) closePresetMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePresetMenu(); });

  $("#btn_preset_save")?.addEventListener("click", () => {
    const nameRaw = prompt("Preset name (PII-safe). Example: Mobile v5.0 Jan 2026", "");
    const name = (nameRaw || "").trim();
    if (!name) return;
    const list = loadPresets();
    const existing = list.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    const entry = { name, filters: sanitizeFilters(state.filters) };
    if (existing >= 0) list[existing] = entry; else list.unshift(entry);
    savePresets(list);
    state.presets.selected = name;
    refreshPresetMenu();
  });

  $("#btn_preset_delete")?.addEventListener("click", () => {
    if (state.presets.selected === "__none__") return;
    const ok = confirm(`Delete preset "${state.presets.selected}"?`);
    if (!ok) return;
    const next = loadPresets().filter(p => p.name !== state.presets.selected);
    savePresets(next);
    state.presets.selected = "__none__";
    refreshPresetMenu();
  });


// Date range filters
  $("#date_start")?.addEventListener("change", (e) => {
    state.filters.dateStart = e.target.value || "";
    rerenderAll();
  });
  $("#date_end")?.addEventListener("change", (e) => {
    state.filters.dateEnd = e.target.value || "";
    rerenderAll();
  });
  $("#btn_clear_filters")?.addEventListener("click", () => {
    state.filters.method = "all";
    state.filters.version = "all";
    state.filters.dateStart = "";
    state.filters.dateEnd = "";
    const ds = $("#date_start"); const de = $("#date_end");
    if (ds) ds.value = "";
    if (de) de.value = "";
    setMethodFilter("all");
    setVersionFilter("all");
    rerenderAll();
  });

  // Heatmap mode toggle
  $("#btn_heatmap_mode")?.addEventListener("click", () => {
    state.heatmapMode = state.heatmapMode === "count" ? "pct" : "count";
    const btn = $("#btn_heatmap_mode");
    if (btn) btn.textContent = state.heatmapMode === "count" ? "Mode: Count" : "Mode: %";
    renderRankHeatmap();
  });

  // Theme toggle
  $("#btn_theme")?.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  // Imports
  $("#import_txt")?.addEventListener("change", async (e) => {
    await importMoreTxtFiles(e.target.files);
    e.target.value = "";
  });

  $("#import_zip")?.addEventListener("change", async (e) => {
    await importZipFiles(e.target.files);
    e.target.value = "";
  });

  $("#btn_clear_extras")?.addEventListener("click", clearExtras);

  // Exports
  $("#btn_export_csv")?.addEventListener("click", exportAggregatesCSV);
  $("#btn_export_jsonl")?.addEventListener("click", exportCleanedSessionsJSONL);
  $("#btn_export_anomalies")?.addEventListener("click", exportAnomaliesCSV);

  // Initialize device label
  setDeviceFilter(state.filters.device || "all");
  setMethodFilter(state.filters.method || "all");
  setVersionFilter(state.filters.version || "all");

  // Build
  try {
    
  // Compare inputs (Release 6)
  const bindCompare = (prefix, target) => {
    const dev = $(`#${prefix}_device`);
    const meth = $(`#${prefix}_method`);
    const ver = $(`#${prefix}_version`);
    const ds = $(`#${prefix}_start`);
    const de = $(`#${prefix}_end`);
    const pull = () => {
      target.device = dev?.value || "all";
      target.method = meth?.value || "all";
      target.version = ver?.value || "all";
      target.dateStart = ds?.value || "";
      target.dateEnd = de?.value || "";
      renderCompare();
    };
    dev?.addEventListener("change", pull);
    meth?.addEventListener("change", pull);
    ver?.addEventListener("change", pull);
    ds?.addEventListener("change", pull);
    de?.addEventListener("change", pull);
  };
  bindCompare("cmpA", state.compare.A);
  bindCompare("cmpB", state.compare.B);

  // Anomaly table filters (Release 6)
  $("#anom_severity")?.addEventListener("change", () => renderAnomaliesPanel());
  $("#anom_source")?.addEventListener("change", () => renderAnomaliesPanel());
  $("#anom_search")?.addEventListener("input", () => renderAnomaliesPanel());

  // Load presets into state and menu on startup
  refreshPresetMenu();


  await rebuildAll();
  } catch (e) {
    setStatus("Failed to load dataset.");
    setStatusDetail(String(e?.message || e));
    console.error(e);
  }
}

init();
function linkImageId(imageId) {
  const n = Number(imageId);
  if (!Number.isFinite(n)) return String(imageId);
  return `<a class="link" href="image.html?imageId=${encodeURIComponent(n)}">#${n}</a>`;
}
function linkSessionId(sessionId) {
  const s = String(sessionId || "");
  if (!s) return "";
  return `<a class="link" href="session.html?sessionId=${encodeURIComponent(s)}">${escapeHtml(s)}</a>`;
}


