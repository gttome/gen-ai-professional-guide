// Infographic Gallery (Modular)
// - Loads manifest from json/data.json
// - Displays per-chapter infographic cards
// - Allows marking items "In Review" (stored in localStorage)
// - Exports "In Review" list to CSV or clipboard

const REVIEW_KEY = "infographicGalleryReview_v1";
const DATA_URL = "json/data.json";


let chapterTitles = {
  1: "Chapter 1: Foundations",
  2: "Chapter 2: Applications",
  3: "Chapter 3: Agents and Production Systems",
  4: "Chapter 4: Ethics, Safety, Business Value",
};


let imagesByChapter = { 1: [], 2: [], 3: [], 4: [] };
let currentChapter = 1;
let currentIndex = 0;
let review = new Set();
let inReviewView = false;

const chapterTabsContainer = document.getElementById("chapterTabs");
const reviewToggle = document.getElementById("reviewToggle");
const reviewToggleLabel = reviewToggle.querySelector(".label");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageSection = document.getElementById("imageSection");
const imageTitle = document.getElementById("imageTitle");
const imageDescription = document.getElementById("imageDescription");
const imageElement = document.getElementById("imageElement");
const reviewBtn = document.getElementById("reviewBtn");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const reviewCount = document.getElementById("reviewCount");
const reviewActions = document.getElementById("reviewActions");
const downloadReviewBtn = document.getElementById("downloadReviewBtn");
const copyReviewBtn = document.getElementById("copyReviewBtn");
const cardFooterHint = document.getElementById("cardFooterHint");
const toast = document.getElementById("toast");
const mobileSwipeHint = document.getElementById("mobileSwipeHint");
const cardShell = document.getElementById("cardShell");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalViewport = document.getElementById("modalViewport");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");
const openImageBtn = document.getElementById("openImageBtn");

// Modal viewer state (pan/zoom)
const viewer = {
  scale: 1,
  tx: 0,
  ty: 0,
  minScale: 1,
  maxScale: 5,
  pointers: new Map(),
  start: {
    scale: 1,
    tx: 0,
    ty: 0,
    dist: 0,
    x: 0,
    y: 0,
  },
};

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function applyViewerTransform() {
  // Translate after scale (CSS transform list applies right-to-left), so panning uses screen pixels.
  modalImage.style.transform = `translate3d(${viewer.tx}px, ${viewer.ty}px, 0) scale(${viewer.scale})`;
}

function resetViewer() {
  viewer.scale = 1;
  viewer.tx = 0;
  viewer.ty = 0;
  viewer.pointers.clear();
  applyViewerTransform();
  modalViewport.style.cursor = "grab";
}

function setScale(newScale) {
  const s = clamp(newScale, viewer.minScale, viewer.maxScale);
  viewer.scale = s;
  if (viewer.scale === 1) {
    viewer.tx = 0;
    viewer.ty = 0;
  }
  applyViewerTransform();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function saveReview() {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(Array.from(review)));
}

function loadReview() {
  const raw = localStorage.getItem(REVIEW_KEY);
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) review = new Set(arr);
  } catch (e) {
    console.warn("Failed to parse review list", e);
  }
}

function parseQuestionNumber(imageFileName) {
  // Expects: "12. Something.png" -> 12
  const m = String(imageFileName || "").trim().match(/^(\d+)\s*\./);
  return m ? Number(m[1]) : NaN;
}

function chapterTitle(chapterNumber) {
  return chapterTitles[chapterNumber] || `Chapter ${chapterNumber}`;
}


function getActiveList() {
  if (!inReviewView) return imagesByChapter[currentChapter] || [];

  const all = [];
  for (const chapter of [1, 2, 3, 4]) {
    const images = imagesByChapter[chapter] || [];
    for (const img of images) {
      if (review.has(img.id)) all.push(img);
    }
  }

  // Sort by question number to keep exports stable and navigation intuitive.
  all.sort((a, b) => {
    const na = parseQuestionNumber(a.imageFileName);
    const nb = parseQuestionNumber(b.imageFileName);
    const aBad = Number.isNaN(na);
    const bBad = Number.isNaN(nb);
    if (aBad && bBad) return String(a.imageFileName).localeCompare(String(b.imageFileName));
    if (aBad) return 1;
    if (bBad) return -1;
    return na - nb;
  });

  return all;
}

function updateChapterTabs() {
  chapterTabsContainer.innerHTML = "";
  const chapters = [
    { id: 1, label: chapterTitle(1) },
    { id: 2, label: chapterTitle(2) },
    { id: 3, label: chapterTitle(3) },
    { id: 4, label: chapterTitle(4) },
  ];

  chapters.forEach((ch) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "chapter-tab" + (ch.id === currentChapter && !inReviewView ? " active" : "");

    const parts = ch.label.split(" ");
    const mainLabel = document.createElement("span");
    mainLabel.textContent = parts[0] + " " + parts[1];
    const subLabel = document.createElement("span");
    subLabel.textContent = parts.slice(2).join(" ");

    btn.appendChild(mainLabel);
    btn.appendChild(subLabel);

    btn.addEventListener("click", () => {
      if (inReviewView) {
        inReviewView = false;
        updateReviewToggleState();
      }
      currentChapter = ch.id;
      currentIndex = 0;
      render();
    });

    chapterTabsContainer.appendChild(btn);
  });
}

function updateReviewToggleState() {
  reviewToggle.classList.toggle("active", inReviewView);
  reviewToggleLabel.textContent = inReviewView ? "Exit Review" : "View Review";
}

function updateReviewCountAndActions() {
  reviewCount.textContent = `In Review: ${review.size}`;

  const hasReview = review.size > 0;
  // Only show export controls when there is at least one item.
  reviewActions.style.display = hasReview ? "flex" : "none";
  downloadReviewBtn.disabled = !hasReview;
  copyReviewBtn.disabled = !hasReview;
}

function render() {
  const list = getActiveList();
  const total = list.length;

  updateChapterTabs();
  updateReviewToggleState();
  updateReviewCountAndActions();

  if (total === 0) {
    imageSection.textContent = inReviewView ? "No items in review" : "No images defined for this view";
    imageTitle.textContent = inReviewView ? "Mark items for review" : "No infographics available";
    imageDescription.textContent = inReviewView
      ? "Use the \"Mark Review\" button on any infographic to add it to your review list."
      : "Once images are added to this chapter, they will appear in this gallery.";

    imageElement.src = "";
    imageElement.alt = "No infographic available";

    reviewBtn.classList.add("inactive");
    reviewBtn.disabled = true;

    progressBar.style.width = "0%";
    progressLabel.textContent = "0 of 0 images";
    cardFooterHint.textContent = "";

    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= total) currentIndex = total - 1;

  const item = list[currentIndex];

  const headerLabel = inReviewView
    ? "Review view"
    : `${chapterTitle(currentChapter)}`;

  imageSection.textContent = headerLabel;
  imageTitle.textContent = item.title;
  imageDescription.textContent = item.description;

  const imageUrl = `chapter${item.chapter}/${encodeURIComponent(item.imageFileName)}`;
  imageElement.src = imageUrl;
  imageElement.alt = item.title;

  const isInReview = review.has(item.id);
  reviewBtn.classList.toggle("inactive", !isInReview);
  reviewBtn.textContent = isInReview ? "✔ In Review" : "✔ Mark Review";
  reviewBtn.disabled = false;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === total - 1;

  const progressPercentage = ((currentIndex + 1) / total) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressLabel.textContent = `${currentIndex + 1} of ${total} images`;

  cardFooterHint.textContent = "Tap the image to open a full-screen view. Swipe to move between infographics.";
}

prevBtn.addEventListener("click", () => {
  const list = getActiveList();
  if (!list.length) return;
  if (currentIndex > 0) {
    currentIndex--;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  const list = getActiveList();
  if (!list.length) return;
  if (currentIndex < list.length - 1) {
    currentIndex++;
    render();
  }
});

reviewToggle.addEventListener("click", () => {
  inReviewView = !inReviewView;
  currentIndex = 0;
  render();
});

reviewBtn.addEventListener("click", () => {
  const list = getActiveList();
  if (!list.length) return;

  const item = list[currentIndex];
  if (review.has(item.id)) {
    review.delete(item.id);
    showToast("Removed from review");
  } else {
    review.add(item.id);
    showToast("Added to review");
  }

  saveReview();
  updateReviewCountAndActions();

  if (inReviewView) {
    const newList = getActiveList();
    if (!newList.length) {
      inReviewView = false;
      currentIndex = 0;
    } else if (currentIndex >= newList.length) {
      currentIndex = newList.length - 1;
    }
  }

  render();
});

function openModal() {
  const list = getActiveList();
  if (!list.length) return;
  const item = list[currentIndex];
  const imageUrl = `chapter${item.chapter}/${encodeURIComponent(item.imageFileName)}`;
  modalImage.src = imageUrl;
  modalTitle.textContent = item.title;
  modalBackdrop.classList.add("active");
  // Prevent the underlying page from scrolling while the modal is open.
  document.body.classList.add("modal-open");
  resetViewer();
}

function closeModal() {
  modalBackdrop.classList.remove("active");
  modalImage.src = "";
  document.body.classList.remove("modal-open");
  resetViewer();
}

// Modal viewer controls
zoomInBtn.addEventListener("click", () => setScale(viewer.scale * 1.25));
zoomOutBtn.addEventListener("click", () => setScale(viewer.scale / 1.25));
zoomResetBtn.addEventListener("click", () => resetViewer());
openImageBtn.addEventListener("click", () => {
  if (!modalImage.src) return;
  window.open(modalImage.src, "_blank", "noopener");
});

// Pointer-driven pan/zoom on the modal viewport
modalViewport.addEventListener("pointerdown", (e) => {
  if (!modalBackdrop.classList.contains("active")) return;
  modalViewport.setPointerCapture(e.pointerId);
  viewer.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  // Capture starting state
  viewer.start.scale = viewer.scale;
  viewer.start.tx = viewer.tx;
  viewer.start.ty = viewer.ty;
  viewer.start.x = e.clientX;
  viewer.start.y = e.clientY;

  if (viewer.pointers.size === 2) {
    const pts = Array.from(viewer.pointers.values());
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    viewer.start.dist = Math.hypot(dx, dy) || 1;
  }

  modalViewport.style.cursor = viewer.scale > 1 ? "grabbing" : "grab";
});

modalViewport.addEventListener("pointermove", (e) => {
  if (!modalBackdrop.classList.contains("active")) return;
  if (!viewer.pointers.has(e.pointerId)) return;
  viewer.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (viewer.pointers.size === 1) {
    if (viewer.scale <= 1) return;
    const dx = e.clientX - viewer.start.x;
    const dy = e.clientY - viewer.start.y;
    viewer.tx = viewer.start.tx + dx;
    viewer.ty = viewer.start.ty + dy;
    applyViewerTransform();
    return;
  }

  if (viewer.pointers.size === 2) {
    const pts = Array.from(viewer.pointers.values());
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    const dist = Math.hypot(dx, dy) || 1;
    const ratio = dist / (viewer.start.dist || 1);
    setScale(viewer.start.scale * ratio);
  }
});

function clearPointer(pointerId) {
  viewer.pointers.delete(pointerId);
  if (viewer.pointers.size === 0) {
    modalViewport.style.cursor = viewer.scale > 1 ? "grab" : "grab";
  } else {
    // Reset start reference for the remaining pointer(s)
    const remaining = Array.from(viewer.pointers.values())[0];
    viewer.start.x = remaining.x;
    viewer.start.y = remaining.y;
    viewer.start.tx = viewer.tx;
    viewer.start.ty = viewer.ty;
    viewer.start.scale = viewer.scale;
  }
}

modalViewport.addEventListener("pointerup", (e) => clearPointer(e.pointerId));
modalViewport.addEventListener("pointercancel", (e) => clearPointer(e.pointerId));

// Mouse wheel zoom (desktop)
modalViewport.addEventListener(
  "wheel",
  (e) => {
    if (!modalBackdrop.classList.contains("active")) return;
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const factor = direction > 0 ? 1.12 : 1 / 1.12;
    setScale(viewer.scale * factor);
  },
  { passive: false }
);

imageElement.addEventListener("click", () => {
  if (!imageElement.src) return;
  openModal();
});

modalCloseBtn.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (modalBackdrop.classList.contains("active")) {
    if (event.key === "Escape") closeModal();
    return;
  }
  if (event.key === "ArrowLeft") prevBtn.click();
  else if (event.key === "ArrowRight") nextBtn.click();
});

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (!isTouchDevice) mobileSwipeHint.classList.add("hidden");

let touchStartX = null;
cardShell.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
  },
  { passive: true }
);

cardShell.addEventListener(
  "touchend",
  (e) => {
    if (touchStartX == null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartX;
    const threshold = 40;
    if (deltaX > threshold) prevBtn.click();
    else if (deltaX < -threshold) nextBtn.click();
    touchStartX = null;
  },
  { passive: true }
);

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[\n\r\t,"]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function buildReviewCsv() {
  // Collect all review items (across all chapters), sorted by question number
  const items = [];
  for (const chapter of [1, 2, 3, 4]) {
    for (const img of imagesByChapter[chapter] || []) {
      if (review.has(img.id)) items.push(img);
    }
  }

  items.sort((a, b) => {
    const na = parseQuestionNumber(a.imageFileName);
    const nb = parseQuestionNumber(b.imageFileName);
    const aBad = Number.isNaN(na);
    const bBad = Number.isNaN(nb);
    if (aBad && bBad) return String(a.imageFileName).localeCompare(String(b.imageFileName));
    if (aBad) return 1;
    if (bBad) return -1;
    return na - nb;
  });

  const header = ["questionNumber", "chapter", "section", "mappedSections", "imageFileName"]; // mappedSections == description
  const rows = [header.join(",")];

  for (const item of items) {
    const qn = parseQuestionNumber(item.imageFileName);
    rows.push(
      [
        csvEscape(Number.isNaN(qn) ? "" : qn),
        csvEscape(item.chapter),
        csvEscape(item.section),
        csvEscape(item.description),
        csvEscape(item.imageFileName),
      ].join(",")
    );
  }

  return rows.join("\n");
}

function downloadTextFile({ filename, content, mime }) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

downloadReviewBtn.addEventListener("click", () => {
  if (review.size === 0) return;
  const csv = buildReviewCsv();
  const stamp = new Date().toISOString().slice(0, 10);
  downloadTextFile({
    filename: `review-list-${stamp}.csv`,
    content: csv,
    mime: "text/csv;charset=utf-8",
  });
  showToast("Review list downloaded");
});

copyReviewBtn.addEventListener("click", async () => {
  if (review.size === 0) return;
  const csv = buildReviewCsv();
  try {
    await copyToClipboard(csv);
    showToast("Review list copied to clipboard");
  } catch (e) {
    console.error(e);
    showToast("Copy failed (browser blocked clipboard)");
  }
});

async function init() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status} ${res.statusText}`);

    const json = await res.json();

    // Optional chapter titles (e.g., "Chapter 1: Foundations")
    if (json.chapterTitles && typeof json.chapterTitles === "object") {
      const merged = { ...chapterTitles };
      for (const [k, v] of Object.entries(json.chapterTitles)) {
        const n = Number(k);
        if (Number.isFinite(n) && v) merged[n] = String(v);
      }
      chapterTitles = merged;
    }
    const chapters = json.chapters || json;

    for (const chapterNumber of [1, 2, 3, 4]) {
      const key = String(chapterNumber);
      const rawItems = (chapters && (chapters[key] || chapters[chapterNumber])) || [];

      imagesByChapter[chapterNumber] = (Array.isArray(rawItems) ? rawItems : [])
        .map((item) => {
          const imageFileName = String(item?.imageFileName ?? item?.ImageFileName ?? "").trim();
          const title = String(item?.title ?? item?.Title ?? "").trim();
          const description = String(item?.description ?? item?.Description ?? "").trim();
          const section = String(item?.section ?? item?.Section ?? "").trim();

          if (!imageFileName) return null;

          const id = `ch${chapterNumber}:${imageFileName}`;
          return { id, chapter: chapterNumber, imageFileName, title, description, section };
        })
        .filter(Boolean);

      // Ensure stable ordering in each chapter.
      imagesByChapter[chapterNumber].sort((a, b) => {
        const na = parseQuestionNumber(a.imageFileName);
        const nb = parseQuestionNumber(b.imageFileName);
        const aBad = Number.isNaN(na);
        const bBad = Number.isNaN(nb);
        if (aBad && bBad) return String(a.imageFileName).localeCompare(String(b.imageFileName));
        if (aBad) return 1;
        if (bBad) return -1;
        return na - nb;
      });
    }
  } catch (err) {
    console.error(err);
    showToast("Could not load data.json");
    imagesByChapter = { 1: [], 2: [], 3: [], 4: [] };
  }

  loadReview();
  render();
}

init();

// Contact / Feedback
const APP_NAME = "Gen AI Infographics app";
const CONTACT_EMAIL = "agilityaiwork@gmail.com";

document.getElementById("contactBtn").addEventListener("click", () => {
  const subject = encodeURIComponent(`[Feedback] ${APP_NAME}`);
  const body = encodeURIComponent(
    `Hi Agility AI,\n\nI’m using the ${APP_NAME} and wanted to share:\n\n\n(Feel free to add screenshots.)\n\nThanks!`
  );

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
