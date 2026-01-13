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
  URL.revokeObjectURL(a.href);
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    return false;
  }
}

function debounce(fn, ms){
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function safeFileBase(name){
  return (name || 'prompt')
    .replace(/[^a-z0-9\-_]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

export async function renderTemplate(workspaceEl, prompt, state, saveState){
  const card = el('div', { class: 'card' });
  const header = el('div', { class: 'card-header' }, [
    el('div', { class: 'card-title' }, [
      el('h2', { text: 'Editable Template' }),
      el('div', { class: 'hint', text: 'Edit the template, then copy or download as a .txt file.' }),
    ])
  ]);

  const controls = el('div', { class: 'controls' });
  const btnCopy = el('button', { class: 'control-btn', type: 'button', text: 'Copy to Clipboard' });
  const btnDownload = el('button', { class: 'control-btn', type: 'button', text: 'Download .txt' });
  const btnRestore = el('button', { class: 'control-btn', type: 'button', text: 'Restore original' });
  controls.append(btnCopy, btnDownload, btnRestore);
  header.appendChild(controls);

  const body = el('div', { class: 'card-body' });
  const label = el('label', { class: 'field-label', for: 'templateText', text: 'Prompt template' });
  const ta = el('textarea', { id: 'templateText', class: 'textarea', rows: '14' });

  body.append(label, ta);

  let originalText = '';

  // Load original (from file) if configured
  if (!prompt.template){
    ta.value = '';
    body.appendChild(el('p', { class: 'muted', text: 'No template file is configured for this prompt.' }));
  } else {
    try{
      originalText = await fetchText(prompt.template);
      // If a draft exists in localStorage, use it; otherwise use original
      const draft = state?.templateDrafts?.[prompt.id];
      ta.value = typeof draft === 'string' ? draft : originalText;
    }catch(err){
      console.error(err);
      ta.value = '';
      body.appendChild(el('p', { class: 'muted', text: 'Template failed to load. Run via start-server.bat and confirm assets/templates contains the file.' }));
    }
  }

  // Persist template drafts per prompt (debounced)
  const persistDraft = debounce(() => {
    if (!state) return;
    state.templateDrafts = (state.templateDrafts && typeof state.templateDrafts === 'object') ? state.templateDrafts : {};
    state.templateDrafts[prompt.id] = ta.value;
    saveState?.();
  }, 450);

  ta.addEventListener('input', persistDraft);

  btnCopy.addEventListener('click', async () => {
    const text = ta.value ?? '';
    if (!text.trim()){
      toast('Nothing to copy.');
      return;
    }

    const ok = await copyToClipboard(text);
    if (ok){
      toast('Copied to clipboard.');
      return;
    }

    // Fallback
    ta.focus();
    ta.select();
    try{
      document.execCommand('copy');
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
    downloadText(`${safeName}.txt`, text);
    toast('Downloaded.');
  });

  btnRestore.addEventListener('click', async () => {
    if (!prompt.template){
      toast('No original template is configured.');
      return;
    }

    try{
      if (!originalText) originalText = await fetchText(prompt.template);
      ta.value = originalText;
      if (state){
        state.templateDrafts = (state.templateDrafts && typeof state.templateDrafts === 'object') ? state.templateDrafts : {};
        delete state.templateDrafts[prompt.id];
        saveState?.();
      }
      toast('Restored original template.');
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
  const notesTa = el('textarea', { id: 'notesText', class: 'textarea', rows: '6', placeholder: 'Add your notes for this prompt…' });
  const notesControls = el('div', { class: 'controls' });
  const btnNotesDownload = el('button', { class: 'control-btn', type: 'button', text: 'Download notes .txt' });
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
