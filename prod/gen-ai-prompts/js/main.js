// main.js (Phase 3)
// Entry point. Loads prompts.json, wires navigation, filters, diagnostics, and renders the active asset.
//
// Design goals:
// - Vanilla ES modules (no framework dependency)
// - Mobile-first + accessible interactions
// - Runs on GitHub Pages + local test server (start-server.bat)
// - Data-driven (data/prompts.json) and modular JS

import { loadAppData } from './modules/dataService.js';
import { renderAsset } from './modules/render.js';
import { $, $$ } from './modules/dom.js';
import { toast } from './modules/toast.js';
import { openModal, initModals } from './modules/modals.js';
const STORAGE_KEY = 'gaPromptCompanion.phase3';

const THEME_KEY = 'gpc.theme';

function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  const btn = $('#themeToggleBtn');
  if (btn){
    // Show the *next* theme in the label (quickly discoverable)
    btn.textContent = (theme === 'dark') ? 'Light' : 'Dark';
  }
}

function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  const theme = (saved === 'dark') ? 'dark' : 'light';
  applyTheme(theme);

  const btn = $('#themeToggleBtn');
  if (btn){
    btn.addEventListener('click', () => {
      const current = (document.documentElement.dataset.theme === 'dark') ? 'dark' : 'light';
      const next = (current === 'dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
}


let appData = null;
let lastAudit = null;

let state = {
  promptId: null,
  asset: 'infographics',
  infographicVariant: 'standard',
favorites: [],
  templateDrafts: {},
  notes: {},

  // Phase 3

  recent: [],            // most recent prompt IDs (max 12)
  filtersOpen: false,
};

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') state = { ...state, ...parsed };
  } catch {}
}

function setActiveNav(asset){
  $$('.nav-btn').forEach(btn => {
    const isActive = btn.dataset.asset === asset;
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function isFavorite(id){
  return Array.isArray(state.favorites) && state.favorites.includes(id);
}

function updateFavoriteButton(){
  const btn = $('#favoriteBtn');
  if (!btn) return;
  const fav = isFavorite(state.promptId);
  btn.setAttribute('aria-pressed', String(fav));
  btn.textContent = fav ? '★' : '☆';
  btn.setAttribute('aria-label', fav ? 'Remove from favorites' : 'Add to favorites');
  btn.title = fav ? 'Unfavorite' : 'Favorite';
}

function getCurrentPrompt(){
  return appData?.prompts?.find(x => x.id === state.promptId) || null;
}

function updateTitle(){
  const p = getCurrentPrompt();
  $('#promptTitle').textContent = p ? p.title : 'Prompt';
  document.title = p ? `${p.title} – Gen AI Prompt Companion` : 'Gen AI Prompt Companion';
  updateFavoriteButton();
}

function updateVersion(){
  const v = appData?.app?.version || 'v0.3.0 (Phase 3)';
  const el = $('#appVersion');
  if (el) el.textContent = v;
}

function updateRecent(id){
  if (!id) return;
  state.recent = Array.isArray(state.recent) ? state.recent : [];
  state.recent = state.recent.filter(x => x !== id);
  state.recent.unshift(id);
  state.recent = state.recent.slice(0, 12);
}

function normalizeTags(tags){
  if (!Array.isArray(tags)) return [];
  return tags.map(t => String(t).trim()).filter(Boolean);
}

function passesTagFilter(prompt){
  const selected = Array.isArray(state.tagFilters) ? state.tagFilters : [];
  if (!selected.length) return true;
  const tags = new Set(normalizeTags(prompt.tags));
  // AND semantics: prompt must contain all selected tags.
  return selected.every(t => tags.has(t));
}

function filteredPrompts(){
  const q = (state.promptSearch || '').trim().toLowerCase();
  return appData.prompts.filter(p => {
    const matchText = !q || (p.title || '').toLowerCase().includes(q);
    return matchText && passesTagFilter(p);
  });
}

function sortPrompts(list){
  const mode = state.sortMode || 'favorites';
  const byTitle = (a,b) => (a.title || '').localeCompare((b.title || ''), undefined, { sensitivity: 'base' });

  if (mode === 'az'){
    return [...list].sort(byTitle);
  }

  if (mode === 'recent'){
    const recent = Array.isArray(state.recent) ? state.recent : [];
    const rank = new Map(recent.map((id, idx) => [id, idx]));
    return [...list].sort((a,b) => {
      const ra = rank.has(a.id) ? rank.get(a.id) : 9999;
      const rb = rank.has(b.id) ? rank.get(b.id) : 9999;
      if (ra !== rb) return ra - rb;
      return byTitle(a,b);
    });
  }

  // favorites first (default)
  const favSet = new Set(state.favorites || []);
  return [...list].sort((a,b) => {
    const af = favSet.has(a.id) ? 0 : 1;
    const bf = favSet.has(b.id) ? 0 : 1;
    if (af !== bf) return af - bf;
    return byTitle(a,b);
  });
}

function buildPromptOptions(){
  const sel = $('#promptSelect');
  if (!sel) return;
  sel.innerHTML = '';

  const byTitle = (a,b) => (a.title || '').localeCompare((b.title || ''), undefined, { sensitivity: 'base' });
  const list = Array.isArray(appData?.prompts) ? [...appData.prompts].sort(byTitle) : [];

  if (list.length === 0){
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No prompts found';
    opt.disabled = true;
    sel.appendChild(opt);
    sel.value = '';
    return;
  }

  const allowed = new Set(list.map(p => p.id));
  if (!allowed.has(state.promptId)) state.promptId = list[0].id;

  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.title || p.id;
    sel.appendChild(opt);
  });

  sel.value = state.promptId;
}


function buildTagChips(){
  const wrap = $('#tagChips');
  if (!wrap) return;

  wrap.innerHTML = '';
  const all = new Set();
  appData.prompts.forEach(p => normalizeTags(p.tags).forEach(t => all.add(t)));

  const tags = [...all].sort((a,b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  if (!tags.length){
    wrap.appendChild(document.createTextNode('No tags defined.'));
    return;
  }

  const selected = new Set(state.tagFilters || []);
  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag-chip';
    btn.textContent = tag;
    btn.setAttribute('aria-pressed', String(selected.has(tag)));
    btn.addEventListener('click', async () => {
      const arr = Array.isArray(state.tagFilters) ? state.tagFilters : [];
      const idx = arr.indexOf(tag);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(tag);
      state.tagFilters = arr;
      saveState();
buildPromptOptions();
      updateTitle();
      await renderAndRefresh();
    });
    wrap.appendChild(btn);
  });
}



async function renderAndRefresh(){
  setActiveNav(state.asset);
  await renderAsset($('#workspace'), appData, state, saveState);
}

function initFiltersUI(){
  const panel = $('#filtersPanel');
  const sort = $('#sortSelect');
  const clear = $('#clearFiltersBtn');

  if (panel){
    // Restore open state
    panel.open = Boolean(state.filtersOpen);
    panel.addEventListener('toggle', () => {
      state.filtersOpen = panel.open;
      saveState();
    });
  }

  if (sort){
    sort.value = state.sortMode || 'favorites';
    sort.addEventListener('change', async () => {
      state.sortMode = sort.value;
      saveState();
      buildPromptOptions();
      await renderAndRefresh();
    });
  }

  if (clear){
    clear.addEventListener('click', async () => {
      state.tagFilters = [];
      state.promptSearch = '';
      const search = $('#promptSearch');
      if (search) search.value = '';
      saveState();
buildPromptOptions();
      updateTitle();
      toast('Filters cleared.');
      await renderAndRefresh();
    });
  }
}

function populatePromptSelect(){
  const sel = $('#promptSelect');
  if (!sel) return;

  buildPromptOptions();

  sel.addEventListener('change', async () => {
    state.promptId = sel.value;
    updateRecent(state.promptId);
    saveState();
    updateTitle();
    await renderAndRefresh();
  });
}


function initNav(){
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.asset = btn.dataset.asset;
      saveState();
      setActiveNav(state.asset);
      await renderAndRefresh();
    });
  });
}

function initFavorites(){
  const btn = $('#favoriteBtn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (!state.promptId) return;
    state.favorites = Array.isArray(state.favorites) ? state.favorites : [];
    const idx = state.favorites.indexOf(state.promptId);
    if (idx >= 0) state.favorites.splice(idx, 1);
    else state.favorites.push(state.promptId);

    saveState();
    updateFavoriteButton();
    buildPromptOptions();
    toast(isFavorite(state.promptId) ? 'Added to favorites.' : 'Removed from favorites.');
    await renderAndRefresh();
  });
}



function initHelpAndFeedback(){
  $('#helpBtn')?.addEventListener('click', () => openModal('helpModal'));
  $('#feedbackBtn')?.addEventListener('click', () => openModal('feedbackModal'));

  $('#downloadFeedbackBtn')?.addEventListener('click', () => {
    const txt = ($('#feedbackText')?.value || '').trim();
    if (!txt){
      toast('Please enter feedback first.');
      return;
    }
    const filename = `feedback_${new Date().toISOString().slice(0,10)}.txt`;
    const blob = new Blob([txt + '\n'], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast('Feedback downloaded.');
  });
}

function initShortcuts(){
  document.addEventListener('keydown', async (e) => {

    // Alt+1..4 switches asset
    if (e.altKey && !e.ctrlKey && !e.metaKey){
      const map = { '1': 'infographics', '2': 'video', '3': 'audio', '4': 'template' };
      const next = map[e.key];
      if (next){
        e.preventDefault();
        state.asset = next;
        saveState();
        setActiveNav(state.asset);
        await renderAndRefresh();
      }
    }
  });
}

async function boot(){
  loadState();
  initTheme();
  appData = await loadAppData();
  updateVersion();

  // Init prompt selection
  state.favorites = Array.isArray(state.favorites) ? state.favorites : [];
  state.tagFilters = Array.isArray(state.tagFilters) ? state.tagFilters : [];
  state.recent = Array.isArray(state.recent) ? state.recent : [];

  if (!state.promptId && appData.prompts[0]){
    state.promptId = appData.prompts[0].id;
  }
  updateRecent(state.promptId);
populatePromptSelect();
  initNav();
  initFavorites();
  initModals();
initHelpAndFeedback();
  initShortcuts();

  setActiveNav(state.asset);
  updateTitle();

  await renderAndRefresh();
  saveState();
}

boot().catch(err => {
  console.error(err);
  const w = $('#workspace');
  if (w){
    w.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h2>App failed to start</h2>
            <div class="hint">See console for details</div>
          </div>
        </div>
        <div class="card-body">
          <p class="muted">
            Run via <strong>start-server.bat</strong> and confirm <strong>data/prompts.json</strong> exists.
          </p>
        </div>
      </div>`;
  }
});
