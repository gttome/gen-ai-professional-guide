// views/infographics.js
import { el, safeUrl } from '../dom.js';
import { toast } from '../toast.js';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='800'%20viewBox='0%200%201200%20800'%3E%3Crect%20width='1200'%20height='800'%20fill='%23f2f2f2'/%3E%3Cpath%20d='M0%200L1200%20800M1200%200L0%20800'%20stroke='%23d0d0d0'%20stroke-width='6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%23666'%20font-size='44'%20font-family='Arial%2CHelvetica%2Csans-serif'%3EInfographic%20not%20included%20in%20this%20ZIP%3C/text%3E%3C/svg%3E";
function pickDefaultVariant(infographics){
  // default view should be standard if available
  if (infographics?.standard) return 'standard';
  if (infographics?.concise) return 'concise';
  if (infographics?.detailed) return 'detailed';
  return null;
}

export async function renderInfographics(workspaceEl, prompt, state, saveState){
  const info = prompt.infographics || {};
  const preferred = state?.infographicVariant;
  const variant = (preferred && info?.[preferred]) ? preferred : pickDefaultVariant(info);

  const card = el('div', { class: 'card' });
  const header = el('div', { class: 'card-header' }, [
    el('div', { class: 'card-title' }, [
      el('h2', { text: 'Infographics' }),
      el('div', { class: 'hint', text: 'Choose concise/standard/detailed. Drag to pan; pinch or Ctrl+wheel to zoom.' }),
    ]),
  ]);

  const controls = el('div', { class: 'controls' });
  const select = el('select', { class: 'control-select', 'aria-label': 'Select infographic detail level' }, []);
  const options = [
    { key: 'concise', label: 'Concise' },
    { key: 'standard', label: 'Standard (default)' },
    { key: 'detailed', label: 'Detailed' },
  ];
  options.forEach(o => {
    const has = Boolean(info[o.key]);
    const opt = el('option', { value: o.key, text: o.label });
    // If missing, we will still allow selection but show the placeholder.
    if (!has) opt.dataset.missing = 'true';
    select.appendChild(opt);
  });
  if (variant) select.value = variant;

  const btnZoomIn = el('button', { class: 'control-btn', type: 'button', text: 'Zoom +', title: 'Zoom in' });
  const btnZoomOut = el('button', { class: 'control-btn', type: 'button', text: 'Zoom −', title: 'Zoom out' });
  const btnReset = el('button', { class: 'control-btn', type: 'button', text: 'Reset', title: 'Reset zoom' });
  const btnOpen = el('button', { class: 'control-btn', type: 'button', text: 'Open', title: 'Open infographic in a new tab (fit to viewport)' });

  controls.append(select, btnZoomIn, btnZoomOut, btnReset, btnOpen);
  header.appendChild(controls);

  const body = el('div', { class: 'card-body' });
  const stage = el('div', { class: 'stage' });
  const inner = el('div', { class: 'stage-inner' });

  stage.appendChild(inner);
  body.appendChild(stage);

  card.append(header, body);
  workspaceEl.appendChild(card);


  let img = null;
  let scale = 1;
  let isDragging = false;
  let dragStart = { x: 0, y: 0, scrollLeft: 0, scrollTop: 0 };
  const pointers = new Map();
  let pinch = null; // { baseDist, baseScale }

  function fitConcise(){
    if (!img) return;
    if (select.value !== 'concise') return;

    stage.classList.add('fit');

    // Baseline: no zoom transform; sizing handled by CSS constraints.
    scale = 1;
    img.style.transform = 'none';
    img.style.width = '';
    img.style.height = '';
  }

  function setScale(next){
    scale = Math.max(1, Math.min(4, next));
    if (!img) return;

    // If concise, keep fit baseline unless the user zooms (then allow transform).
    if (select.value === 'concise'){
      stage.classList.remove('fit'); // zooming implies user accepts scrolling if needed
    }

    img.style.transform = `scale(${scale})`;
    // Clear explicit sizing when zooming.
    img.style.width = '';
    img.style.height = '';
  }

  function loadImage(){
    // Toggle fit mode based on variant.
    stage.classList.toggle('fit', select.value === 'concise');

    inner.innerHTML = '';
    const path = info[select.value] || PLACEHOLDER;
    const src = (path && String(path).startsWith('data:')) ? path : safeUrl(path);
    img = el('img', {
      src,
      alt: `${prompt.title} infographic (${select.value})`,
      loading: 'lazy'
    });
    img.addEventListener('load', () => {
      // Apply fit sizing once natural dimensions are available.
      if (select.value === 'concise'){
        fitConcise();
      } else {
        stage.classList.remove('fit');
        img.style.width = '';
        img.style.height = '';
      }
    });

    img.addEventListener('error', () => {
      if (img && img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
    });
    setScale(1);
    inner.appendChild(img);

    // If the prompt is using the placeholder, show a subtle note.
    if (!info[select.value]){
      inner.appendChild(el('p', { class: 'muted', text: 'Placeholder shown. Add the real infographic file and update data/prompts.json.' }));
    }
  }

  select.addEventListener('change', () => {
    if (state){
      state.infographicVariant = select.value;
      saveState?.();
    }
    loadImage();
    toast('Infographic updated.');
  });

  window.addEventListener('resize', () => {
    if (select.value === 'concise') fitConcise();
  });

  btnZoomIn.addEventListener('click', () => setScale(scale + 0.25));
  btnZoomOut.addEventListener('click', () => setScale(scale - 0.25));
  btnReset.addEventListener('click', () => setScale(1));
  btnOpen.addEventListener('click', () => {
    const path = info[select.value] || '';
    const url = (path && String(path).startsWith('data:')) ? path : safeUrl(path);
    const absUrl = (url && !String(url).startsWith('data:')) ? new URL(url, window.location.href).toString() : url;
    const currentSrc = (img && img.src) ? String(img.src) : '';
    const src = currentSrc || absUrl;

    if (!src || !String(src).trim()){
      toast('No infographic is configured for this prompt.');
      return;
    }

    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w){ toast('Popup blocked by browser.'); return; }

    const title = (prompt?.title ? prompt.title : 'Infographic');
    const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    w.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    :root{ color-scheme: light dark; }
    body{ margin:0; overflow:hidden; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#0b0f17; color:#e7eefc; }
    .wrap{ height:100vh; width:100vw; display:flex; flex-direction:column; }
    .bar{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.12); }
    .title{ font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .btn{ border:1px solid rgba(255,255,255,.18); background:rgba(255,255,255,.06); color:#e7eefc; padding:8px 12px; border-radius:999px; cursor:pointer; }
    .stage{ flex:1; display:flex; align-items:center; justify-content:center; padding:10px; }
    img{ max-width:90vw; max-height:90vh; width:auto; height:auto; object-fit:contain; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="bar">
      <div class="title">${safeTitle}</div>
      <button class="btn" title="Close" onclick="window.close()">Close</button>
    </div>
    <div class="stage">
      <img alt="${safeTitle}" src=${JSON.stringify(src)} />
    </div>
  </div>
</body>
</html>`);
    w.document.close();
  });

  // Drag-to-pan (uses the scroll container)
  stage.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture?.(e.pointerId);

    if (pointers.size === 1){
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY, scrollLeft: stage.scrollLeft, scrollTop: stage.scrollTop };
    }

    if (pointers.size === 2){
      // Start pinch
      const pts = [...pointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinch = { baseDist: Math.hypot(dx, dy), baseScale: scale };
      isDragging = false;
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1 && isDragging){
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      stage.scrollLeft = dragStart.scrollLeft - dx;
      stage.scrollTop = dragStart.scrollTop - dy;
      return;
    }

    if (pointers.size === 2 && pinch){
      const pts = [...pointers.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const ratio = pinch.baseDist ? (dist / pinch.baseDist) : 1;
      setScale(pinch.baseScale * ratio);
    }
  });

  function endPointer(e){
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) isDragging = false;
  }

  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('pointerleave', endPointer);

  // Ctrl/Cmd + wheel zoom (prevents browser page zoom within stage)
  stage.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const dir = Math.sign(e.deltaY);
    setScale(scale + (dir > 0 ? -0.15 : 0.15));
  }, { passive: false });
  // Ensure correct fit mode is applied on first render.
  stage.classList.toggle('fit', select.value === 'concise');
  loadImage();
}
