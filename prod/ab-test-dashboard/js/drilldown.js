// Drilldown pages for Book Cover Tester — Analytics Dashboard (Release 6)
// PII-safe: never display respondent fields.

const STORAGE_KEY_EXTRA = "bct_dashboard_extra_sessions_v1";
const BUILD_VERSION = "v6.0.5";

const $ = (sel) => document.querySelector(sel);

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

function qsParam(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

function fmtPct(x){
  if (!Number.isFinite(x)) return "—";
  return `${(x*100).toFixed(1)}%`;
}

function fmtMs(ms){
  const s = Math.round((Number(ms) || 0) / 1000);
  if (!s) return "—";
  const m = Math.floor(s/60), r = s%60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r}s`;
}

function extractJsonFromText(text){
  const str = String(text || "");
  // Preferred: explicit markers
  const m = str.match(/---BEGIN_JSON---\s*([\s\S]*?)\s*---END_JSON---/);
  if (m) {
    try { return JSON.parse(m[1]); } catch { /* fallthrough */ }
  }
  // Fallback: first '{' .. last '}' block
  const start = str.indexOf("{");
  const end = str.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(str.slice(start, end + 1)); } catch { return null; }
  }
  return null;
}

function normalizeTop3(results){
  const raw = results?.top3 || results?.topThree || results?.selectedTop3 || [];
  const out = [];
  if (!Array.isArray(raw)) return out;

  for (let i=0;i<raw.length;i++) {
    const v = raw[i];
    if (v && typeof v === "object") {
      const imageId = Number(v.imageId ?? v.id ?? v.value);
      const rank = Number(v.rank ?? (i+1));
      if (Number.isFinite(imageId) && Number.isFinite(rank)) out.push({ imageId, rank });
    } else {
      const imageId = Number(v);
      if (Number.isFinite(imageId)) out.push({ imageId, rank: i+1 });
    }
  }

  return out;
}

function normalizeMapCandidate(candidate){
  // Returns { [imageIdStr]: number }
  const out = {};
  if (!candidate) return out;

  if (Array.isArray(candidate)) {
    for (const row of candidate) {
      const imageId = Number(row?.imageId ?? row?.id);
      const val = Number(row?.count ?? row?.value ?? row?.exposureCount ?? row?.openCount);
      if (Number.isFinite(imageId) && Number.isFinite(val)) out[String(imageId)] = (out[String(imageId)] || 0) + val;
    }
    return out;
  }

  if (typeof candidate === "object") {
    for (const [k,v] of Object.entries(candidate)) {
      const imageId = Number(k);
      const val = Number(v);
      if (Number.isFinite(imageId) && Number.isFinite(val)) out[String(imageId)] = (out[String(imageId)] || 0) + val;
    }
    return out;
  }

  return out;
}

function pickFirst(obj, keys){
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null) return v;
  }
  return null;
}

function normalizeSessionObject(obj, fallbackFilename=""){
  const metrics = obj?.metrics || {};
  const results = obj?.results || {};

  const sessionId = String(metrics.sessionId || fallbackFilename.replace(/\.txt$/i, "") || "");
  const version = String(obj?.version || "unknown");
  const method = String(metrics?.method || "unknown");
  const device = String(metrics?.device?.category || "unknown");
  const startedAt = String(obj?.startedAt || "");
  const submittedAt = String(obj?.submittedAt || "");
  const durationMs = Number(metrics?.timeToCompleteSeconds || 0) * 1000;

  const top3 = normalizeTop3(results);

  const exposureCandidate = pickFirst(results, [
    "thumbnailExposuresByImageId",
    "exposuresByImageId",
    "exposureByImageId",
    "exposures"
  ]) || pickFirst(metrics, ["exposures", "thumbnailExposuresByImageId"]);

  const openCandidate = pickFirst(results, [
    "fullResOpensByImageId",
    "opensByImageId",
    "fullResByImageId",
    "fullResOpens"
  ]) || pickFirst(metrics, ["fullResOpens", "fullResOpensByImageId"]);

  const exposures = normalizeMapCandidate(exposureCandidate);
  const fullResOpens = normalizeMapCandidate(openCandidate);

  const submission = metrics?.submission || {};

  return { sessionId, version, method, device, startedAt, submittedAt, durationMs, top3, exposures, fullResOpens, submission };
}

async function loadSeedManifest(){
  const res = await fetch("data/manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load data/manifest.json (${res.status})`);
  return await res.json();
}

function normalizeManifestPath(p){
  let s = String(p || "").trim();
  if (!s) return null;
  if (s.startsWith("./")) s = s.slice(2);
  if (s.startsWith("/")) s = s.slice(1);
  const lower = s.toLowerCase();
  if (lower.startsWith("data/sessions/")) return s;
  // if manifest mistakenly includes full path to data/... we still accept it
  if (lower.startsWith("data/")) return s;
  return `data/sessions/${s}`;
}

async function loadSeedSessions(){
  const manifest = await loadSeedManifest();
  const files = Array.isArray(manifest?.sessions) ? manifest.sessions : (Array.isArray(manifest?.files) ? manifest.files : []);
  const sessions = [];

  for (const f of files) {
    const path = normalizeManifestPath(f);
    if (!path) continue;
    const url = encodeURI(path);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) continue;
    const text = await res.text();
    const obj = extractJsonFromText(text);
    if (!obj) continue;

    sessions.push(normalizeSessionObject(obj, path.split("/").pop() || ""));
  }

  return sessions;
}

function loadExtrasSessions(){
  // Extras are stored by app.js as array of {data, meta} (or legacy session objects)
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_EXTRA) || "[]");
    if (!Array.isArray(raw)) return [];
    const out = [];
    for (const item of raw) {
      if (item && item.data && item.meta) {
        out.push(normalizeSessionObject(item.data, item.meta?.filename || ""));
      } else if (item && item.metrics) {
        out.push(normalizeSessionObject(item, ""));
      }
    }
    return out;
  } catch {
    return [];
  }
}

async function loadAllSessions(){
  const seed = await loadSeedSessions();
  const extras = loadExtrasSessions();
  return seed.concat(extras);
}

function kpiCell(label, value){
  return `<div class="kpiCell"><b>${escapeHtml(label)}</b><span>${escapeHtml(value)}</span></div>`;
}

function renderImageDrilldown(sessions, imageId){
  const buildEl = $("#dd_build");
  if (buildEl) buildEl.textContent = BUILD_VERSION;
  const imgEl = $("#dd_image");
  if (imgEl) imgEl.textContent = `#${imageId}`;

  const img = String(imageId);

  let r1=0, r2=0, r3=0, top3=0;
  let expTotal=0, openTotal=0;

  const byMethod = new Map();
  const byVersion = new Map();

  for (const s of sessions){
    expTotal += Number(s.exposures?.[img] || 0);
    openTotal += Number(s.fullResOpens?.[img] || 0);

    let saw = false;
    for (const t of (s.top3 || [])) {
      if (String(t.imageId) === img) {
        saw = true;
        top3 += 1;
        if (Number(t.rank) === 1) r1 += 1;
        if (Number(t.rank) === 2) r2 += 1;
        if (Number(t.rank) === 3) r3 += 1;
      }
    }

    if (saw) {
      const m = s.method || "unknown";
      const v = s.version || "unknown";

      const mm = byMethod.get(m) || { top3:0, r1:0 };
      mm.top3 += 1;
      if ((s.top3 || []).some(t => String(t.imageId)===img && Number(t.rank)===1)) mm.r1 += 1;
      byMethod.set(m, mm);

      const vv = byVersion.get(v) || { top3:0, r1:0 };
      vv.top3 += 1;
      if ((s.top3 || []).some(t => String(t.imageId)===img && Number(t.rank)===1)) vv.r1 += 1;
      byVersion.set(v, vv);
    }
  }

  const selKpis = [
    kpiCell("Top 3 appearances", String(top3)),
    kpiCell("Rank 1", String(r1)),
    kpiCell("Rank 2", String(r2)),
    kpiCell("Rank 3", String(r3)),
  ].join("");
  const selEl = $("#dd_sel_kpis");
  if (selEl) selEl.innerHTML = selKpis;

  const expKpis = [
    kpiCell("Exposure total", String(expTotal)),
    kpiCell("Full-res opens", String(openTotal)),
    kpiCell("Top3 per exposure", expTotal ? fmtPct(top3/expTotal) : "—"),
    kpiCell("Opens per exposure", expTotal ? fmtPct(openTotal/expTotal) : "—"),
  ].join("");
  const expEl = $("#dd_exp_kpis");
  if (expEl) expEl.innerHTML = expKpis;

  const writeTable = (tblSel, map) => {
    const tbody = document.querySelector(`${tblSel} tbody`);
    if (!tbody) return;
    const arr = Array.from(map.entries()).sort((a,b)=>b[1].top3-a[1].top3);
    tbody.innerHTML = arr.map(([k,v]) => `
      <tr>
        <td>${escapeHtml(k)}</td>
        <td>${escapeHtml(v.top3)}</td>
        <td>${escapeHtml(v.r1)}</td>
      </tr>
    `).join("");
  };
  writeTable("#dd_by_method", byMethod);
  writeTable("#dd_by_version", byVersion);
}

function renderSessionDrilldown(session){
  const buildEl = $("#sd_build");
  if (buildEl) buildEl.textContent = BUILD_VERSION;
  const sEl = $("#sd_session");
  if (sEl) sEl.textContent = session.sessionId;

  const submitted = (session.submittedAt || "").trim();
  const started = (session.startedAt || "").trim();

  const fullResTotal = Object.values(session.fullResOpens || {}).reduce((a,b)=>a+Number(b||0),0);
  const exposureTotal = Object.values(session.exposures || {}).reduce((a,b)=>a+Number(b||0),0);

  const kpis = [
    kpiCell("Method", session.method || "unknown"),
    kpiCell("Version", session.version || "unknown"),
    kpiCell("Device", session.device || "unknown"),
    kpiCell("Started", started ? started : "—"),
    kpiCell("Submitted", submitted ? submitted : "—"),
    kpiCell("Duration", fmtMs(session.durationMs || 0)),
    kpiCell("Exposure total", String(exposureTotal)),
    kpiCell("Full-res opens", String(fullResTotal)),
  ].join("");
  const kEl = $("#sd_kpis");
  if (kEl) kEl.innerHTML = kpis;

  // selections
  const selBody = document.querySelector("#sd_sel tbody");
  if (selBody){
    const rows = (session.top3 || []).slice().sort((a,b)=>Number(a.rank)-Number(b.rank));
    selBody.innerHTML = rows.map(r => `
      <tr>
        <td>${escapeHtml(r.rank)}</td>
        <td><a class="link" href="image.html?imageId=${encodeURIComponent(r.imageId)}">#${escapeHtml(r.imageId)}</a></td>
      </tr>
    `).join("");
  }

  // exposures table
  const expBody = document.querySelector("#sd_exp tbody");
  if (expBody){
    const arr = Object.entries(session.exposures || {}).map(([k,v]) => [k, Number(v||0)]).sort((a,b)=>b[1]-a[1]);
    expBody.innerHTML = arr.filter(x=>x[1]>0).map(([k,v]) => `
      <tr>
        <td><a class="link" href="image.html?imageId=${encodeURIComponent(k)}">#${escapeHtml(k)}</a></td>
        <td>${escapeHtml(v)}</td>
      </tr>
    `).join("");
  }

  // opens table
  const openBody = document.querySelector("#sd_opens tbody");
  if (openBody){
    const arr = Object.entries(session.fullResOpens || {}).map(([k,v]) => [k, Number(v||0)]).sort((a,b)=>b[1]-a[1]);
    openBody.innerHTML = arr.filter(x=>x[1]>0).map(([k,v]) => `
      <tr>
        <td><a class="link" href="image.html?imageId=${encodeURIComponent(k)}">#${escapeHtml(k)}</a></td>
        <td>${escapeHtml(v)}</td>
      </tr>
    `).join("");
  }
}

async function main(){
  try {
    const buildEl = $("#dd_build") || $("#sd_build");
    if (buildEl) buildEl.textContent = BUILD_VERSION;

    const imageId = qsParam("imageId");
    const sessionId = qsParam("sessionId");

    const sessions = await loadAllSessions();

    if (imageId && $("#dd_image")) {
      renderImageDrilldown(sessions, Number(imageId));
      return;
    }
    if (sessionId && $("#sd_session")) {
      const s = sessions.find(x => x.sessionId === sessionId);
      if (!s) {
        $("#sd_session").textContent = sessionId;
        $("#sd_kpis").innerHTML = kpiCell("Error", "Session not found in current dataset");
        return;
      }
      renderSessionDrilldown(s);
      return;
    }
  } catch (e){
    const msg = (e && e.message) ? e.message : String(e);
    const el = $("#dd_sel_kpis") || $("#sd_kpis") || document.body;
    if (el) el.innerHTML = `<div class="pill bad">Error</div> <span class="hint">${escapeHtml(msg)}</span>`;
  } finally {
    try { if (window.applyTooltips) window.applyTooltips(document); } catch (_) {}
  }
}

document.addEventListener("DOMContentLoaded", main);
