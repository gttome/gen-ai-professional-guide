// views/video.js
import { el, safeUrl } from '../dom.js';
import { toast } from '../toast.js';

export async function renderVideo(workspaceEl, prompt, _state, _saveState){
  const card = el('div', { class: 'card' });
  const header = el('div', { class: 'card-header' }, [
    el('div', { class: 'card-title' }, [
      el('h2', { text: 'Video' }),
      el('div', { class: 'hint', text: 'Mobile-friendly playback with controls. Uses playsinline to avoid forced full-screen on iOS.' }),
    ])
  ]);

  const body = el('div', { class: 'card-body' });
  const path = prompt.video;

  if (!path){
    body.appendChild(el('p', { class: 'muted', text: 'No video is configured for this prompt.' }));
  } else {
    const wrapper = el('div', { class: 'media' });
    const errNote = el('p', { class: 'muted media-error', text: '' });
    const video = el('video', {
      controls: '',
      playsinline: '',
      preload: 'metadata',
      'aria-label': `${prompt.title} video`
    });
    const source = el('source', { src: safeUrl(path), type: 'video/mp4' });
    video.appendChild(source);
    video.addEventListener('error', () => {
      errNote.textContent = 'Video failed to load. Confirm the file exists in assets/videos, then use Diagnostics for details.';
      toast('Video failed to load.');
    });
    wrapper.appendChild(video);
    body.append(wrapper, errNote);
  }

  card.append(header, body);
  workspaceEl.appendChild(card);
}
