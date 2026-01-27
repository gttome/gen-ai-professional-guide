import { loadCoversManifest } from "./manifest.js";
import { saveSession, loadSession, clearSession } from "./storage.js";
import { createMetrics, recordExposure, recordPreviewOpen, recordError } from "./metrics.js";
import { $, showOnlyScreen, setProgress, toast, openModal, closeModal, show, hide } from "./ui.js";

const APP_NAME = "BookCoverTester";
const APP_VERSION = "1.2";
const EMAIL_TO = "agilityaiwork@gmail.com";

const THEME_STORAGE_KEY = "bct_theme";
const DEFAULT_THEME = "light";

const SCREENS = {
  HOME: "screenHome",
  SHORTLIST: "screenShortlist",
  TOP3: "screenTop3",
  SUBMIT: "screenSubmit",
  CONFIRM_SENT: "screenConfirmSent",
  SUCCESS: "screenSuccess",
};

const STEPS = {
  HOME: "home",
  SHORTLIST: "shortlist",
  REVIEW: "review",
  TOP3: "top3",
  SUBMIT: "submit",
  CONFIRM_SENT: "confirm_sent",
  SUCCESS: "success",
};

let covers = [];                // array of cover objects from manifest
let coverById = {};             // imageId -> cover
let session = null;             // current session state (no respondent PII persisted)
let activeRankIndex = 0;         // Top 3 active slot (0=Favorite,1=#2,2=#3)

function coverLabel(imageId) {
  const id = String(imageId || "");
  const c = coverById?.[id];
  return c?.label || (id ? `Cover ${id}` : "(unknown)");
}

init().catch((err) => {
  console.error(err);
  try { toast("Failed to initialize. See console."); } catch {}
});

async function init() {
  wireGlobalUI();
  initTheme();

  // Load manifest first (hard requirement)
  covers = await loadCoversManifest();
  coverById = Object.fromEntries(covers.map(c => [c.imageId, c]));

  // Try resume
  const prior = loadSession();
  if (prior && prior.sessionId && prior.step && prior.coversOrder?.length === 25) {
    session = hydrateSession(prior);
    $("resumeBtn").hidden = false;
  }

  renderHome();
}

function wireGlobalUI() {
  // Count taps (basic interactions)
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!session?.metrics) return;
    const isInteractive = t.closest?.("button,.pill,.text-btn,.icon-btn");
    if (isInteractive) session.metrics.counts.taps += 1;
  }, { capture: true });

  // Delegated preview buttons (e.g., Success screen)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-preview]");
    if (!btn) return;
    const id = btn.getAttribute("data-preview");
    if (id && session) openPreview(id);
  });


  $("infoBtn").addEventListener("click", () => openModal("privacyModal"));
  $("privacyOkBtn").addEventListener("click", () => closeModal("privacyModal"));
  $("privacyCloseBtn").addEventListener("click", () => closeModal("privacyModal"));
  $("privacyBackdrop").addEventListener("click", () => closeModal("privacyModal"));

  $("previewCloseBtn").addEventListener("click", closePreview);
  $("previewBackdrop").addEventListener("click", closePreview);

  $("exitBtn").addEventListener("click", () => {
    if (!session) { renderHome(); return; }
    session.metrics.dropOffStep = session.step;
    persist();
    renderHome();
  });

  // Theme toggle (light/dark)
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  $("startBtn").addEventListener("click", () => startNewSession());
  $("resumeBtn").addEventListener("click", () => resumeSession());
}

function renderHome() {
  $("stepLabel").textContent = "";
  hide($("exitBtn"));
  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: false,
    labelText: "",
    percent: 0,
  });
  showOnlyScreen(SCREENS.HOME);

  $("resumeBtn").hidden = !(loadSession());
}

function startNewSession() {
  const nowIso = new Date().toISOString();
  session = {
    app: APP_NAME,
    version: APP_VERSION,
    sessionId: cryptoRandomId(),
    startedAt: nowIso,
    step: STEPS.SHORTLIST,
    // Release 1: deterministic sets (1–5, 6–10, 11–15, 16–20, 21–25)
    coversOrder: [...covers.map(c => c.imageId)],
    shortlistSetIndex: 0,
    shortlistMarks: [],
    undoStack: [],
    top3: [null, null, null],
    metrics: createMetrics({ sessionId: null, startedAt: nowIso }),
    lastSubmissionText: null,
  };
  session.metrics.sessionId = session.sessionId;

  persist();
  renderShortlist();
}

function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = (stored === "dark" || stored === "light") ? stored : DEFAULT_THEME;
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = theme === "light" ? "Dark" : "Light";
}

function resumeSession() {
  const prior = loadSession();
  if (!prior) { toast("No session to resume."); return; }
  session = hydrateSession(prior);
  routeToStep(session.step);
}

function hydrateSession(raw) {
  const s = structuredClone(raw);
  // Ensure required fields exist
  if (!s.metrics) s.metrics = createMetrics({ sessionId: s.sessionId, startedAt: s.startedAt });
  if (!Array.isArray(s.shortlistMarks)) s.shortlistMarks = [];
  if (!Array.isArray(s.top3)) s.top3 = [null, null, null];
  if (!Array.isArray(s.coversOrder) || s.coversOrder.length !== 25) s.coversOrder = covers.map(c => c.imageId);
  if (typeof s.shortlistSetIndex !== "number") s.shortlistSetIndex = 0;
  if (!Array.isArray(s.undoStack)) s.undoStack = [];
  if (!s.step) s.step = STEPS.HOME;
  return s;
}

function routeToStep(step) {
  switch (step) {
    case STEPS.SHORTLIST: return renderShortlist();
    case STEPS.REVIEW: return renderTop3(); // legacy: review screen removed
    case STEPS.TOP3: return renderTop3();
    case STEPS.SUBMIT: return renderSubmit();
    case STEPS.CONFIRM_SENT: return renderConfirmSent();
    case STEPS.SUCCESS: return renderSuccess();
    default: return renderHome();
  }
}

function renderShortlist() {
  session.step = STEPS.SHORTLIST;
  show($("exitBtn"));
  const totalSets = 5;
  const setIndex = session.shortlistSetIndex;
  const setNumber = setIndex + 1;

  const ids = session.coversOrder.slice(setIndex * 5, (setIndex + 1) * 5);
  const pickedCount = countMarkedInSet(ids);

  $("stepLabel").textContent = `Set ${setNumber}/${totalSets}`;
  $("shortlistInstruction").textContent = `Tap one cover to represent this set. Picked: ${pickedCount}/1.`;

  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: true,
    labelText: `Set ${setNumber} of ${totalSets} • Picked ${pickedCount}/1`,
    percent: (setNumber / totalSets) * 55, // shortlist is ~55% of flow
  });

  const grid = $("shortlistGrid");
  grid.innerHTML = "";
  session.metrics.setsViewed = Math.max(session.metrics.setsViewed, setNumber);

  for (const imageId of ids) {
    recordExposure(session.metrics, imageId);
    grid.appendChild(renderCoverCard({
      imageId,
      variant: "shortlist",
      marked: session.shortlistMarks.includes(imageId),
      rank: getRankFor(imageId),
      toggleLabel: session.shortlistMarks.includes(imageId) ? "Selected" : "Select",
      onToggle: () => toggleMarkInSet(imageId, ids),
      onPreview: () => openPreview(imageId),
    }));
  }

  // Buttons
  $("undoBtn").textContent = "Undo";
  $("undoBtn").disabled = session.undoStack.length === 0;
  $("undoBtn").onclick = () => undoLastMark(ids);

  $("nextSetBtn").textContent = (session.shortlistSetIndex < 4) ? "Next set" : "Choose Top 3";
  $("nextSetBtn").onclick = () => {
    // Must have exactly 1 selected in this set
    if (countMarkedInSet(ids) !== 1) {
      toast("Pick 1 cover to continue.");
      return;
    }
    session.undoStack = [];
    if (session.shortlistSetIndex < 4) {
      session.shortlistSetIndex += 1;
      persist();
      renderShortlist();
    } else {
      // done (exactly 5 picks)
      session.metrics.shortlistCount = session.shortlistMarks.length;
      session.top3 = [null, null, null];
      session.step = STEPS.TOP3;
      activeRankIndex = 0;
      persist();
      renderTop3();
    }
  };

  updateNextButton(ids);

  showOnlyScreen(SCREENS.SHORTLIST);
}

function renderReview() {
  // Legacy alias: the standalone Review screen was removed (Release X1 simplification).
  // If an older saved session routes here, continue directly to Top 3 ranking.
  session.step = STEPS.TOP3;
  persist();
  renderTop3();
}

function renderTop3() {
  session.step = STEPS.TOP3;
  sanitizeTop3();
  $("stepLabel").textContent = "Top 3";
  show($("exitBtn"));

  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: true,
    labelText: "Choose Top 3",
    percent: 80,
  });

  // Default active slot only if none is set (or out of range).
  if (typeof activeRankIndex !== "number" || activeRankIndex < 0 || activeRankIndex > 2) {
    const firstEmpty = session.top3.indexOf(null);
    activeRankIndex = firstEmpty >= 0 ? firstEmpty : 0;
  }

  const grid = $("top3Grid");
  grid.innerHTML = "";

  const ids = getPerSetSelections().filter(x => x.imageId).map(x => x.imageId);
  const activeName = activeRankIndex === 0 ? "Favorite" : `Rank ${activeRankIndex + 1}`;

  for (const imageId of ids) {
    recordExposure(session.metrics, imageId);
    const rank = getRankFor(imageId);
    const marked = rank != null;

    let toggleLabel;
    if (rank === (activeRankIndex + 1)) {
      toggleLabel = "Clear";
    } else if (rank) {
      toggleLabel = `Move to ${activeName}`;
    } else {
      toggleLabel = `Set as ${activeName}`;
    }

    grid.appendChild(renderCoverCard({
      imageId,
      variant: "top3",
      marked,
      rank,
      toggleLabel,
      onToggle: () => toggleTop3(imageId),
      onPreview: () => openPreview(imageId),
    }));
  }

  wireTop3Slots();
  updateTop3Controls();

  $("resetTop3Btn").onclick = () => {
    session.metrics.counts.top3Changes += 1;
    session.top3 = [null, null, null];
    activeRankIndex = 0;
    persist();
    renderTop3();
  };

  $("top3BackBtn").onclick = () => {
    // Edit picks: return to shortlist flow (Set 1 of 5)
    session.shortlistSetIndex = 0;
    session.step = STEPS.SHORTLIST;
    persist();
    renderShortlist();
  };

  $("toSubmitBtn").onclick = () => {
    if (!isTop3Complete()) {
      toast("Choose Favorite (#1), Rank 2, and Rank 3 to continue.");
      return;
    }
    session.step = STEPS.SUBMIT;
    persist();
    renderSubmit();
  };

  showOnlyScreen(SCREENS.TOP3);
}

function renderSubmit() {
  session.step = STEPS.SUBMIT;
  $("stepLabel").textContent = "Submit";
  show($("exitBtn"));

  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: true,
    labelText: "Submit",
    percent: 95,
  });

  // Render selection summary (human-friendly)
  $("submitFavorite").textContent = `Favorite (#1): ${coverLabel(session.top3[0])}`;
  $("submitTop3").textContent = `Top 3: 1) ${coverLabel(session.top3[0])}   2) ${coverLabel(session.top3[1])}   3) ${coverLabel(session.top3[2])}`;

  const nameEl = $("nameInput");
  const emailEl = $("emailInput");
  nameEl.value = "";
  emailEl.value = "";

  const validate = () => {
    const ok = isTop3Complete() && isValidName(nameEl.value) && isValidEmail(emailEl.value);
    $("openEmailBtn").disabled = !ok;
    $("copyTextBtn").disabled = !ok;
  };

  nameEl.oninput = validate;
  emailEl.oninput = validate;


  $("submitBackBtn").onclick = () => {
    session.step = STEPS.TOP3;
    persist();
    renderTop3();
  };

  $("openEmailBtn").onclick = async () => {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    if (!isValidName(name) || !isValidEmail(email) || !isTop3Complete()) return;

    try {
      const { subject, body, jsonPayload, bodyText } = buildSubmission({ name, email });
      session.lastSubmissionText = bodyText;

      session.metrics.submission.attempts += 1;
      session.metrics.submission.mailtoOpenedAt = new Date().toISOString();

      // Trigger mailto
      const url = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;

      persist();
      session.step = STEPS.CONFIRM_SENT;
      renderConfirmSent();
    } catch (err) {
      recordError(session.metrics, "mailto_open_failed", err?.message || err);
      toast("Could not open email draft. Use Copy Submission Text.");
      persist();
    }
  };

  $("copyTextBtn").onclick = async () => {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    if (!isValidName(name) || !isValidEmail(email) || !isTop3Complete()) return;

    try {
      const { bodyText } = buildSubmission({ name, email });
      session.lastSubmissionText = bodyText;
      await copyToClipboard(bodyText);
      session.metrics.submission.copiedToClipboard = true;
      toast("Copied submission text.");
      persist();
      session.step = STEPS.CONFIRM_SENT;
      renderConfirmSent();
    } catch (err) {
      recordError(session.metrics, "clipboard_failed", err?.message || err);
      toast("Copy failed. Try again.");
      persist();
    }
  };

  validate();
  showOnlyScreen(SCREENS.SUBMIT);
}

function renderConfirmSent() {
  session.step = STEPS.CONFIRM_SENT;
  $("stepLabel").textContent = "Confirm";
  show($("exitBtn"));

  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: true,
    labelText: "Confirm sent",
    percent: 98,
  });

  $("confirmYesBtn").onclick = () => {
    session.metrics.submission.userConfirmedSent = true;
    session.metrics.submission.confirmedAt = new Date().toISOString();
    session.step = STEPS.SUCCESS;
    persist();
    renderSuccess();
  };

  $("confirmNoBtn").onclick = () => {
    session.metrics.submission.userConfirmedSent = false;
    session.metrics.submission.confirmedAt = new Date().toISOString();
    session.step = STEPS.SUBMIT;
    persist();
    renderSubmit();
  };

  showOnlyScreen(SCREENS.CONFIRM_SENT);
}

function renderSuccess() {
  session.step = STEPS.SUCCESS;
  $("stepLabel").textContent = "Success";
  show($("exitBtn"));

  setProgress({
    wrapId: "progressWrap",
    labelId: "progressLabel",
    fillId: "progressFill",
    showProgress: true,
    labelText: "Complete",
    percent: 100,
  });

  const favId = session.top3[0];
  const favCover = coverById[favId];
  $("successFavorite").innerHTML = renderSuccessThumb(favCover, "Favorite (#1)");

  const top3Html = session.top3
    .map((id, idx) => {
      const c = coverById[id];
      return renderSuccessThumb(c, `#${idx + 1}`);
    })
    .join("");
  $("successTop3").innerHTML = top3Html;

  $("startOverBtn").onclick = () => {
    clearSession();
    session = null;
    renderHome();
  };

  $("copyAgainBtn").onclick = async () => {
    if (!session?.lastSubmissionText) {
      toast("No submission text available yet.");
      return;
    }
    try {
      await copyToClipboard(session.lastSubmissionText);
      toast("Copied submission text.");
    } catch {
      toast("Copy failed.");
    }
  };

  showOnlyScreen(SCREENS.SUCCESS);
}

function renderSuccessThumb(cover, label) {
  if (!cover) return "";
  return `
    <div class="cover-card" style="overflow:hidden">
      <div class="cover-media">
        <span class="badge">${escapeHtml(label)}</span>
        <img src="${escapeAttr(cover.thumb600)}" alt="${escapeAttr(cover.label)}" loading="lazy" />
      </div>
      <div class="cover-actions">
        <div class="cover-label">${escapeHtml(cover.label)}</div>
        <button class="pill" type="button" data-preview="${escapeAttr(cover.imageId)}">Preview</button>
      </div>
    </div>
  `;
}

function renderCoverCard({ imageId, variant, marked, rank, toggleLabel, onToggle, onPreview }) {
  const cover = coverById[imageId];
  const el = document.createElement("div");
  el.className = "cover-card" + (marked ? " selected" : "");
  el.setAttribute("role", "listitem");

  const badge = (rank)
    ? `<span class="badge">${rank === 1 ? "Favorite" : "#" + rank}</span>`
    : (variant === "shortlist" && marked ? `<span class="badge">Selected</span>` : "");

  const toggleText = toggleLabel ?? (
    variant === "top3"
      ? (marked ? "Clear" : "Set")
      : (marked ? "Selected" : "Select")
  );

  el.innerHTML = `
    <div class="cover-media">
      ${badge}
      <img src="${escapeAttr(cover.thumb300)}"
           srcset="${escapeAttr(cover.thumb300)} 300w, ${escapeAttr(cover.thumb600)} 600w, ${escapeAttr(cover.thumb1000)} 1000w"
           sizes="(max-width: 480px) 45vw, 220px"
           alt="${escapeAttr(cover.label)}"
           loading="lazy" />
    </div>
    <div class="cover-actions">
      <div class="cover-label">${escapeHtml(cover.label)}</div>
      <button class="pill" type="button" data-action="preview">Preview</button>
      <button class="pill ${marked ? "primary" : ""}" type="button" data-action="toggle">
        ${escapeHtml(toggleText)}
      </button>
    </div>
  `;

  // Mobile-first ergonomics: tapping the image selects/assigns.
  el.querySelector(".cover-media").addEventListener("click", (e) => {
    // Avoid accidental selection when clicking badges.
    if (e.target?.closest?.(".badge")) return;
    onToggle?.();
  });

  el.querySelector("[data-action='toggle']").addEventListener("click", onToggle);
  el.querySelector("[data-action='preview']").addEventListener("click", onPreview);

  return el;
}

function toggleMarkInSet(imageId, setIds) {
  // Release 1 flow: user selects exactly 1 cover per 5-cover set.
  const prevSelected = session.shortlistMarks.find(id => setIds.includes(id)) || null;
  const isSame = prevSelected === imageId;

  session.undoStack.push({ prevId: prevSelected, newId: isSame ? null : imageId });
  session.metrics.counts.marksToggled += 1;

  // Remove any prior selection in this set
  session.shortlistMarks = session.shortlistMarks.filter(id => !setIds.includes(id));

  // If user tapped the already-selected cover, allow de-select (forces re-pick before Next)
  if (!isSame) session.shortlistMarks.push(imageId);

  persist();
  renderShortlist();
}

function undoLastMark(setIds) {
  if (!session.undoStack.length) return;
  const last = session.undoStack.pop();
  session.metrics.counts.undoUsed += 1;

  // Revert selection for this set
  session.shortlistMarks = session.shortlistMarks.filter(id => !setIds.includes(id));
  if (last?.prevId) session.shortlistMarks.push(last.prevId);

  persist();
  renderShortlist();
}

function countMarkedInSet(setIds) {
  const set = new Set(setIds);
  return session.shortlistMarks.filter(id => set.has(id)).length;
}

function updateNextButton(setIds) {
  const nextBtn = $("nextSetBtn");
  nextBtn.disabled = countMarkedInSet(setIds) !== 1;
}

function getPerSetSelections() {
  const picks = [];
  for (let setIndex = 0; setIndex < 5; setIndex += 1) {
    const ids = session.coversOrder.slice(setIndex * 5, (setIndex + 1) * 5);
    const imageId = session.shortlistMarks.find(id => ids.includes(id)) || null;
    picks.push({ setIndex, setNumber: setIndex + 1, ids, imageId });
  }
  return picks;
}

function renderReviewPickCard(pick) {
  const cover = coverById[pick.imageId];
  const rank = getRankFor(pick.imageId);
  const rankLabel = rank === 1 ? "Favorite" : (rank ? "#" + rank : "");

  const el = document.createElement("div");
  el.className = "cover-card" + (rank ? " selected" : "");
  el.setAttribute("role", "listitem");

  el.innerHTML = `
    <div class="cover-media">
      <span class="badge">Set ${pick.setNumber}</span>
      ${rank ? `<span class="badge right ${rank === 1 ? "warn" : ""}">${rankLabel}</span>` : ""}
      <img src="${escapeAttr(cover.thumb300)}"
           srcset="${escapeAttr(cover.thumb300)} 300w, ${escapeAttr(cover.thumb600)} 600w, ${escapeAttr(cover.thumb1000)} 1000w"
           sizes="(max-width: 480px) 45vw, 220px"
           alt="${escapeAttr(cover.label)}"
           loading="lazy" />
    </div>
    <div class="cover-actions">
      <div class="cover-label">${escapeHtml(cover.label)}</div>
      <button class="pill" type="button" data-action="preview">Preview</button>
    </div>
  `;

  el.querySelector("[data-action='preview']").addEventListener("click", () => openPreview(pick.imageId));

  return el;
}

function sanitizeTop3() {
  const candidates = new Set(getPerSetSelections().filter(x => x.imageId).map(x => x.imageId));
  const seen = new Set();
  session.top3 = session.top3.map((id) => {
    if (!id || !candidates.has(id) || seen.has(id)) return null;
    seen.add(id);
    return id;
  });
  compactTop3();
}

function toggleTop3(imageId) {
  session.metrics.counts.top3Changes += 1;

  // Assign into the active slot (Favorite/#2/#3). Ensures uniqueness.
  const existingIdx = session.top3.indexOf(imageId);

  if (existingIdx === activeRankIndex) {
    // Clear active slot
    session.top3[activeRankIndex] = null;
  } else if (existingIdx >= 0) {
    // Swap with active slot
    const tmp = session.top3[activeRankIndex];
    session.top3[activeRankIndex] = session.top3[existingIdx];
    session.top3[existingIdx] = tmp;
  } else {
    // Set into active slot (replaces whatever was there)
    session.top3[activeRankIndex] = imageId;
  }

  // Remove any accidental duplicates while preserving slot meaning.
  const seen = new Set();
  session.top3 = session.top3.map((id) => {
    if (!id) return null;
    if (seen.has(id)) return null;
    seen.add(id);
    return id;
  });
  compactTop3();

  // Move active slot to the next empty (if any)
  const nextEmpty = session.top3.indexOf(null);
  if (nextEmpty >= 0) activeRankIndex = nextEmpty;

  persist();
  renderTop3();
}

function compactTop3() {
  const base = Array.isArray(session.top3) ? session.top3.slice(0, 3) : [];
  while (base.length < 3) base.push(null);
  session.top3 = base.map((id) => (id ? String(id) : null));

  // Ensure uniqueness without shifting slot positions.
  const seen = new Set();
  session.top3 = session.top3.map((id) => {
    if (!id) return null;
    if (seen.has(id)) return null;
    seen.add(id);
    return id;
  });
}

function getRankFor(imageId) {
  const idx = session?.top3?.indexOf(imageId) ?? -1;
  return idx >= 0 ? idx + 1 : null;
}

function wireTop3Slots() {
  const slotCards = [$("slotCard1"), $("slotCard2"), $("slotCard3")];

  slotCards.forEach((el, idx) => {
    if (!el) return;
    el.onclick = () => {
      activeRankIndex = idx;
      persist();
      renderTop3();
    };
    el.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activeRankIndex = idx;
        persist();
        renderTop3();
      }
    };
  });

  $("slot1Clear").onclick = (e) => { e?.stopPropagation?.(); clearTop3Slot(0); };
  $("slot2Clear").onclick = (e) => { e?.stopPropagation?.(); clearTop3Slot(1); };
  $("slot3Clear").onclick = (e) => { e?.stopPropagation?.(); clearTop3Slot(2); };
}

function updateTop3Controls() {
  const label = (id) => (id ? (coverById[id]?.label || id) : "Not selected");

  $("slot1").textContent = label(session.top3[0]);
  $("slot2").textContent = label(session.top3[1]);
  $("slot3").textContent = label(session.top3[2]);

  const slotCards = [$("slotCard1"), $("slotCard2"), $("slotCard3")];
  slotCards.forEach((el, idx) => {
    if (!el) return;
    el.classList.toggle("active", idx === activeRankIndex);
  });

  $("slot1Clear").disabled = !session.top3[0];
  $("slot2Clear").disabled = !session.top3[1];
  $("slot3Clear").disabled = !session.top3[2];

  const activeName = activeRankIndex === 0 ? "Favorite" : `Rank ${activeRankIndex + 1}`;
  $("top3Hint").textContent = `Active: ${activeName}. Tap a cover to assign.`;

  $("toSubmitBtn").disabled = !isTop3Complete();
}

function swapTop3(a, b) {
  if (!session.top3[a] || !session.top3[b]) return;
  const tmp = session.top3[a];
  session.top3[a] = session.top3[b];
  session.top3[b] = tmp;
  persist();
  renderTop3();
}

function clearTop3Slot(idx) {
  if (!session.top3[idx]) return;
  session.top3[idx] = null;
  compactTop3();
  persist();
  renderTop3();
}

function isTop3Complete() {
  return session.top3.every(Boolean) && new Set(session.top3).size === 3;
}

function isValidName(name) {
  const n = String(name || "").trim();
  // Optional: allow blank. If provided, require a minimal length for usefulness.
  return n.length === 0 || n.length >= 2;
}

function isValidEmail(email) {
  const e = String(email || "").trim();
  // Optional: allow blank. If provided, basic sanity validation.
  return e.length === 0 || (e.includes("@") && e.includes(".") && e.length <= 254);
}

function buildSubmission({ name, email }) {
  const submittedAt = new Date().toISOString();
  const timeToCompleteSeconds = Math.max(1, Math.round((Date.parse(submittedAt) - Date.parse(session.startedAt)) / 1000));

  const payload = {
    app: APP_NAME,
    version: APP_VERSION,
    respondent: { name: name || "", email: email || "" },
    startedAt: session.startedAt,
    submittedAt,
    results: {
      favorite: { imageId: session.top3[0] },
      top3: [
        { rank: 1, imageId: session.top3[0] },
        { rank: 2, imageId: session.top3[1] },
        { rank: 3, imageId: session.top3[2] },
      ],
    },
    metrics: {
      sessionId: session.sessionId,
      method: session.metrics.method,
      setsViewed: session.metrics.setsViewed,
      shortlistCount: session.shortlistMarks.length,
      imagesExpandedCount: session.metrics.imagesExpandedCount,
      comparisonsMade: session.metrics.comparisonsMade,
      timeToCompleteSeconds,
      device: session.metrics.device,
      counts: session.metrics.counts,
      exposures: session.metrics.exposures,
      fullResOpens: session.metrics.fullResOpens,
      submission: session.metrics.submission,
      dropOffStep: null,
      errors: session.metrics.errors,
    },
  };

  // Cache a compact JSON string for body length safety
  const jsonPayload = JSON.stringify(payload);
  const bodyText = formatEmailBody({ name, email, payload, jsonPayload });

  // Keep the human summary short and structured; JSON is delimited for parsing
  const subject = `Book Cover Test Submission — ${session.sessionId}`;
  const body = bodyText;

  return { subject, body, payload, jsonPayload, bodyText };
}

function formatEmailBody({ name, email, payload, jsonPayload }) {
  const fav = payload.results.favorite.imageId;
  const t3 = payload.results.top3.map(x => `${x.rank}) ${coverLabel(x.imageId)}`).join("   ");

  const n = String(name || "").trim();
  const e = String(email || "").trim();
  const respondentLine = e ? `Respondent: ${n || "(not provided)"} <${e}>` : `Respondent: ${n || "(not provided)"}`;

  return [
    `Gen AI Prompt Companion — Cover Images`,
    respondentLine,
    `Favorite: ${coverLabel(fav)}`,
    `Top 3: ${t3}`,
    ``,
    `---BEGIN_JSON---`,
    jsonPayload,
    `---END_JSON---`,
    ``,
  ].join("\n");
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("Copy command failed");
}

function openPreview(imageId) {
  const c = coverById[imageId];
  if (!c) return;

  try {
    recordPreviewOpen(session.metrics, imageId);
  } catch {}

  $("previewTitle").textContent = c.label || c.imageId;
  $("previewImg").src = c.full || c.thumb1000 || c.thumb600;
  $("previewImg").alt = c.label;
  $("previewCaption").textContent = "Pinch/zoom supported by your browser. Tap outside to close.";
  openModal("previewModal");
  persist();
}

function closePreview() {
  closeModal("previewModal");
  $("previewImg").src = "";
  $("previewImg").alt = "";
}

function persist() {
  if (!session) return;

  // Do not persist respondent PII. (Name/email are collected at submit only.)
  const safe = structuredClone(session);
  // lastSubmissionText includes PII; keep it in-memory only
  safe.lastSubmissionText = null;

  saveSession(safe);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cryptoRandomId() {
  try {
    return crypto.randomUUID();
  } catch {
    // fallback
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

// Persist on unload (best-effort)
window.addEventListener("beforeunload", () => {
  try {
    if (session && session.step !== STEPS.SUCCESS) persist();
  } catch {}
});
