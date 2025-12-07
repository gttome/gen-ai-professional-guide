// js/core/quizEngine.js
import {
  EXAM_TEMPLATES,
  createEmptySession,
  getSession,
  setSession,
  makeSessionKey
} from "./state.js";

// --- Helpers ----------------------------------------------------------

export function getChapterIdFromQuestion(q) {
  if (q.chapterId && typeof q.chapterId === "string") {
    return q.chapterId;
  }
  if (typeof q.id === "string") {
    if (q.id.startsWith("ch2-")) return "ch2";
    if (q.id.startsWith("ch3-")) return "ch3";
    if (q.id.startsWith("ch4-")) return "ch4";
  }
  if (typeof q.id === "number") {
    // Default: numeric IDs are Chapter 1
    return "ch1";
  }
  return "ch1";
}

export function getQuestionsForChapter(questions, chapterId) {
  return questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => getChapterIdFromQuestion(q) === chapterId);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Session lifecycle -----------------------------------------------

export function ensureSessionInitialized(state, questions) {
  let session = getSession(state);
  if (session && Array.isArray(session.indices) && session.indices.length > 0) {
    return session;
  }

  const {
    currentMode,
    currentChapterId,
    currentExamTemplateKey,
    experimentConfig
  } = state;

  let indices = [];

  if (currentMode === "experiment") {
    const effectiveConfig = experimentConfig || {};
    const chapters =
      Array.isArray(effectiveConfig.chapters) && effectiveConfig.chapters.length
        ? effectiveConfig.chapters
        : [currentChapterId];
    const sessionSize =
      typeof effectiveConfig.sessionSize === "number"
        ? effectiveConfig.sessionSize
        : 10;

    const pool = [];
    chapters.forEach((chId) => {
      const entries = getQuestionsForChapter(questions, chId);
      entries.forEach((entry) => pool.push(entry.idx));
    });

    if (!pool.length) {
      const emptySession = createEmptySession([]);
      const key = makeSessionKey(currentMode, currentChapterId);
      emptySession.key = key;
      emptySession.sessionId = `${key}::empty::${Date.now()}`;
      return setSession(state, currentMode, currentChapterId, emptySession);
    }

    shuffleArray(pool);
    indices = pool.slice(0, sessionSize);

  } else {
    const entries = getQuestionsForChapter(questions, currentChapterId);
    indices = entries.map((e) => e.idx);

    // Apply exam template ONLY in study mode (exam is always full-length)
    if (currentMode === "study") {
      const template = EXAM_TEMPLATES[currentExamTemplateKey];
      if (
        template &&
        typeof template.maxQuestions === "number" &&
        template.maxQuestions > 0 &&
        template.maxQuestions < indices.length
      ) {
        indices = indices.slice(0, template.maxQuestions);
      }
    }

    shuffleArray(indices);
  }
  const newSession = createEmptySession(indices);
  const key = makeSessionKey(currentMode, currentChapterId);
  newSession.key = key;
  newSession.sessionId = `${key}::${Date.now()}`;
  return setSession(state, currentMode, currentChapterId, newSession);
}

export function buildExperimentSession(state, questions) {
  const { currentMode, currentChapterId, experimentConfig } = state;

  const effectiveConfig = experimentConfig || {};
  const chapters =
    Array.isArray(effectiveConfig.chapters) && effectiveConfig.chapters.length
      ? effectiveConfig.chapters
      : [currentChapterId];
  const sessionSize =
    typeof effectiveConfig.sessionSize === "number"
      ? effectiveConfig.sessionSize
      : 10;

  const pool = [];
  chapters.forEach((chId) => {
    const entries = getQuestionsForChapter(questions, chId);
    entries.forEach((entry) => pool.push(entry.idx));
  });

  if (!pool.length) {
    const emptySession = createEmptySession([]);
    const key = makeSessionKey(currentMode, currentChapterId);
    emptySession.key = key;
    emptySession.sessionId = `${key}::empty::${Date.now()}`;
    return setSession(state, currentMode, currentChapterId, emptySession);
  }

  shuffleArray(pool);
  const indices = pool.slice(0, sessionSize);
  const newSession = createEmptySession(indices);
  const key = makeSessionKey(currentMode, currentChapterId);
  newSession.key = key;
  newSession.sessionId = `${key}::${Date.now()}`;
  return setSession(state, currentMode, currentChapterId, newSession);
}


export function getCurrentQuestionViewModel(state, questions) {
  const session = ensureSessionInitialized(state, questions);
  const indices = session.indices || [];

  if (!indices.length) {
    return {
      session,
      hasQuestion: false
    };
  }

  const indexInSession = session.currentIndex || 0;
  const totalQuestions = indices.length;
  const globalIndex = indices[indexInSession];
  const question = questions[globalIndex];
  if (!question) {
    return {
      session,
      hasQuestion: false
    };
  }

  const answers = session.answers || {};
  const correctFlags = session.correctFlags || {};
  const reviewFlags = session.reviewFlags || {};

  const answerKey =
    Object.prototype.hasOwnProperty.call(answers, question.id) &&
    answers[question.id] != null
      ? answers[question.id]
      : null;

  const isSubmitted = Object.prototype.hasOwnProperty.call(
    correctFlags,
    question.id
  );
  const isCorrect = isSubmitted ? !!correctFlags[question.id] : null;
  const isFlagged = !!reviewFlags[question.id];
  const flaggedPositions = [];
  const indicesForFlags = session.indices || [];
  indicesForFlags.forEach((idxInQuestions, pos) => {
    const q2 = questions[idxInQuestions];
    if (!q2) return;
    if (reviewFlags[q2.id]) {
      flaggedPositions.push(pos);
    }
  });


  return {
    session,
    hasQuestion: true,
    indexInSession,
    totalQuestions,
    question,
    answerKey,
    isSubmitted,
    isCorrect,
    isFlagged,
    flaggedPositions
  };
}

// --- Navigation & answering ------------------------------------------

export function selectAnswerForCurrentQuestion(state, questions, optionKey) {
  const vm = getCurrentQuestionViewModel(state, questions);
  if (!vm.hasQuestion) return vm;

  const { session, question } = vm;
  if (!session.answers) session.answers = {};
  session.answers[question.id] = optionKey;

  return getCurrentQuestionViewModel(state, questions);
}

export function checkAnswerForCurrentQuestion(state, questions) {
  const vm = getCurrentQuestionViewModel(state, questions);
  if (!vm.hasQuestion) return vm;

  const { session, question, answerKey } = vm;
  if (!session.correctFlags) session.correctFlags = {};

  const isCorrect = answerKey === question.correctOptionKey;
  session.correctFlags[question.id] = isCorrect;

  return getCurrentQuestionViewModel(state, questions);
}

export function goToNextQuestion(state, questions) {
  const session = ensureSessionInitialized(state, questions);
  if (session.currentIndex < session.indices.length - 1) {
    session.currentIndex += 1;
  }
  return getCurrentQuestionViewModel(state, questions);
}

export function goToPrevQuestion(state, questions) {
  const session = ensureSessionInitialized(state, questions);
  if (session.currentIndex > 0) {
    session.currentIndex -= 1;
  }
  return getCurrentQuestionViewModel(state, questions);
}

// --- Results & metrics ------------------------------------------------

export function computeSessionResults(state, questions) {
  const session = ensureSessionInitialized(state, questions);
  const indices = session.indices || [];
  const answers = session.answers || {};
  const correctFlags = session.correctFlags || {};

  let answered = 0;
  let correct = 0;

  indices.forEach((idx) => {
    const q = questions[idx];
    if (!q) return;
    const hasAnswer = Object.prototype.hasOwnProperty.call(answers, q.id);
    if (hasAnswer) {
      answered += 1;
      if (correctFlags[q.id]) correct += 1;
    }
  });

  const totalQuestions = indices.length;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    answered,
    correct,
    scorePercent
  };
}

export function computeReviewMetrics(state, questions) {
  const session = getSession(state);
  if (!session || !session.indices || !session.indices.length) {
    return null;
  }

  const indices = session.indices || [];
  const reviewFlags = session.reviewFlags || {};
  const answers = session.answers || {};

  let flaggedCount = 0;
  let flaggedAnswered = 0;
  let flaggedCorrect = 0;

  let nonFlaggedAnswered = 0;
  let nonFlaggedCorrect = 0;

  indices.forEach((idx) => {
    const q = questions[idx];
    if (!q) return;
    const qid = q.id;
    const ans = answers[qid];
    const isFlagged = !!reviewFlags[qid];

    if (isFlagged) {
      flaggedCount++;
      if (ans) {
        flaggedAnswered++;
        if (ans === q.correctOptionKey) flaggedCorrect++;
      }
    } else {
      if (ans) {
        nonFlaggedAnswered++;
        if (ans === q.correctOptionKey) nonFlaggedCorrect++;
      }
    }
  });

  return {
    flaggedCount,
    flaggedAnswered,
    flaggedCorrect,
    nonFlaggedAnswered,
    nonFlaggedCorrect
  };
}