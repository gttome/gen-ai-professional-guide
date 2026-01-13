// toast.js
import { $ } from './dom.js';

let timer = null;
export function toast(message, ms=1600){
  const t = $('#toast');
  if (!t) return;
  t.textContent = message;
  t.hidden = false;

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    t.hidden = true;
    t.textContent = '';
  }, ms);
}
