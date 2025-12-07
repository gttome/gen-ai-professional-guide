// js/core/analytics.js
// Client-side analytics for the Gen AI Exam app.
// Works entirely in the browser (GitHub Pages compatible).
// Stores events in localStorage and exposes aggregation helpers.

import { getSession } from "./state.js";

export const ANALYTICS_STORAGE_KEY = "genaiExamAnalyticsEvents_v1";

/* ------------------------------------------------------------------ */
/* Storage helpers                                                     */
/* ------------------------------------------------------------------ */

function safeLoadEvents() {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeSaveEvents(events) {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // If storage quota is exceeded or disabled, silently ignore.
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Generic event tracker.
 *
 * @param {string} type - e.g. "session_submitted"
 * @param {object} base - e.g. { sessionId, mode, chapterId }
 * @param {object} payload - shape specific to the event type
 */
export function trackEvent(type, base, payload) {
  const events = safeLoadEvents();
  events.push({
    ts: Date.now(),
    type,
    ...base,
    payload
  });
  safeSaveEvents(events);
}

/**
 * Remove all saved analytics events from this browser.
 * Useful when the learner wants a completely fresh start.
 */
export function clearAllAnalytics() {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Build the analytics payload for a submitted session.
 * Uses the current session and the question bank to compute:
 * - overall score
 * - per-section stats
 * - per-difficulty stats
 */
export function buildSessionSubmittedPayload(state, questions) {
  const session = getSession(state);
  if (!session || !Array.isArray(session.indices)) return null;

  const { indices, answers = {} } = session;

  let totalQuestions = 0;
  let answered = 0;
  let correctCount = 0;

  const perSectionMap = new Map();
  const perDifficulty = createEmptyDifficultyStats();

  for (const idx of indices) {
    const q = questions[idx];
    if (!q) continue;

    totalQuestions += 1;

    const hasAnswer = Object.prototype.hasOwnProperty.call(answers, q.id);
    const givenKey = hasAnswer ? answers[q.id] : null;
    const isCorrect = !!(hasAnswer && givenKey === q.correctOptionKey);

    if (hasAnswer) answered += 1;
    if (isCorrect) correctCount += 1;

    // Section aggregation (a question can belong to multiple sections)
    const tags = Array.isArray(q.sectionTags) ? q.sectionTags : ["Uncategorized"];
    for (const rawTag of tags) {
      const tag = rawTag || "Uncategorized";
      if (!perSectionMap.has(tag)) {
        perSectionMap.set(tag, { sectionTag: tag, correct: 0, total: 0 });
      }
      const agg = perSectionMap.get(tag);
      agg.total += 1;
      if (isCorrect) agg.correct += 1;
    }

    // Difficulty aggregation
    const difficulty = normalizeDifficulty(q.difficulty);
    const diffAgg = perDifficulty[difficulty];
    diffAgg.total += 1;
    if (isCorrect) diffAgg.correct += 1;
  }

  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    answered,
    correct: correctCount,
    scorePercent,
    perSection: Array.from(perSectionMap.values()),
    perDifficulty
  };
}

/**
 * Load aggregated stats across all submitted sessions.
 * Returns:
 * {
 *   sessionsCount,
 *   perSection: [{ sectionTag, correct, total }],
 *   perDifficulty: { easy: {correct,total}, medium:{}, difficult:{} }
 * }
 */


export function loadAggregatedStats() {
  const events = safeLoadEvents();

  const perSectionMap = new Map();
  const perDifficulty = createEmptyDifficultyStats();
  let totalQuestions = 0;
  let totalCorrect = 0;

  // Collect question_time_spent events for pace insights
  const timingEvents = [];

  // For behavior insights (review + answer changes)
  const reviewQuestionKeys = new Set();   // `${sessionId}|${questionIndex}`
  const changedQuestionKeys = new Set();  // `${sessionId}|${questionIndex}`

  for (const evt of events) {
    if (!evt || !evt.type) continue;

    if (evt.type === "session_submitted" && evt.payload) {
      const p = evt.payload || {};

      // Global totals
      totalQuestions += p.totalQuestions || 0;
      totalCorrect += p.correct || 0;

      // Sections
      for (const sec of p.perSection || []) {
        const key = sec.sectionTag || "Uncategorized";
        if (!perSectionMap.has(key)) {
          perSectionMap.set(key, { sectionTag: key, correct: 0, total: 0 });
        }
        const agg = perSectionMap.get(key);
        agg.correct += sec.correct || 0;
        agg.total += sec.total || 0;
      }

      // Difficulty
      const d = p.perDifficulty || {};
      ["easy", "medium", "difficult"].forEach((level) => {
        const src = d[level] || {};
        const dest = perDifficulty[level];
        dest.correct += src.correct || 0;
        dest.total += src.total || 0;
      });
    } else if (evt.type === "question_time_spent" && evt.payload) {
      timingEvents.push(evt);
    } else if (evt.type === "review_toggled" && evt.payload) {
      const ctx = evt.context || {};
      const sessionId = ctx.sessionId || "unknown";
      const qIndex = Number(evt.payload.questionIndex);
      if (evt.payload.isMarked && Number.isFinite(qIndex)) {
        reviewQuestionKeys.add(`${sessionId}|${qIndex}`);
      }
    } else if (evt.type === "answer_changed" && evt.payload) {
      const ctx = evt.context || {};
      const sessionId = ctx.sessionId || "unknown";
      const qIndex = Number(evt.payload.questionIndex);
      if (Number.isFinite(qIndex)) {
        changedQuestionKeys.add(`${sessionId}|${qIndex}`);
      }
    }
  }

  const overallAccuracyPercent =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null;

  
    // --- Pace insights from timingEvents ---
    let pace = {
      // Number of questions we have usable timing data for (after filtering).
      totalQuestionsWithTiming: 0,
      // Raw count of timing events in storage (helps debug when this is 0).
      totalTimingEvents: timingEvents.length || 0,
      averageTimeMs: null,
      medianTimeMs: null,
      fast: { count: 0, accuracyPercent: null },
      medium: { count: 0, accuracyPercent: null },
      slow: { count: 0, accuracyPercent: null }
    };

    if (timingEvents.length > 0) {
      // Use any timing event that has a valid, positive time value.
      const timedEvents = timingEvents.filter(
        (e) =>
          e.payload &&
          Number.isFinite(Number(e.payload.timeOnQuestionMs)) &&
          Number(e.payload.timeOnQuestionMs) > 0
      );

      const times = timedEvents
        .map((e) => Number(e.payload.timeOnQuestionMs))
        .filter((v) => Number.isFinite(v) && v > 0);

      if (times.length > 0) {
        const totalTime = times.reduce((sum, v) => sum + v, 0);
        const avgTime = Math.round(totalTime / times.length);
        const medianTime = computeMedian(times);

        pace.totalQuestionsWithTiming = times.length;
        pace.averageTimeMs = avgTime;
        pace.medianTimeMs = medianTime;

        // Define thresholds relative to median (fallback to average if needed)
        const median = medianTime || avgTime;
        if (median && median > 0) {
          const fastThreshold = Math.max(3000, Math.round(median * 0.5)); // at least 3s
          const slowThreshold = Math.round(median * 2); // 2x median

          const buckets = {
            fast: [],
            medium: [],
            slow: []
          };

          for (const e of timedEvents) {
            const t = Number(e.payload.timeOnQuestionMs);
            if (!Number.isFinite(t) || t <= 0) continue;
            const wasCorrect =
              typeof e.payload.wasCorrect === "boolean"
                ? e.payload.wasCorrect
                : null;

            let bucketKey = "medium";
            if (t <= fastThreshold) bucketKey = "fast";
            else if (t >= slowThreshold) bucketKey = "slow";

            buckets[bucketKey].push({
              t,
              wasCorrect
            });
          }

          const computeBucket = (entries) => {
            if (!entries.length) return { count: 0, accuracyPercent: null };
            const count = entries.length;
            const answeredEntries = entries.filter(
              (e) => typeof e.wasCorrect === "boolean"
            );
            let accuracyPercent = null;
            if (answeredEntries.length) {
              const correctCount = answeredEntries.filter(
                (e) => e.wasCorrect
              ).length;
              accuracyPercent =
                Math.round((correctCount / answeredEntries.length) * 100);
            }
            return { count, accuracyPercent };
          };

          pace.fast = computeBucket(buckets.fast);
          pace.medium = computeBucket(buckets.medium);
          pace.slow = computeBucket(buckets.slow);
        }
      }
    }
// --- Behavior insights (review + changed answers) ---
  let behavior = {
    totalQuestions: totalQuestions || 0,
    reviewedQuestionsCount: 0,
    reviewedQuestionsPercent: null,
    changedAnswersCount: 0,
    changedAnswersPercent: null
  };

  if (totalQuestions > 0) {
    const reviewedCount = reviewQuestionKeys.size;
    const changedCount = changedQuestionKeys.size;

    behavior.reviewedQuestionsCount = reviewedCount;
    behavior.changedAnswersCount = changedCount;

    behavior.reviewedQuestionsPercent = Math.round(
      (reviewedCount / totalQuestions) * 100
    );
    behavior.changedAnswersPercent = Math.round(
      (changedCount / totalQuestions) * 100
    );
  }

  return {
    sessionsCount: events.filter(
      (evt) => evt && evt.type === "session_submitted" && evt.payload
    ).length,
    overallAccuracyPercent,
    perSection: Array.from(perSectionMap.values()),
    perDifficulty,
    pace,
    behavior
  };
}





/**
 * Compute a simple mastery label for a section.
 * - "not_started": no questions attempted
 * - "mastered": >= 3 questions & >= 80% correct
 * - "in_progress": everything else
 */
export function computeMasteryLevel(correct, total) {
  if (!total || total <= 0) return "not_started";
  const accuracy = correct / total;
  if (total >= 3 && accuracy >= 0.8) return "mastered";
  return "in_progress";
}

/* ------------------------------------------------------------------ */

export function loadDifficultyInsights() {
  const events = safeLoadEvents();
  const totalDifficulty = createEmptyDifficultyStats();

  const modeBuckets = {
    exam: createEmptyDifficultyStats(),
    study: createEmptyDifficultyStats(),
    experiment: createEmptyDifficultyStats()
  };

  for (const evt of events) {
    if (!evt || evt.type !== "session_submitted" || !evt.payload) continue;
    const p = evt.payload || {};
    const perDiff = p.perDifficulty || {};

    ["easy", "medium", "difficult"].forEach((level) => {
      const src = perDiff[level] || {};
      const destTotal = totalDifficulty[level];
      destTotal.correct += src.correct || 0;
      destTotal.total += src.total || 0;

      const rawMode = typeof evt.mode === "string" ? evt.mode.toLowerCase() : "";
      const modeKey =
        rawMode === "exam"
          ? "exam"
          : rawMode === "study"
          ? "study"
          : rawMode === "experiment"
          ? "experiment"
          : null;

      if (modeKey && modeBuckets[modeKey]) {
        const destMode = modeBuckets[modeKey][level];
        destMode.correct += src.correct || 0;
        destMode.total += src.total || 0;
      }
    });
  }

  function toSummary(bucket) {
    const out = {};
    ["easy", "medium", "difficult"].forEach((level) => {
      const { correct = 0, total = 0 } = bucket[level] || {};
      const accuracy =
        total > 0 ? Math.round((correct / total) * 100) : null;
      out[level] = { correct, total, accuracy };
    });
    return out;
  }

  const difficultyAccuracy = toSummary(totalDifficulty);

  let weakestDifficulty = null;
  let strongestDifficulty = null;
  let minAcc = null;
  let maxAcc = null;

  ["easy", "medium", "difficult"].forEach((level) => {
    const entry = difficultyAccuracy[level];
    if (!entry || entry.accuracy == null) return;
    const acc = entry.accuracy;
    if (minAcc == null || acc < minAcc) {
      minAcc = acc;
      weakestDifficulty = level;
    }
    if (maxAcc == null || acc > maxAcc) {
      maxAcc = acc;
      strongestDifficulty = level;
    }
  });

  const easyEntry = difficultyAccuracy.easy || {};
  const mediumEntry = difficultyAccuracy.medium || {};
  const easyBelowMedium =
    easyEntry.accuracy != null &&
    mediumEntry.accuracy != null &&
    easyEntry.accuracy < mediumEntry.accuracy;

  const modeDifficulty = {
    exam: toSummary(modeBuckets.exam),
    study: toSummary(modeBuckets.study),
    experiment: toSummary(modeBuckets.experiment)
  };

  return {
    difficultyAccuracy,
    weakestDifficulty,
    strongestDifficulty,
    easyBelowMedium,
    modeDifficulty
  };
}

export function loadTimelineAndStreaks() {
  const events = safeLoadEvents();
  const sessions = events.filter(
    (evt) => evt && evt.type === "session_submitted" && evt.payload
  );

  if (!sessions.length) {
    return {
      sessions: [],
      trend: {},
      practiceStreak: { currentDays: 0, bestDays: 0 },
      highScoreStreak: {
        threshold: 70,
        currentSessions: 0,
        bestSessions: 0
      }
    };
  }

  // Sort oldest -> newest
  sessions.sort((a, b) => {
    const aTs = typeof a.ts === "number" ? a.ts : 0;
    const bTs = typeof b.ts === "number" ? b.ts : 0;
    return aTs - bTs;
  });

  const timelineSessions = sessions.map((evt) => ({
    ts: evt.ts,
    mode: evt.mode || null,
    chapterId: evt.chapterId || null,
    scorePercent:
      evt.payload && typeof evt.payload.scorePercent === "number"
        ? evt.payload.scorePercent
        : null
  }));

  // Trend metrics
  const scores = timelineSessions
    .map((s) => s.scorePercent)
    .filter((v) => typeof v === "number");

  const lastScore =
    scores.length > 0 ? scores[scores.length - 1] : null;

  function rollingAverage(arr, lastN) {
    if (!arr.length) return null;
    const slice = arr.slice(-lastN);
    const valid = slice.filter((v) => typeof v === "number");
    if (!valid.length) return null;
    const sum = valid.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / valid.length);
  }

  const trend = {
    lastScore,
    rollingAvgLast5: rollingAverage(scores, 5),
    rollingAvgLast10: rollingAverage(scores, 10)
  };

  // Practice streaks by day
  const DAY_MS = 24 * 60 * 60 * 1000;
  function dayKey(ts) {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const dayKeysSet = new Set(
    timelineSessions
      .map((s) => (typeof s.ts === "number" ? dayKey(s.ts) : null))
      .filter(Boolean)
  );
  const dayKeys = Array.from(dayKeysSet).sort();

  let currentDays = 0;
  let bestDays = 0;

  if (dayKeys.length) {
    // Convert to numeric days index
    const dayIndices = dayKeys.map((key) => {
      const d = new Date(key + "T00:00:00Z");
      return Math.floor(d.getTime() / DAY_MS);
    });

    // Current streak: walk backwards from last day
    let streak = 1;
    for (let i = dayIndices.length - 1; i > 0; i--) {
      const diff = dayIndices[i] - dayIndices[i - 1];
      if (diff === 1) {
        streak += 1;
      } else {
        break;
      }
    }
    currentDays = streak;

    // Best streak: longest run in the series
    let run = 1;
    bestDays = 1;
    for (let i = 1; i < dayIndices.length; i++) {
      const diff = dayIndices[i] - dayIndices[i - 1];
      if (diff === 1) {
        run += 1;
        if (run > bestDays) bestDays = run;
      } else {
        run = 1;
      }
    }
  }

  const practiceStreak = {
    currentDays,
    bestDays
  };

  // High-score streak (per-session)
  const HIGH_SCORE_THRESHOLD = 70;
  let currentSessions = 0;
  let bestSessions = 0;
  let running = 0;

  for (let i = timelineSessions.length - 1; i >= 0; i--) {
    const s = timelineSessions[i];
    if (
      typeof s.scorePercent === "number" &&
      s.scorePercent >= HIGH_SCORE_THRESHOLD
    ) {
      running += 1;
    } else {
      if (running > 0 && currentSessions === 0) {
        currentSessions = running;
      }
      if (running > bestSessions) {
        bestSessions = running;
      }
      running = 0;
    }
  }
  if (running > 0) {
    if (currentSessions === 0) currentSessions = running;
    if (running > bestSessions) bestSessions = running;
  }

  const highScoreStreak = {
    threshold: HIGH_SCORE_THRESHOLD,
    currentSessions,
    bestSessions
  };

  return {
    sessions: timelineSessions,
    trend,
    practiceStreak,
    highScoreStreak
  };
}


/* Internal helpers                                                    */
/* ------------------------------------------------------------------ */

function normalizeDifficulty(raw) {
  if (!raw || typeof raw !== "string") return "medium";
  const lower = raw.toLowerCase();
  if (lower === "easy") return "easy";
  if (lower === "medium") return "medium";
  if (lower === "hard" || lower === "difficult") return "difficult";
  return "medium";
}

function createEmptyDifficultyStats() {
  return {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    difficult: { correct: 0, total: 0 }
  };
}


function computeMedian(values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}




/* ------------------------------------------------------------------ */
/* Exam goals & recommendation (Release 6.7a)                         */
/* ------------------------------------------------------------------ */

const EXAM_GOALS_STORAGE_KEY = "examGoals";

function inferChapterIdFromSectionTag(sectionTag) {
  if (!sectionTag || typeof sectionTag !== "string") return null;
  const trimmed = sectionTag.trim();
  if (!trimmed.length) return null;
  const dotIndex = trimmed.indexOf(".");
  const prefix = dotIndex >= 0 ? trimmed.slice(0, dotIndex) : trimmed;
  const num = parseInt(prefix, 10);
  if (!Number.isFinite(num)) return null;
  if (num >= 1 && num <= 4) {
    return `ch${num}`;
  }
  return null;
}

function createDefaultGoals() {
  return {
    version: 1,
    overall: {
      targetAccuracyPercent: 70,
      enabled: false
    },
    difficulty: {
      easy: { targetAccuracyPercent: 80, enabled: false },
      medium: { targetAccuracyPercent: 70, enabled: false },
      difficult: { targetAccuracyPercent: 60, enabled: false }
    },
    streak: {
      targetPracticeDays: 5,
      targetHighScoreSessions: 3,
      enabled: false
    },
    sectionFocus: {
      enabled: false,
      preferredSections: []
    }
  };
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function normalizeGoals(input) {
  const base = createDefaultGoals();
  if (!input || typeof input !== "object") return base;

  const out = {
    version: 1,
    overall: { ...base.overall },
    difficulty: {
      easy: { ...base.difficulty.easy },
      medium: { ...base.difficulty.medium },
      difficult: { ...base.difficulty.difficult }
    },
    streak: { ...base.streak },
    sectionFocus: {
      enabled: base.sectionFocus.enabled,
      preferredSections: [...base.sectionFocus.preferredSections]
    }
  };

  if (input.overall && typeof input.overall === "object") {
    out.overall.enabled = !!input.overall.enabled;
    out.overall.targetAccuracyPercent = clampNumber(
      input.overall.targetAccuracyPercent,
      10,
      100,
      base.overall.targetAccuracyPercent
    );
  }

  const inDiff =
    input.difficulty && typeof input.difficulty === "object"
      ? input.difficulty
      : {};
  ["easy", "medium", "difficult"].forEach((level) => {
    const src = inDiff[level] || {};
    const baseGoal = base.difficulty[level];
    const dest = out.difficulty[level];
    dest.enabled = !!src.enabled;
    dest.targetAccuracyPercent = clampNumber(
      src.targetAccuracyPercent,
      10,
      100,
      baseGoal.targetAccuracyPercent
    );
  });

  if (input.streak && typeof input.streak === "object") {
    out.streak.enabled = !!input.streak.enabled;
    out.streak.targetPracticeDays = clampNumber(
      input.streak.targetPracticeDays,
      1,
      365,
      base.streak.targetPracticeDays
    );
    out.streak.targetHighScoreSessions = clampNumber(
      input.streak.targetHighScoreSessions,
      1,
      999,
      base.streak.targetHighScoreSessions
    );
  }

  if (input.sectionFocus && typeof input.sectionFocus === "object") {
    out.sectionFocus.enabled = !!input.sectionFocus.enabled;
    const secPref = Array.isArray(input.sectionFocus.preferredSections)
      ? input.sectionFocus.preferredSections.filter(
          (s) => typeof s === "string" && s.trim().length
        )
      : [];
    out.sectionFocus.preferredSections = secPref;
  }

  return out;
}

export function loadGoalsFromStorage() {
  try {
    const raw = localStorage.getItem(EXAM_GOALS_STORAGE_KEY);
    if (!raw) return createDefaultGoals();
    const parsed = JSON.parse(raw);
    return normalizeGoals(parsed);
  } catch {
    return createDefaultGoals();
  }
}

export function saveGoalsToStorage(goals) {
  try {
    const normalized = normalizeGoals(goals);
    localStorage.setItem(EXAM_GOALS_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore
  }
}

export function computeRecommendation(stats, difficultyInsights, timeline, goals) {
  if (!stats || !goals) return null;

  const sessionsCount = stats.sessionsCount || 0;
  if (!sessionsCount) {
    return null;
  }

  const perDifficulty = stats.perDifficulty || {};
  const perSection = stats.perSection || [];
  const overallAccuracy =
    typeof stats.overallAccuracyPercent === "number"
      ? stats.overallAccuracyPercent
      : null;

  const practiceStreak =
    (timeline && timeline.practiceStreak) || { currentDays: 0, bestDays: 0 };
  const highScoreStreak =
    (timeline && timeline.highScoreStreak) || {
      threshold: 70,
      currentSessions: 0,
      bestSessions: 0
    };

  const diffAcc = {};
  ["easy", "medium", "difficult"].forEach((level) => {
    const bucket = perDifficulty[level] || {};
    const total = bucket.total || 0;
    const correct = bucket.correct || 0;
    diffAcc[level] = total > 0 ? Math.round((correct / total) * 100) : null;
  });

  let weakestDifficulty = null;
  let weakestAcc = null;
  ["easy", "medium", "difficult"].forEach((level) => {
    const acc = diffAcc[level];
    const bucket = perDifficulty[level] || {};
    if (bucket.total < 3 || acc == null) return;
    if (weakestAcc == null || acc < weakestAcc) {
      weakestAcc = acc;
      weakestDifficulty = level;
    }
  });

  const recommendation = {
    mode: "study",
    chapterId: null,
    difficulty: "medium",
    examLength: "quick",
    reasons: []
  };

  const reasons = [];

  const overallGoal = goals.overall || {};
  if (overallGoal.enabled && overallAccuracy != null) {
    const gap = overallGoal.targetAccuracyPercent - overallAccuracy;
    if (gap > 0) {
      reasons.push(
        `Your overall accuracy is ${overallAccuracy}%, below your goal of ${overallGoal.targetAccuracyPercent}%.`
      );
    } else {
      reasons.push(
        `Your overall accuracy (${overallAccuracy}%) is at or above your goal of ${overallGoal.targetAccuracyPercent}%.`
      );
      recommendation.mode = "exam";
      recommendation.examLength = "full";
    }
  }

  const diffGoals = goals.difficulty || {};
  const candidateDifficultyOrder = ["medium", "difficult", "easy"];

  let chosenDifficulty = "medium";
  let difficultyReason = null;

  candidateDifficultyOrder.forEach((level) => {
    const goal = diffGoals[level] || {};
    const acc = diffAcc[level];
    const bucket = perDifficulty[level] || {};
    if (!goal.enabled || acc == null || bucket.total < 3) return;
    const gap = goal.targetAccuracyPercent - acc;
    if (gap > 0 && !difficultyReason) {
      chosenDifficulty = level;
      difficultyReason = `You're below your target on ${capitalize(level)} questions (${acc}% vs goal ${goal.targetAccuracyPercent}%).`;
    }
  });

  if (!difficultyReason && weakestDifficulty) {
    chosenDifficulty = weakestDifficulty;
    const label = capitalize(weakestDifficulty);
    if (weakestAcc != null) {
      difficultyReason = `You're relatively weakest on ${label} questions (${weakestAcc}% correct).`;
    } else {
      difficultyReason = `You're relatively weakest on ${label} questions.`;
    }
  }

  if (difficultyReason) {
    reasons.push(difficultyReason);
  }

  recommendation.difficulty = chosenDifficulty;

  const streakGoal = goals.streak || {};
  if (streakGoal.enabled) {
    const targetDays = streakGoal.targetPracticeDays || 0;
    const targetHigh = streakGoal.targetHighScoreSessions || 0;

    if (targetDays > 0 && practiceStreak.currentDays < targetDays) {
      reasons.push(
        `Your current practice streak is ${practiceStreak.currentDays} day${
          practiceStreak.currentDays === 1 ? "" : "s"
        }; your goal is ${targetDays} days in a row. Short sessions can help build this streak.`
      );
      recommendation.examLength = "quick";
    }

    if (targetHigh > 0 && highScoreStreak.currentSessions < targetHigh) {
      const threshold =
        typeof highScoreStreak.threshold === "number"
          ? highScoreStreak.threshold
          : 70;
      reasons.push(
        `You have ${highScoreStreak.currentSessions} high-score session${
          highScoreStreak.currentSessions === 1 ? "" : "s"
        } at ≥ ${threshold}%; your goal is ${targetHigh}.`
      );
    }
  }

  const sectionGoal = goals.sectionFocus || {};
  if (sectionGoal.enabled) {
    const preferred = Array.isArray(sectionGoal.preferredSections)
      ? sectionGoal.preferredSections
      : [];
    if (preferred.length) {
      reasons.push(
        `You'll see more questions from your focus sections: ${preferred.join(", ")}.`
      );
      if (!recommendation.chapterId) {
        const inferredFromPreferred = inferChapterIdFromSectionTag(preferred[0]);
        if (inferredFromPreferred) {
          recommendation.chapterId = inferredFromPreferred;
        }
      }
    } else if (Array.isArray(perSection) && perSection.length) {
      let weakestSection = null;
      let weakestSectionAcc = null;

      perSection.forEach((row) => {
        const total = row.total || 0;
        const correct = row.correct || 0;
        if (total < 3) return;
        const acc = total > 0 ? Math.round((correct / total) * 100) : null;
        if (acc == null) return;
        if (weakestSectionAcc == null || acc < weakestSectionAcc) {
          weakestSectionAcc = acc;
          weakestSection = row.sectionTag || "";
        }
      });

      if (weakestSection) {
        reasons.push(
          `We'll nudge you toward your weaker section: ${weakestSection} (${weakestSectionAcc}% correct).`
        );
        if (!recommendation.chapterId) {
          const inferredFromWeakest = inferChapterIdFromSectionTag(weakestSection);
          if (inferredFromWeakest) {
            recommendation.chapterId = inferredFromWeakest;
          }
        }
      }
    }
  }

  if (!reasons.length) {
    reasons.push(
      "Complete more sessions and optionally enable one or two goals to receive more tailored suggestions."
    );
  }

  recommendation.reasons = reasons;
  return recommendation;
}

function capitalize(str) {
  if (typeof str !== "string" || !str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
