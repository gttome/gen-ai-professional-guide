// modals.js (Phase 3)
// Accessible modal behavior:
// - ESC closes the active modal
// - Click backdrop closes
// - Focus is trapped within the active modal while open
// - Focus returns to the previously focused element when closed

import { $$ } from './dom.js';

let activeModal = null;
let lastFocused = null;

function getFocusable(modal){
  if (!modal) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(modal.querySelectorAll(selectors.join(',')))
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

export function openModal(id){
  const m = document.getElementById(id);
  if (!m) return;

  lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  activeModal = m;

  m.hidden = false;
  m.dataset.open = 'true';
  document.documentElement.classList.add('modal-open');

  // Focus the first focusable element (close button is typically first)
  const focusables = getFocusable(m);
  (focusables[0] || m).focus?.();
}

export function closeModal(id){
  const m = document.getElementById(id);
  if (!m) return;

  m.hidden = true;
  delete m.dataset.open;

  if (activeModal === m) activeModal = null;
  document.documentElement.classList.remove('modal-open');

  // Restore focus
  lastFocused?.focus?.();
  lastFocused = null;
}

export function initModals(){
  // close buttons
  $$('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal?.id) closeModal(modal.id);
    });
  });

  // click backdrop closes
  $$('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m.id);
    });
  });

  // global key handling for open modal
  document.addEventListener('keydown', (e) => {
    if (!activeModal) return;

    if (e.key === 'Escape'){
      e.preventDefault();
      closeModal(activeModal.id);
      return;
    }

    if (e.key === 'Tab'){
      const focusables = getFocusable(activeModal);
      if (!focusables.length){
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && current === first){
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last){
        e.preventDefault();
        first.focus();
      }
    }
  });
}
