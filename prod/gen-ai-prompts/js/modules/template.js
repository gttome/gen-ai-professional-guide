// views/template.js
import { el, safeUrl } from '../dom.js';
import { toast } from '../toast.js';

async function fetchText(path){
  const res = await fetch(safeUrl(path), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Template fetch failed: ${res.status}`);
  return await res.text();
}

function downloadText(filename, text){
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function debounce(fn, ms){
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function safeFileBase(name){
  return String(name || 'prompt')
    .trim()
    .replace(/[\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 90)
    .trim() || 'prompt';
}

/**
 * Derive a companion "use cases" file from a base template file.
 * Example: "Acting As.txt" -> "Acting As uc.txt"
 */
function deriveUseCasesPath(templatePath){
  const p = String(templatePath || '');
  if (!p) return '';

  const lastSlash = Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'));
  const dir = lastSlash >= 0 ? p.slice(0, lastSlash + 1) : '';
  const file = lastSlash >= 0 ? p.slice(lastSlash + 1) : p;

  const dot = file.lastIndexOf('.');
  const base = dot >= 0 ? file.slice(0, dot) : file;
  const ext = dot >= 0 ? file.slice(dot) : '';

  if (base.trim().toLowerCase().endsWith(' uc')) return p;

  return dir + base + ' uc' + ext;
}

export async function renderTemplate(workspaceEl, prompt, state, saveState){
  const card = el('div', { class: 'card' });

  const header = el('div', { class: 'card-header' }, [
    el('div', { class: 'card-title' }, [
      el('h2', { text: 'Editable Template' }),
      el('div', { class: 'hint', text: 'Load a file, edit text, then copy or download as a .txt file.' }),
    ])
  ]);

  const controls = el('div', { class: 'controls' });

  const btnLoadTemplate = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Load Template',
    title: 'Load the base template file (e.g., “Acting As.txt”)'
  });

  const btnLoadUseCases = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Load Use Cases',
    title: 'Load the companion use-cases file (e.g., “Acting As uc.txt”)'
  });

  const btnCopy = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Copy to Clipboard',
    title: 'Copy the current editor text to the clipboard'
  });

  const btnDownload = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Download .txt',
    title: 'Download the current editor text as a .txt file'
  });

  const btnRestore = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Restore original',
    title: 'Restore the original file contents (discarding local edits in the editor)'
  });

  controls.append(btnLoadTemplate, btnLoadUseCases, btnCopy, btnDownload, btnRestore);
  header.appendChild(controls);

  const body = el('div', { class: 'card-body' });
  const label = el('label', { class: 'field-label', for: 'templateText', text: 'Template text' });
  const ta = el('textarea', {
    id: 'templateText',
    class: 'textarea',
    rows: '16',
    placeholder: 'Loading…'
  });

  body.append(label, ta);

  const templatePath = prompt.template ? String(prompt.template) : '';
  const useCasesPath = (prompt.templateUseCases ? String(prompt.templateUseCases) : deriveUseCasesPath(templatePath));

  // Track which file is currently loaded in the editor.
  let activeKind = 'template'; // 'template' | 'useCases'
  let originalTemplateText = '';
  let originalUseCasesText = '';

  function setActiveUI(kind){
    activeKind = kind;
    const isUC = activeKind === 'useCases';
    label.textContent = isUC ? 'Use cases text' : 'Template text';

    btnLoadTemplate.classList.toggle('active', !isUC);
    btnLoadUseCases.classList.toggle('active', isUC);
  }

  function ensureDraftContainers(){
    if (!state) return;
    state.templateDrafts = (state.templateDrafts && typeof state.templateDrafts === 'object') ? state.templateDrafts : {};
    state.useCaseDrafts = (state.useCaseDrafts && typeof state.useCaseDrafts === 'object') ? state.useCaseDrafts : {};
    state.templateActiveKind = (state.templateActiveKind && typeof state.templateActiveKind === 'object') ? state.templateActiveKind : {};
  }

  function getDraft(kind){
    if (!state) return null;
    if (kind === 'useCases'){
      return (state.useCaseDrafts && typeof state.useCaseDrafts[prompt.id] === 'string') ? state.useCaseDrafts[prompt.id] : null;
    }
    return (state.templateDrafts && typeof state.templateDrafts[prompt.id] === 'string') ? state.templateDrafts[prompt.id] : null;
  }

  function setDraft(kind, value){
    if (!state) return;
    ensureDraftContainers();
    if (kind === 'useCases'){
      state.useCaseDrafts[prompt.id] = value;
    } else {
      state.templateDrafts[prompt.id] = value;
    }
    state.templateActiveKind[prompt.id] = kind;
    saveState?.();
  }

  async function loadFromFile(kind, preferDraft = true){
    setActiveUI(kind);

    const isUC = kind === 'useCases';
    const path = isUC ? useCasesPath : templatePath;

    if (!path){
      ta.value = '';
      ta.placeholder = isUC
        ? 'No use-cases file is configured for this prompt.'
        : 'No template file is configured for this prompt.';
      body.appendChild(el('p', { class: 'muted', text: ta.placeholder }));
      return;
    }

    // Prefer local draft if present.
    if (preferDraft){
      const draft = getDraft(kind);
      if (typeof draft === 'string'){
        ta.value = draft;
        ta.placeholder = '';
        return;
      }
    }

    try{
      const text = await fetchText(path);
      if (isUC) originalUseCasesText = text;
      else originalTemplateText = text;

      ta.value = text;
      ta.placeholder = '';
      toast(isUC ? 'Loaded use cases.' : 'Loaded template.');
    }catch(err){
      console.error(err);
      ta.value = '';
      ta.placeholder = 'File not available. Run start-server.bat and confirm your assets/templates contains the file.';
      body.appendChild(el('p', { class: 'muted', text: ta.placeholder }));
      toast('Load failed (file not available).');
    }
  }

  // Persist drafts per prompt + per kind (debounced)
  const persistDraft = debounce(() => {
    if (!state) return;
    ensureDraftContainers();
    setDraft(activeKind, ta.value);
  }, 450);

  ta.addEventListener('input', persistDraft);

  // Default kind: resume last active kind (if available), otherwise template.
  const lastKind = (state?.templateActiveKind && typeof state.templateActiveKind[prompt.id] === 'string')
    ? state.templateActiveKind[prompt.id]
    : 'template';

  // Preload originals (best-effort) so "Restore original" works.
  // We do it lazily when the user loads each file; but this gives a better first experience:
  setActiveUI(lastKind === 'useCases' ? 'useCases' : 'template');
  await loadFromFile(activeKind, true);

  btnLoadTemplate.addEventListener('click', async () => {
    await loadFromFile('template', true);
  });

  btnLoadUseCases.addEventListener('click', async () => {
    await loadFromFile('useCases', true);
  });

  btnCopy.addEventListener('click', async () => {
    const text = ta.value ?? '';
    if (!text.trim()){
      toast('Nothing to copy.');
      return;
    }
    try{
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard.');
    }catch{
      toast('Copy failed (browser blocked).');
    }
  });

  btnDownload.addEventListener('click', () => {
    const text = ta.value ?? '';
    if (!text.trim()){
      toast('Nothing to download.');
      return;
    }
    const safeName = safeFileBase(prompt.title);
    const suffix = (activeKind === 'useCases') ? ' uc' : '';
    downloadText(`${safeName}${suffix}.txt`, text);
    toast('Downloaded.');
  });

  btnRestore.addEventListener('click', async () => {
    try{
      const isUC = activeKind === 'useCases';
      const path = isUC ? useCasesPath : templatePath;
      if (!path) throw new Error('No file configured');

      const text = await fetchText(path);
      if (isUC) originalUseCasesText = text;
      else originalTemplateText = text;

      ta.value = text;
      setDraft(activeKind, text);
      toast(isUC ? 'Restored original use cases.' : 'Restored original template.');
    }catch{
      toast('Restore failed (original file not available).');
    }
  });

  // Notes (per prompt) – lightweight and stored locally
  const notes = el('details', { class: 'details' }, [
    el('summary', { text: 'My notes (saved locally)' }),
  ]);
  const notesWrap = el('div', { class: 'details-body' });
  const notesLabel = el('label', { class: 'field-label', for: 'notesText', text: 'Notes' });
  const notesTa = el('textarea', {
    id: 'notesText',
    class: 'textarea',
    rows: '6',
    placeholder: 'Add your notes for this prompt…'
  });
  const notesControls = el('div', { class: 'controls' });
  const btnNotesDownload = el('button', {
    class: 'control-btn',
    type: 'button',
    text: 'Download notes .txt',
    title: 'Download your notes as a .txt file'
  });
  notesControls.appendChild(btnNotesDownload);

  notesTa.value = (state?.notes && typeof state.notes === 'object' && typeof state.notes[prompt.id] === 'string')
    ? state.notes[prompt.id]
    : '';

  const persistNotes = debounce(() => {
    if (!state) return;
    state.notes = (state.notes && typeof state.notes === 'object') ? state.notes : {};
    state.notes[prompt.id] = notesTa.value;
    saveState?.();
  }, 450);
  notesTa.addEventListener('input', persistNotes);

  btnNotesDownload.addEventListener('click', () => {
    const text = (notesTa.value || '').trim();
    if (!text){ toast('No notes to download.'); return; }
    const safeName = safeFileBase(prompt.title);
    downloadText(`${safeName}_notes.txt`, text + '\n');
    toast('Notes downloaded.');
  });

  notesWrap.append(notesLabel, notesTa, notesControls);
  notes.appendChild(notesWrap);
  body.appendChild(notes);

  card.append(header, body);
  workspaceEl.appendChild(card);
}
