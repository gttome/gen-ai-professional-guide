// render.js
// Renders the requested asset into the workspace.

import { el } from './dom.js';
import { renderInfographics } from './views/infographics.js';
import { renderVideo } from './views/video.js';
import { renderAudio } from './views/audio.js';
import { renderTemplate } from './views/template.js';

export async function renderAsset(workspaceEl, appData, state, saveState){
  const prompt = appData.prompts.find(p => p.id === state.promptId);
  workspaceEl.innerHTML = '';

  if (!prompt){
    workspaceEl.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'card-header' }, [
        el('div', { class: 'card-title' }, [
          el('h2', { text: 'Prompt not found' }),
          el('div', { class: 'hint', text: 'Check data/prompts.json' }),
        ])
      ]),
      el('div', { class: 'card-body' }, [
        el('p', { class: 'muted', text: 'The selected prompt is missing from the data file.' })
      ])
    ]));
    return;
  }

  switch (state.asset){
    case 'video':
      await renderVideo(workspaceEl, prompt, state, saveState);
      break;
    case 'audio':
      await renderAudio(workspaceEl, prompt, state, saveState);
      break;
    case 'template':
      await renderTemplate(workspaceEl, prompt, state, saveState);
      break;
    case 'infographics':
    default:
      await renderInfographics(workspaceEl, prompt, state, saveState);
      break;
  }
}
