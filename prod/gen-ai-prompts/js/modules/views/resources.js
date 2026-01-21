// resources.js
// Help → Resources UI (separate from prompts). Loads data/helpResources.json and renders four tabs.
// Viewers open fullscreen (no new tabs) with obvious Close controls.

import { loadHelpResources } from '../dataService.js';
import { $, $$ } from '../dom.js';
import { openModal, closeModal } from '../modals.js';
import { toast } from '../toast.js';

const RES_MODAL_ID = 'helpModal';
const VIEWER_MODAL_ID = 'resourceImageModal';

let tabsWired = false;
let viewerWired = false;

const slideState = {
  src: '',
  title: '',
  page: 1,
  pages: 1,
  pagesKnown: false
};

function titleFromFilename(path){
  const name = String(path || '').split('/').pop() || '';
  return name
    .replace(/\.[a-z0-9]+$/i,'')
    .replace(/[_-]+/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function absUrl(src){
  try {
    return new URL(src, window.location.href).toString();
  } catch {
    return String(src || '');
  }
}

function setActiveTab(tabId){
  $$('.res-tab-btn').forEach(btn => {
    const active = btn.dataset.tab === tabId;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  $$('.res-panel').forEach(panel => {
    const active = panel.id === `resPanel-${tabId}`;
    panel.hidden = !active;
  });
}

function wireTabs(){
  if (tabsWired) return;
  const tabs = $('.res-tabs');
  if (!tabs) return;
  tabsWired = true;

  tabs.addEventListener('click', (e) => {
    const btn = e.target?.closest?.('.res-tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (!tab) return;
    setActiveTab(tab);
  });
}

/* ---------- Fullscreen viewer ---------- */

function hideAllViewerMedia(){
  const img = $('#resViewerImg');
  const vid = $('#resViewerVideo');
  const pdfWrap = $('#resViewerPdfWrap');
  if (img){ img.hidden = true; img.removeAttribute('src'); }
  if (vid){
    try { vid.pause(); } catch {}
    vid.hidden = true;
    vid.removeAttribute('src');
    vid.load?.();
  }
  if (pdfWrap) pdfWrap.hidden = true;
  const frame = $('#resViewerPdfFrame');
  if (frame) frame.removeAttribute('src');
}

function updateSlideFrame(){
  const frame = $('#resViewerPdfFrame');
  const pageEl = $('#resViewerPdfPage');
  const btnPrev = $('#resViewerPdfPrev');
  const btnNext = $('#resViewerPdfNext');

  if (!frame) return;

  const page = Math.min(Math.max(1, slideState.page), slideState.pages || 1);
  slideState.page = page;

  const u = new URL(slideState.src, window.location.href);
  // Force iframe refresh on navigation (some PDF viewers ignore hash-only changes).
  u.searchParams.set('gpcPage', String(page));
  u.hash = `page=${page}&zoom=page-width`;
  frame.src = u.toString();

  if (pageEl){
    pageEl.textContent = slideState.pagesKnown ? `${page} / ${slideState.pages || 1}` : `Page ${page}`;
  }
  if (btnPrev) btnPrev.disabled = (page <= 1);
  if (btnNext) btnNext.disabled = (page >= (slideState.pages || 1));
}

function openViewer({ type, src, title, caption, pages }){
  wireViewer();

  hideAllViewerMedia();

  const modalTitle = $('#resViewerTitle');
  const cap = $('#resViewerCaption');
  if (modalTitle) modalTitle.textContent = title || 'Viewer';
  if (cap) cap.textContent = caption || '';
  if (cap) cap.hidden = !(cap.textContent || '').trim();

  if (type === 'image'){
    const img = $('#resViewerImg');
    if (img){
      img.src = absUrl(src);
      img.alt = title || 'Infographic';
      img.hidden = false;
    }
  } else if (type === 'video'){
    const vid = $('#resViewerVideo');
    if (vid){
      vid.src = absUrl(src);
      vid.hidden = false;
      // do not autoplay; let user initiate
    }
  } else if (type === 'slides'){
    const pdfWrap = $('#resViewerPdfWrap');
    if (pdfWrap) pdfWrap.hidden = false;

    slideState.src = absUrl(src);
    slideState.title = title || 'Slide Deck';
    slideState.pagesKnown = Number.isFinite(pages) && pages > 0 && pages < 900;
    slideState.pages = Number.isFinite(pages) && pages > 0 ? pages : 999;
    slideState.page = 1;

    updateSlideFrame();
  }

  openModal(VIEWER_MODAL_ID);
}

function wireViewer(){
  if (viewerWired) return;
  const modal = document.getElementById(VIEWER_MODAL_ID);
  if (!modal) return;
  viewerWired = true;

  const btnPrev = $('#resViewerPdfPrev');
  const btnNext = $('#resViewerPdfNext');

  btnPrev?.addEventListener('click', () => {
    if (slideState.page > 1){
      slideState.page -= 1;
      updateSlideFrame();
    }
  });

  btnNext?.addEventListener('click', () => {
    if (slideState.page < (slideState.pages || 1)){
      slideState.page += 1;
      updateSlideFrame();
    }
  });

  // Swipe left/right for slides
  let x0 = null;
  modal.addEventListener('touchstart', (e) => {
    if (!$('#resViewerPdfWrap')?.hidden && e.touches?.[0]) x0 = e.touches[0].clientX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    if ($('#resViewerPdfWrap')?.hidden) { x0 = null; return; }
    const x1 = e.changedTouches?.[0]?.clientX ?? x0;
    const dx = x1 - x0;
    x0 = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) btnNext?.click();
    else btnPrev?.click();
  }, { passive: true });

  // Cleanup on close (Close button, backdrop click, ESC)
  const cleanup = () => hideAllViewerMedia();

  modal.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', cleanup);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cleanup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.dataset.open) return;
    cleanup();
  });
}

/* ---------- Renderers ---------- */

function makeCard({ title, thumbEl, onClick, tooltip }){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'res-card';
  btn.title = tooltip || title || 'Open';
  btn.addEventListener('click', onClick);

  if (thumbEl) btn.appendChild(thumbEl);

  const t = document.createElement('div');
  t.className = 'res-card-title';
  t.textContent = title || 'Untitled';
  btn.appendChild(t);

  return btn;
}

function renderInfographics(list){
  const grid = $('#resInfographicsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0){
    grid.innerHTML = '<p class="muted">No infographics configured.</p>';
    return;
  }

  list.forEach(item => {
    const src = item?.src || '';
    const title = item?.title || titleFromFilename(src);

    const img = document.createElement('img');
    img.className = 'res-thumb';
    img.alt = title;
    img.loading = 'lazy';
    img.src = absUrl(src);

    const card = makeCard({
      title,
      thumbEl: img,
      tooltip: `View: ${title}`,
      onClick: () => openViewer({ type: 'image', src, title, caption: item?.description || '' })
    });

    grid.appendChild(card);
  });
}

function renderAudio(list){
  const wrap = $('#resAudioList');
  if (!wrap) return;
  wrap.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0){
    wrap.innerHTML = '<p class="muted">No audio configured.</p>';
    return;
  }

  list.forEach(item => {
    const src = item?.src || '';
    const title = item?.title || titleFromFilename(src);

    const row = document.createElement('div');
    row.className = 'res-media-row';

    const h = document.createElement('div');
    h.className = 'res-media-title';
    h.textContent = title;

    const a = document.createElement('audio');
    a.controls = true;
    a.src = absUrl(src);

    row.appendChild(h);
    row.appendChild(a);
    wrap.appendChild(row);
  });
}

function renderVideo(list){
  const grid = $('#resVideoGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!Array.isArray(list) || list.length === 0){
    grid.innerHTML = '<p class="muted">No video configured.</p>';
    return;
  }

  list.forEach(item => {
    const src = item?.src || '';
    const title = item?.title || titleFromFilename(src);

    const thumb = document.createElement('div');
    thumb.className = 'res-thumb-icon';
    thumb.setAttribute('aria-hidden', 'true');
    thumb.textContent = '▶';

    const card = makeCard({
      title,
      thumbEl: thumb,
      tooltip: `Play: ${title}`,
      onClick: () => openViewer({ type: 'video', src, title, caption: item?.description || '' })
    });

    grid.appendChild(card);
  });
}

function renderSlides(slides){
  const btn = $('#resSlidesViewBtn');
  if (!btn) return;

  const src = slides?.src || '';
  const title = slides?.title || 'Slide Deck';
  const pages = Number(slides?.pages) || 999;

  btn.disabled = !src;
  btn.textContent = src ? 'View Slides' : 'No Slides Configured';

  btn.onclick = () => {
    if (!src){
      toast('No PDF configured.');
      return;
    }
    openViewer({ type: 'slides', src, title, pages });
  };
}

/* ---------- Public init ---------- */

export async function initResources(){
  wireTabs();

  try {
    const data = await loadHelpResources();
    const infographics = data?.infographics || [];
    const audio = data?.audio || [];
    const video = data?.video || [];
    const slides = data?.slides || {};

    renderInfographics(infographics);
    renderAudio(audio);
    renderVideo(video);
    renderSlides(slides);

    // Default tab
    setActiveTab('infographics');
  } catch (err){
    console.error(err);
    toast('Unable to load Resources. Check data/helpResources.json and paths under /resources/.');
  }
}

// Optional: call this if the app needs to hard-reset Resources state.
export function teardownResources(){
  try { closeModal(VIEWER_MODAL_ID); } catch {}
  hideAllViewerMedia();
}
