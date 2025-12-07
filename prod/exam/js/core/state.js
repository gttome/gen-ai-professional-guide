// js/core/state.js

export const MODES = ["exam", "study", "experiment"];
export const CHAPTER_IDS = ["ch1", "ch2", "ch3", "ch4"];

export const CHAPTER_LABELS = {
  ch1: "Chapter 1",
  ch2: "Chapter 2",
  ch3: "Chapter 3",
  ch4: "Chapter 4"
};

export const EXAM_TEMPLATES = {
  full: { key: "full", label: "Full Exam", maxQuestions: null },
  quick10: { key: "quick10", label: "Quick Check (10)", maxQuestions: 10 }
};

export const EXPERIMENT_DEFAULT_CONFIG = {
  chapters: ["ch1"],
  sessionSize: 10
};

const DIFFICULTY_OVERRIDES_KEY = "examAppDifficultyOverrides_v1";
const EXPERIMENT_CONFIG_KEY = "examAppExperimentConfig_v1";

export function createInitialState(options = {}) {
  const {
    mode = "exam",
    chapterId = "ch1",
    examTemplateKey = "full",
    experimentConfig = EXPERIMENT_DEFAULT_CONFIG
  } = options;

  return {
    currentMode: mode,
    currentChapterId: chapterId,
    currentExamTemplateKey: examTemplateKey,
    sessionStates: new Map(),
    difficultyOverrides: {},
    experimentConfig: { ...EXPERIMENT_DEFAULT_CONFIG, ...experimentConfig },
    analyticsEvents: []
  };
}

export function makeSessionKey(mode, chapterId) {
  return `${mode}::${chapterId}`;
}

export function getCurrentSessionKey(state) {
  return makeSessionKey(state.currentMode, state.currentChapterId);
}

export function getSession(state, mode = state.currentMode, chapterId = state.currentChapterId) {
  const key = makeSessionKey(mode, chapterId);
  return state.sessionStates.get(key) || null;
}

export function setSession(state, mode, chapterId, session) {
  const key = makeSessionKey(mode, chapterId);
  const withKey = { key, ...session };
  state.sessionStates.set(key, withKey);
  return withKey;
}

export function createEmptySession(indices = []) {
  return {
    key: "",
    sessionId: "",
    indices: indices.slice(),
    currentIndex: 0,
    answers: {},
    reviewFlags: {},
    correctFlags: {},
    seenAt: {},
    timePerQuestionMs: {},
    explanationOpenAt: {},
    explanationDwellMs: {},
    startTimeMs: null,
    endTimeMs: null,
    totalDurationMs: 0
  };
}

export function setCurrentMode(state, mode) {
  if (!MODES.includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }
  state.currentMode = mode;
}

export function setCurrentChapter(state, chapterId) {
  if (!CHAPTER_IDS.includes(chapterId)) {
    throw new Error(`Invalid chapterId: ${chapterId}`);
  }
  state.currentChapterId = chapterId;
}

export function setExamTemplate(state, templateKey) {
  if (!EXAM_TEMPLATES[templateKey]) {
    throw new Error(`Invalid exam template: ${templateKey}`);
  }
  state.currentExamTemplateKey = templateKey;
}

export function updateDifficultyOverrides(state, overrides) {
  state.difficultyOverrides = { ...overrides };
}

export function updateExperimentConfig(state, config) {
  state.experimentConfig = {
    ...state.experimentConfig,
    ...config
  };
}

export function logEvent(state, type, data = {}) {
  state.analyticsEvents.push({
    type,
    data,
    mode: state.currentMode,
    chapterId: state.currentChapterId,
    ts: new Date().toISOString()
  });
}

export function loadDifficultyOverridesFromStorage() {
  try {
    const raw = localStorage.getItem(DIFFICULTY_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) || {} : {};
  } catch {
    return {};
  }
}

export function saveDifficultyOverridesToStorage(difficultyOverrides) {
  try {
    localStorage.setItem(
      DIFFICULTY_OVERRIDES_KEY,
      JSON.stringify(difficultyOverrides)
    );
  } catch {
    // ignore
  }
}

export function loadExperimentConfigFromStorage() {
  try {
    const raw = localStorage.getItem(EXPERIMENT_CONFIG_KEY);
    if (!raw) return { ...EXPERIMENT_DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) || {};
    return { ...EXPERIMENT_DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...EXPERIMENT_DEFAULT_CONFIG };
  }
}

export function saveExperimentConfigToStorage(config) {
  try {
    localStorage.setItem(EXPERIMENT_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}
