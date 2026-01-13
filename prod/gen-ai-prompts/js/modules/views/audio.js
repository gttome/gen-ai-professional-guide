// views/audio.js
import { el, safeUrl } from '../dom.js';
import { toast } from '../toast.js';

export async function renderAudio(workspaceEl, prompt, _state, _saveState){
  const card = el('div', { class: 'card' });
  const header = el('div', { class: 'card-header' }, [
    el('div', { class: 'card-title' }, [
      el('h2', { text: 'Audio' }),
      el('div', { class: 'hint', text: 'Listen with standard controls. Intended for quick review and mobile use.' }),
    ])
  ]);

  const body = el('div', { class: 'card-body' });
  const path = prompt.audio;

  if (!path){
    body.appendChild(el('p', { class: 'muted', text: 'No audio is configured for this prompt.' }));
  } else {
    const wrapper = el('div', { class: 'media' });
    const errNote = el('p', { class: 'muted media-error', text: '' });
    const audio = el('audio', {
      controls: '',
      preload: 'metadata',
      'aria-label': `${prompt.title} audio`
    });
    const source = el('source', { src: safeUrl(path), type: 'audio/mp4' });
    audio.appendChild(source);
    audio.addEventListener('error', () => {
      errNote.textContent = 'Audio failed to load. Confirm the file exists in assets/audios, then use Diagnostics for details.';
      toast('Audio failed to load.');
    });
    wrapper.appendChild(audio);
    body.append(wrapper, errNote);
  }

  card.append(header, body);
  workspaceEl.appendChild(card);
}
