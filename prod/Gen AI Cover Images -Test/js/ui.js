export function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

export function show(el) { el.hidden = false; }
export function hide(el) { el.hidden = true; }

export function showOnlyScreen(screenId) {
  for (const s of document.querySelectorAll(".screen")) s.hidden = true;
  const target = $(screenId);
  target.hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });
}

export function setProgress({ wrapId, labelId, fillId, showProgress, labelText, percent }) {
  const wrap = $(wrapId);
  const label = $(labelId);
  const fill = $(fillId);
  if (!showProgress) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  label.textContent = labelText;
  fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

let toastTimer = null;
export function toast(message, timeoutMs = 1800) {
  const t = $("toast");
  t.textContent = message;
  t.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, timeoutMs);
}

export function openModal(modalId) {
  const m = $(modalId);
  m.hidden = false;
  // basic focus management
  const focusable = m.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  focusable?.focus?.();
}

export function closeModal(modalId) {
  const m = $(modalId);
  m.hidden = true;
}
