// js/controller/ExamAppController.js

import {
  createInitialState,
  setCurrentMode,
  setCurrentChapter,
  setExamTemplate,
  loadDifficultyOverridesFromStorage,
  loadExperimentConfigFromStorage,
  saveDifficultyOverridesToStorage,
  saveExperimentConfigToStorage,
  logEvent,
  getSession,
  makeSessionKey,
  createEmptySession,
  setSession
} from "../core/state.js";

import {
  ensureSessionInitialized,
  getCurrentQuestionViewModel,
  selectAnswerForCurrentQuestion,
  checkAnswerForCurrentQuestion,
  goToNextQuestion,
  goToPrevQuestion,
  computeSessionResults,
  computeReviewMetrics,
  buildExperimentSession
} from "../core/quizEngine.js";

import {
  trackEvent,
  buildSessionSubmittedPayload,
  loadAggregatedStats,
  computeMasteryLevel,
  loadDifficultyInsights,
  loadTimelineAndStreaks,
  clearAllAnalytics,
  loadGoalsFromStorage,
  saveGoalsToStorage,
  computeRecommendation
} from "../core/analytics.js";

import { SessionTimer } from "../core/timer.js";
import { createView } from "../ui/view.js";

export class ExamAppController {
  constructor({ questions }) {
    this.questions = questions;
    this.state = createInitialState();

    // Study-mode reveal toggle and Review Marked state
    this.state.studyReveal = false;
    this.isInReviewMode = false;
    this.reviewBackupSession = null;

    // Simple per-question timing (client-side only)
    this.currentQuestionStartMs = null;
    this.currentQuestionIndexForTiming = null;

    // Load persisted settings
    this.state.difficultyOverrides = loadDifficultyOverridesFromStorage();
    this.state.experimentConfig = loadExperimentConfigFromStorage();

    this.view = createView({
      onModeChange: (mode) => this.handleModeChange(mode),
      onChapterChange: (chapterId) => this.handleChapterChange(chapterId),
      onExamTemplateChange: (templateKey) =>
        this.handleExamTemplateChange(templateKey),
      onAnswerSelected: (optionKey) => this.handleAnswerSelected(optionKey),
      onCheckAnswer: () => this.handleCheckAnswer(),
      onDifficultyChange: (label) => this.handleDifficultyChange(label),
      onPrev: () => this.handlePrev(),
      onNext: () => this.handleNext(),
      onSubmit: () => this.handleSubmit(),
      onRestart: () => this.handleRestart(),
      onReviewToggle: (checked) => this.handleReviewToggle(checked),
      onReviewMarked: () => this.handleReviewMarkedClick(),
      onExperimentChaptersChange: (chapters) =>
        this.handleExperimentChaptersChange(chapters),
      onExperimentSizeChange: (size) =>
        this.handleExperimentSizeChange(size),
      onBuildExperiment: () => this.handleBuildExperiment()
    });

    this.timer = new SessionTimer({
      onTick: (elapsedMs) => {
        if (this.view && typeof this.view.renderTimer === "function") {
          this.view.renderTimer(elapsedMs);
        }
      }
    });


    // Analytics / metrics overlay wiring
    this.masteryBtn = document.getElementById("masteryBtn");
    this.masteryOverlayEl = document.getElementById("masteryOverlay");
    this.masteryBodyEl = document.getElementById("masteryBody");
    this.masteryCloseBtn = document.getElementById("masteryCloseBtn");
    this.masteryClearBtn = document.getElementById("masteryClearBtn");

    if (this.masteryBtn) {
      this.masteryBtn.addEventListener("click", () => this.handleMasteryClick());
    }
    if (this.masteryCloseBtn) {
      this.masteryCloseBtn.addEventListener("click", () =>
        this.hideMasteryOverlay()
      );
    }
    if (this.masteryClearBtn) {
      this.masteryClearBtn.addEventListener("click", () =>
        this.handleMasteryClear()
      );
    }

    // Suggested Next Session indicator (Release 6.7b)
    this.suggestedStripEl = document.getElementById("suggestedSessionStrip");
    this.suggestedPillEl = document.getElementById("suggestedSessionPill");
    this.suggestedPopupEl = document.getElementById("suggestedSessionPopup");
    this.suggestedSessionTextEl = document.getElementById("suggestedSessionText");
    this.suggestedSessionReasonsEl = document.getElementById(
      "suggestedSessionReasons"
    );
    this.suggestedApplyBtn = document.getElementById("suggestedApplyBtn");
    this.suggestedDismissBtn = document.getElementById("suggestedDismissBtn");

    this.currentRecommendation = null;
    this.suggestedStripDismissed = false;

      if (this.suggestedPillEl) {
      this.suggestedPillEl.addEventListener("click", () =>
        this.handleSuggestedSessionPillClick()
      );
    }

if (this.suggestedApplyBtn) {
      this.suggestedApplyBtn.addEventListener("click", () =>
        this.handleApplySuggestedSession()
      );
    }
    if (this.suggestedDismissBtn) {
      this.suggestedDismissBtn.addEventListener("click", () =>
        this.handleDismissSuggestedSession()
      );
    }
  }

  init() {
    ensureSessionInitialized(this.state, this.questions);
    this.startTimerIfNeeded();
    this.markCurrentQuestionEntryForTiming();
    this.render();
    this.refreshSuggestedSessionStrip();
  }

  // --- Timer helpers --------------------------------------------------

  startTimerIfNeeded() {
    const session = getSession(this.state);
    if (!session) return;
    if (!session.startTimeMs) {
      session.startTimeMs = Date.now();
    }
    this.timer.start(session.startTimeMs);
  }

  startTimerFromScratch() {
    this.timer.stop();
    const session = getSession(this.state);
    if (!session) return;
    session.startTimeMs = Date.now();
    this.timer.start(session.startTimeMs);
  }

  stopTimer() {
    const session = getSession(this.state);
    if (session && session.startTimeMs && !session.endTimeMs) {
      session.endTimeMs = Date.now();
      session.totalDurationMs = session.endTimeMs - session.startTimeMs;
    }
    this.timer.stop();
  }
// --- Simple per-question timing helpers (for analytics only) -------

normalizeDifficultyForAnalytics(raw) {
  if (!raw || typeof raw !== "string") return "medium";
  const lower = raw.toLowerCase();
  if (lower === "easy") return "easy";
  if (lower === "medium") return "medium";
  if (lower === "hard" || lower === "difficult") return "difficult";
  return "medium";
}

markCurrentQuestionEntryForTiming() {
  const vm = getCurrentQuestionViewModel(this.state, this.questions);
  if (!vm || !vm.hasQuestion) {
    this.currentQuestionStartMs = null;
    this.currentQuestionIndexForTiming = null;
    return;
  }
  this.currentQuestionStartMs = Date.now();
  this.currentQuestionIndexForTiming = vm.questionIndex;
}

trackQuestionTimeIfPossible({ wasSubmitted = false } = {}) {
  const vm = getCurrentQuestionViewModel(this.state, this.questions);
  if (!vm || !vm.hasQuestion) {
    return;
  }

  const session = vm.session;
  if (!session) return;

  // If we don't yet have a baseline, start one but don't log.
  if (
    this.currentQuestionStartMs == null ||
    this.currentQuestionIndexForTiming == null ||
    this.currentQuestionIndexForTiming !== vm.questionIndex
  ) {
    this.currentQuestionStartMs = Date.now();
    this.currentQuestionIndexForTiming = vm.questionIndex;
    return;
  }

  const now = Date.now();
  const elapsed = now - this.currentQuestionStartMs;
  if (!Number.isFinite(elapsed) || elapsed < 0) {
    this.currentQuestionStartMs = now;
    this.currentQuestionIndexForTiming = vm.questionIndex;
    return;
  }

  const question = vm.question;
  const answers = session.answers || {};
  const hasAnswer = Object.prototype.hasOwnProperty.call(answers, question.id);
  const givenKey = hasAnswer ? answers[question.id] : null;
  const answered = !!hasAnswer;
  const wasCorrect = answered && givenKey === question.correctOptionKey;

  const difficulty = this.normalizeDifficultyForAnalytics(question.difficulty);
  const sectionTags =
    Array.isArray(question.sectionTags) && question.sectionTags.length
      ? question.sectionTags
      : ["Uncategorized"];

  try {
    trackEvent(
      "question_time_spent",
      {
        sessionId: session.sessionId || session.key,
        mode: this.state.currentMode,
        chapterId: this.state.currentChapterId
      },
      {
        questionIndex: vm.questionIndex,
        timeOnQuestionMs: elapsed,
        answered,
        wasSubmitted: !!wasSubmitted,
        difficulty,
        sectionTags,
        wasCorrect
      }
    );
  } catch (err) {
    console.warn("Analytics tracking failed (question_time_spent):", err);
  }

  // Prepare for the next question entry; caller should call
  // markCurrentQuestionEntryForTiming() after navigation.
  this.currentQuestionStartMs = now;
  this.currentQuestionIndexForTiming = vm.questionIndex;
}



  // --- Core render ----------------------------------------------------

  render() {
    // Expose transient controller-only flags to the view layer.
    this.state.isInReviewMode = !!this.isInReviewMode;

    const vm = getCurrentQuestionViewModel(this.state, this.questions);
    this.view.renderModeChrome(this.state);
    this.view.renderQuestion(vm, this.state);
    this.view.hideResults();
    this.updateMasteryButtonVisibility();
  }


  // --- Handlers: mode / chapter / template ---------------------------

  handleModeChange(mode) {
  // Changing context; clear any active Review Marked state and Study reveal.
  this.isInReviewMode = false;
  this.reviewBackupSession = null;
  this.state.studyReveal = false;

  // Record time on the current question before switching modes.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  this.stopTimer();
  setCurrentMode(this.state, mode);
  ensureSessionInitialized(this.state, this.questions);
  this.startTimerIfNeeded();
  this.markCurrentQuestionEntryForTiming();
  this.render();
  this.refreshSuggestedSessionStrip();
}


  handleChapterChange(chapterId) {
  // Changing context; clear any active Review Marked state and Study reveal.
  this.isInReviewMode = false;
  this.reviewBackupSession = null;
  this.state.studyReveal = false;

  // Record time on the current question before switching chapters.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  this.stopTimer();
  setCurrentChapter(this.state, chapterId);
  ensureSessionInitialized(this.state, this.questions);
  this.startTimerIfNeeded();
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  handleExamTemplateChange(templateKey) {
  // Record time on the current question before changing the exam template.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  setExamTemplate(this.state, templateKey);

  // Changing exam length should rebuild the session for the current mode/chapter
  const key = makeSessionKey(
    this.state.currentMode,
    this.state.currentChapterId
  );
  this.state.sessionStates.delete(key);

  ensureSessionInitialized(this.state, this.questions);
  this.startTimerFromScratch();
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  // --- Handlers: answering & navigation ------------------------------

  handleAnswerSelected(optionKey) {
    const vm = getCurrentQuestionViewModel(this.state, this.questions);
    if (!vm || !vm.hasQuestion) {
      return;
    }
    const session = vm.session;
    const question = vm.question;
    const answers = (session && session.answers) || {};
    const prevKey = answers[question.id];

    // Log answer_changed only when changing from one option to another.
    if (prevKey && prevKey !== optionKey) {
      try {
        trackEvent(
          "answer_changed",
          {
            sessionId: session.sessionId || session.key,
            mode: this.state.currentMode,
            chapterId: this.state.currentChapterId
          },
          {
            questionIndex: vm.questionIndex,
            fromOptionKey: prevKey,
            toOptionKey: optionKey
          }
        );
      } catch (err) {
        console.warn("Analytics tracking failed (answer_changed):", err);
      }
    }

    selectAnswerForCurrentQuestion(this.state, this.questions, optionKey);
    this.render();
  }

  handleCheckAnswer() {
    const mode = this.state.currentMode;

    // Study mode: Check Answer simply toggles the explanation on/off,
    // without permanently grading the question.
    if (mode === "study") {
      this.state.studyReveal = !this.state.studyReveal;
      this.render();
      return;
    }

    // Exam / Experiment: first click grades & reveals, second click hides
    // the explanation without changing the grade.
    const beforeVm = getCurrentQuestionViewModel(this.state, this.questions);
    if (!beforeVm || !beforeVm.hasQuestion) {
      return;
    }

    if (!beforeVm.isSubmitted) {
      // First time checking this question: grade it and show explanation.
      const afterVm = checkAnswerForCurrentQuestion(
        this.state,
        this.questions
      );
      this.state.studyReveal = true; // reuse the same flag to control visibility

      if (afterVm && afterVm.hasQuestion) {
        logEvent(this.state, "answer_checked", {
          questionId: afterVm.question.id,
          correct: afterVm.isCorrect
        });
      }
    } else {
      // Already graded for this question; just toggle explanation visibility.
      this.state.studyReveal = !this.state.studyReveal;
    }

    this.render();
  }

  handleDifficultyChange(label) {
    if (!label) return;
    const vm = getCurrentQuestionViewModel(this.state, this.questions);
    if (!vm || !vm.hasQuestion) return;
    const question = vm.question;
    if (!question || !question.id) return;

    if (!this.state.difficultyOverrides) {
      this.state.difficultyOverrides = {};
    }
    this.state.difficultyOverrides[question.id] = label;
    saveDifficultyOverridesToStorage(this.state.difficultyOverrides);
    this.render();
  }

  handlePrev() {
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });
  goToPrevQuestion(this.state, this.questions);
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  handleNext() {
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });
  goToNextQuestion(this.state, this.questions);
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  // --- Handlers: review / experiment ---------------------------------

  handleReviewToggle(checked) {
  const vm = getCurrentQuestionViewModel(this.state, this.questions);
  if (!vm || !vm.hasQuestion) return;

  const session = vm.session;
  if (!session) return;

  if (!session.reviewFlags) {
    session.reviewFlags = {};
  }
  const isMarked = !!checked;
  session.reviewFlags[vm.question.id] = isMarked;

  // Log review_toggled for analytics.
  try {
    trackEvent(
      "review_toggled",
      {
        sessionId: session.sessionId || session.key,
        mode: this.state.currentMode,
        chapterId: this.state.currentChapterId
      },
      {
        questionIndex: vm.questionIndex,
        isMarked
      }
    );
  } catch (err) {
    console.warn("Analytics tracking failed (review_toggled):", err);
  }
}


  handleReviewMarkedClick() {
  // Record time on the current question before switching into/out of review mode.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  const vm = getCurrentQuestionViewModel(this.state, this.questions);
  const session = vm.session;
  if (!session || !session.indices || !session.indices.length) return;

  // If already in review mode and we have a backup, restore the full session.
  if (this.isInReviewMode && this.reviewBackupSession) {
    const { currentMode, currentChapterId } = this.state;
    const key = makeSessionKey(currentMode, currentChapterId);
    setSession(this.state, currentMode, currentChapterId, this.reviewBackupSession);
    this.isInReviewMode = false;
    this.reviewBackupSession = null;
    this.startTimerFromScratch();
    this.markCurrentQuestionEntryForTiming();
    this.render();
    return;
  }

  // Not in review mode: create a filtered session that only includes
  // questions flagged for review.
  const flaggedIndices = [];
  const reviewFlags = session.reviewFlags || {};
  const indices = session.indices || [];
  for (let i = 0; i < indices.length; i += 1) {
    const qIndex = indices[i];
    const question = this.questions[qIndex];
    if (!question) continue;
    if (reviewFlags[question.id]) {
      flaggedIndices.push(qIndex);
    }
  }

  if (!flaggedIndices.length) {
    alert("No questions are marked for review.");
    return;
  }

  // Back up the full session so we can restore it later.
  this.reviewBackupSession = {
    ...session,
    indices: [...(session.indices || [])],
    answers: { ...(session.answers || {}) },
    correctFlags: { ...(session.correctFlags || {}) },
    reviewFlags: { ...(session.reviewFlags || {}) }
  };
  this.isInReviewMode = true;

  // Build a new session containing only the flagged questions.
  const { currentMode, currentChapterId } = this.state;
  const newSession = createEmptySession(flaggedIndices);
  const key = makeSessionKey(currentMode, currentChapterId);
  newSession.key = key;
  newSession.sessionId = `${key}::review::${Date.now()}`;
  setSession(this.state, currentMode, currentChapterId, newSession);

  this.startTimerFromScratch();
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  handleExperimentChaptersChange(chapters) {
    this.state.experimentConfig.chapters =
      chapters && chapters.length ? chapters : [this.state.currentChapterId];
  }

  handleExperimentSizeChange(size) {
    this.state.experimentConfig.sessionSize = size || 10;
  }

  handleBuildExperiment() {
  // Build a fresh Experiment session based on the current config
  this.isInReviewMode = false;
  this.reviewBackupSession = null;
  this.state.studyReveal = false;

  // Record time on the current question before starting the experiment session.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  this.stopTimer();
  setCurrentMode(this.state, "experiment");
  buildExperimentSession(this.state, this.questions);
  this.startTimerFromScratch();
  this.markCurrentQuestionEntryForTiming();
  this.persistExperimentConfig();
  this.render();
}


  // --- Handlers: submit / restart ------------------------------------

  handleSubmit() {
    // Record final time on the current question for this session.
    this.trackQuestionTimeIfPossible({ wasSubmitted: true });
    this.stopTimer();
    const resultsVm = computeSessionResults(this.state, this.questions);
    const reviewMetrics = computeReviewMetrics(this.state, this.questions);

    const session = getSession(this.state);
    if (session) {
      // Internal in-memory analytics
      logEvent(this.state, "session_submitted", {
        sessionId: session.sessionId,
        totalQuestions: resultsVm.totalQuestions,
        correct: resultsVm.correct,
        answered: resultsVm.answered,
        scorePercent: resultsVm.scorePercent,
        reviewMetrics
      });

      // Persistent client-side analytics (for Analytic Dashboard)
      try {
        const payload = buildSessionSubmittedPayload(this.state, this.questions);
        if (payload) {
          trackEvent(
            "session_submitted",
            {
              sessionId: session.sessionId || session.key,
              mode: this.state.currentMode,
              chapterId: this.state.currentChapterId
            },
            payload
          );
        }
      } catch (err) {
        // Never break the app for analytics.
        console.warn("Analytics tracking failed:", err);
      }
    }

    this.view.renderResults(resultsVm, { reviewMetrics });
    this.persistDifficultyOverrides();
    this.persistExperimentConfig();
    this.refreshSuggestedSessionStrip();
  }

  handleRestart() {
  // Changing context; clear any active Review Marked state and Study reveal.
  this.isInReviewMode = false;
  this.reviewBackupSession = null;
  this.state.studyReveal = false;

  // Record time on the current question before restarting.
  this.trackQuestionTimeIfPossible({ wasSubmitted: false });

  this.stopTimer();
  const key = makeSessionKey(
    this.state.currentMode,
    this.state.currentChapterId
  );
  this.state.sessionStates.delete(key);
  ensureSessionInitialized(this.state, this.questions);
  this.startTimerIfNeeded();
  this.markCurrentQuestionEntryForTiming();
  this.render();
}


  // --- Analytics overlay --------------------------------------

  updateMasteryButtonVisibility() {
    if (!this.masteryBtn) return;
    // Hide Analytics in Exam mode; show in Study & Experiment.
    if (this.state.currentMode === "exam") {
      this.masteryBtn.style.display = "none";
    } else {
      this.masteryBtn.style.display = "";
    }
  }

// --- Suggested Next Session strip (Release 6.7b) --------------------

refreshSuggestedSessionStrip() {
  if (!this.suggestedStripEl) return;

  // Only show the suggestion entry point in Study mode.
  if (this.state.currentMode !== "study") {
    this.suggestedStripEl.hidden = true;
    if (this.suggestedPopupEl) {
      this.suggestedPopupEl.hidden = true;
    }
    return;
  }

  if (this.suggestedStripDismissed) {
    this.suggestedStripEl.hidden = true;
    if (this.suggestedPopupEl) {
      this.suggestedPopupEl.hidden = true;
    }
    return;
  }

  const stats = loadAggregatedStats();
  const difficultyInsights = loadDifficultyInsights();
  const timeline = loadTimelineAndStreaks();
  const goals = loadGoalsFromStorage();

  const recommendation = computeRecommendation(
    stats,
    difficultyInsights,
    timeline,
    goals
  );

  // If the recommendation engine has nothing useful yet, hide the pill.
  if (!recommendation) {
    this.currentRecommendation = null;
    this.suggestedStripEl.hidden = true;
    if (this.suggestedPopupEl) {
      this.suggestedPopupEl.hidden = true;
    }
    return;
  }

  this.currentRecommendation = recommendation;

  const parts = [];

  const modeLabel =
    recommendation.mode === "exam"
      ? "Exam mode"
      : recommendation.mode === "study"
      ? "Study mode"
      : recommendation.mode === "experiment"
      ? "Experiment mode"
      : null;
  if (modeLabel) parts.push(modeLabel);

  const chapterId = recommendation.chapterId;
  if (chapterId) {
    const chapterLabel =
      chapterId === "ch1"
        ? "Chapter 1"
        : chapterId === "ch2"
        ? "Chapter 2"
        : chapterId === "ch3"
        ? "Chapter 3"
        : chapterId === "ch4"
        ? "Chapter 4"
        : null;
    if (chapterLabel) parts.push(chapterLabel);
  }

  const difficultyLevel = recommendation.difficulty;
  const difficultyLabel =
    difficultyLevel === "easy"
      ? "Easy difficulty"
      : difficultyLevel === "medium"
      ? "Medium difficulty"
      : difficultyLevel === "difficult"
      ? "Difficult questions"
      : null;
  if (difficultyLabel) parts.push(difficultyLabel);

  const lengthLabel =
    recommendation.examLength === "quick"
      ? "Quick Check (10)"
      : recommendation.examLength === "full"
      ? "Full Exam"
      : null;
  if (lengthLabel) parts.push(lengthLabel);

  const sentence =
    parts.length > 0
      ? `Suggested: ${parts.join(", ")}.`
      : "Suggested: We have a personalized next session based on your recent performance.";

  if (this.suggestedSessionTextEl) {
    this.suggestedSessionTextEl.textContent = sentence;
  }

  if (this.suggestedSessionReasonsEl) {
    const reasons = Array.isArray(recommendation.reasons)
      ? recommendation.reasons
      : [];
    const toShow = reasons.slice(0, 2);
    if (toShow.length) {
      const items = toShow.map((r) => `<li>${r}</li>`).join("");
      this.suggestedSessionReasonsEl.innerHTML = items;
      this.suggestedSessionReasonsEl.style.display = "";
    } else {
      this.suggestedSessionReasonsEl.innerHTML = "";
      this.suggestedSessionReasonsEl.style.display = "none";
    }
  }

  this.suggestedStripEl.hidden = false;
  if (this.suggestedPopupEl) {
    this.suggestedPopupEl.hidden = true;
  }
}


handleSuggestedSessionPillClick() {
  if (!this.currentRecommendation) {
    this.refreshSuggestedSessionStrip();
    if (!this.currentRecommendation) return;
  }
  if (this.suggestedPopupEl) {
    this.suggestedPopupEl.hidden = false;
  }
}


handleApplySuggestedSession() {
  if (!this.currentRecommendation) return;

  const rec = this.currentRecommendation;

  if (rec.mode && rec.mode !== this.state.currentMode) {
    this.handleModeChange(rec.mode);
  }

  if (rec.chapterId && rec.chapterId !== this.state.currentChapterId) {
    this.handleChapterChange(rec.chapterId);
  }

  if (rec.examLength === "quick") {
    this.handleExamTemplateChange("quick10");
  } else if (rec.examLength === "full") {
    this.handleExamTemplateChange("full");
  }

  // Once applied, hide the suggestion for this run.
  this.currentRecommendation = null;
  this.suggestedStripDismissed = true;
  if (this.suggestedStripEl) {
    this.suggestedStripEl.hidden = true;
  }
  if (this.suggestedPopupEl) {
    this.suggestedPopupEl.hidden = true;
  }
}

handleDismissSuggestedSession() {
  this.currentRecommendation = null;
  this.suggestedStripDismissed = true;
  if (this.suggestedStripEl) {
    this.suggestedStripEl.hidden = true;
  }
  if (this.suggestedPopupEl) {
    this.suggestedPopupEl.hidden = true;
  }
}
    handleMasteryClick() {
    const stats = loadAggregatedStats();
    const difficultyInsights = loadDifficultyInsights();
    const timeline = loadTimelineAndStreaks();
    this.renderMasteryOverlay(stats, difficultyInsights, timeline);
  }


    handleMasteryClear() {
    if (
      !window.confirm(
        "Clear all saved analytics for this app on this device? This cannot be undone."
      )
    ) {
      return;
    }
    clearAllAnalytics();
    const stats = loadAggregatedStats(); // should now be empty
    const difficultyInsights = loadDifficultyInsights();
    const timeline = loadTimelineAndStreaks();
    this.renderMasteryOverlay(stats, difficultyInsights, timeline);
  }

  
  renderMasteryOverlay(stats, difficultyInsights, timeline) {
    if (!this.masteryOverlayEl || !this.masteryBodyEl) return;

    const {
      sessionsCount = 0,
      perSection = [],
      perDifficulty = {},
      overallAccuracyPercent = null,
      pace = {},
      behavior = {}
    } = stats || {};

    const {
      difficultyAccuracy = {},
      weakestDifficulty = null,
      strongestDifficulty = null,
      easyBelowMedium = false,
      modeDifficulty = {}
    } = difficultyInsights || {};

    const {
      sessions: timelineSessions = [],
      trend = {},
      practiceStreak = { currentDays: 0, bestDays: 0 },
      highScoreStreak = { threshold: 70, currentSessions: 0, bestSessions: 0 }
    } = timeline || {};

    const goals = loadGoalsFromStorage();
    const recommendation = computeRecommendation(
      stats,
      difficultyInsights,
      timeline,
      goals
    );

    let html = "";


    html += `<p>These analytics are stored only in this browser and are based on all sessions you've submitted on this device.</p>`;
    html += `<p>You have submitted <strong>${sessionsCount}</strong> session${
      sessionsCount === 1 ? "" : "s"
    } so far.</p>`;

    if (overallAccuracyPercent != null) {
      html += `<p>Your overall accuracy across all submitted sessions is <strong>${overallAccuracyPercent}%</strong>.</p>`;
    }

    // Pace Insights
    const totalTimed =
      pace && typeof pace.totalQuestionsWithTiming === "number"
        ? pace.totalQuestionsWithTiming
        : 0;

    html += `<h3>Pace Insights</h3>`;
    if (totalTimed > 0 && (pace.averageTimeMs || pace.medianTimeMs)) {
      const msToSeconds = (ms) =>
        ms != null ? Math.round(ms / 100) / 10 : null; // 1 decimal

      const avgSec = msToSeconds(pace.averageTimeMs);
      const medianSec = msToSeconds(pace.medianTimeMs);

      html += `<p>Based on <strong>${totalTimed}</strong> answered questions with timing data.</p>`;
      html += `<ul class="metrics-list">`;
      if (avgSec != null) {
        html += `<li><strong>Average time per question:</strong> ${avgSec}s</li>`;
      }
      if (medianSec != null) {
        html += `<li><strong>Median time per question:</strong> ${medianSec}s</li>`;
      }

      const fast = pace.fast || {};
      const medium = pace.medium || {};
      const slow = pace.slow || {};

      if (fast.count || medium.count || slow.count) {
        html += `<li><strong>Fast answers:</strong> ${fast.count || 0} question(s)${
          typeof fast.accuracyPercent === "number"
            ? ` – ${fast.accuracyPercent}% correct`
            : ""
        }</li>`;
        html += `<li><strong>Medium-paced answers:</strong> ${
          medium.count || 0
        } question(s)${
          typeof medium.accuracyPercent === "number"
            ? ` – ${medium.accuracyPercent}% correct`
            : ""
        }</li>`;
        html += `<li><strong>Slow answers:</strong> ${slow.count || 0} question(s)${
          typeof slow.accuracyPercent === "number"
            ? ` – ${slow.accuracyPercent}% correct`
            : ""
        }</li>`;
      }
      html += `</ul>`;
    } else {
      const totalTimingEvents =
        pace && typeof pace.totalTimingEvents === "number"
          ? pace.totalTimingEvents
          : 0;

      if (totalTimingEvents === 0) {
        html += `<p>We don't have any timing data yet to estimate your pace. Try answering a few questions and navigating with <strong>Next</strong>/<strong>Previous</strong>, then open Analytics again.</p>`;
      } else {
        html += `<p>We have some timing data recorded (<strong>${totalTimingEvents}</strong> timing events), but not enough high-quality data yet to estimate your pace. Keep answering questions and we'll refine this section.</p>`;
      }
    }

    // Difficulty Insights (Release 6.4)
    html += `<h3>Difficulty Insights</h3>`;

    const easyAcc =
      difficultyAccuracy.easy && typeof difficultyAccuracy.easy.accuracyPercent === "number"
        ? difficultyAccuracy.easy.accuracyPercent
        : null;
    const medAcc =
      difficultyAccuracy.medium && typeof difficultyAccuracy.medium.accuracyPercent === "number"
        ? difficultyAccuracy.medium.accuracyPercent
        : null;
    const diffAcc =
      difficultyAccuracy.difficult && typeof difficultyAccuracy.difficult.accuracyPercent === "number"
        ? difficultyAccuracy.difficult.accuracyPercent
        : null;

    if (easyAcc != null || medAcc != null || diffAcc != null) {
      const strongestLabel =
        strongestDifficulty === "easy"
          ? "Easy"
          : strongestDifficulty === "medium"
          ? "Medium"
          : strongestDifficulty === "difficult"
          ? "Difficult"
          : null;
      const weakestLabel =
        weakestDifficulty === "easy"
          ? "Easy"
          : weakestDifficulty === "medium"
          ? "Medium"
          : weakestDifficulty === "difficult"
          ? "Difficult"
          : null;

      if (strongestLabel || weakestLabel) {
        html += `<p>`;
        if (strongestLabel) {
          const strongestPct =
            strongestDifficulty === "easy"
              ? easyAcc
              : strongestDifficulty === "medium"
              ? medAcc
              : strongestDifficulty === "difficult"
              ? diffAcc
              : null;
          html += `You're strongest on <strong>${strongestLabel}</strong> questions${
            strongestPct != null ? ` (${strongestPct}% correct)` : ""
          }. `;
        }
        if (weakestLabel) {
          const weakestPct =
            weakestDifficulty === "easy"
              ? easyAcc
              : weakestDifficulty === "medium"
              ? medAcc
              : weakestDifficulty === "difficult"
              ? diffAcc
              : null;
          html += `Your lowest accuracy is on <strong>${weakestLabel}</strong> questions${
            weakestPct != null ? ` (${weakestPct}% correct)` : ""
          }. `;
        }
        if (easyBelowMedium && easyAcc != null && medAcc != null) {
          html += `You struggle more on Easy than Medium questions — this might mean you're under-reading simpler prompts.`;
        }
        html += `</p>`;
      }

      html += `<table class="metrics-table">
        <thead>
          <tr>
            <th>Difficulty</th>
            <th>Correct</th>
            <th>Total</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>`;

      ["easy", "medium", "difficult"].forEach((level) => {
        const row = difficultyAccuracy[level] || {};
        const label =
          level === "easy" ? "Easy" : level === "medium" ? "Medium" : "Difficult";
        const correct = row.correct || 0;
        const total = row.total || 0;
        const pct =
          typeof row.accuracyPercent === "number" ? row.accuracyPercent : null;
        html += `<tr>
          <td>${label}</td>
          <td>${correct}</td>
          <td>${total}</td>
          <td>${pct != null ? `${pct}%` : "—"}</td>
        </tr>`;
      });

      html += `</tbody></table>`;

      // Mode-aware difficulty summary
      html += `<p><strong>By mode:</strong></p>`;
      html += `<table class="metrics-table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Easy</th>
            <th>Medium</th>
            <th>Difficult</th>
          </tr>
        </thead>
        <tbody>`;

      ["exam", "study", "experiment"].forEach((modeKey) => {
        const row = (modeDifficulty && modeDifficulty[modeKey]) || {};
        const label =
          modeKey === "exam"
            ? "Exam"
            : modeKey === "study"
            ? "Study"
            : "Experiment";
        const e = row.easy || {};
        const m = row.medium || {};
        const d = row.difficult || {};
        const fmt = (obj) =>
          typeof obj.accuracyPercent === "number"
            ? `${obj.accuracyPercent}%`
            : "—";
        html += `<tr>
          <td>${label}</td>
          <td>${fmt(e)}</td>
          <td>${fmt(m)}</td>
          <td>${fmt(d)}</td>
        </tr>`;
      });

      html += `</tbody></table>`;
    } else {
      html += `<p>We don't yet have enough data to summarize difficulty accuracy. Complete a few more sessions to see where you're strongest and weakest.</p>`;
    }

    // Review & Behavior Insights
    if (!sessionsCount) {
      html += `<p>Complete a session and click <strong>Analytics</strong> to see your progress.</p>`;
    } else {
      html += `<h3>Review & Behavior Insights</h3>`;

      const totalQuestions = behavior.totalQuestions || 0;
      const reviewedCount = behavior.reviewedQuestionsCount || 0;
      const changedCount = behavior.changedAnswersCount || 0;
      const reviewedPct =
        typeof behavior.reviewedQuestionsPercent === "number"
          ? behavior.reviewedQuestionsPercent
          : null;
      const changedPct =
        typeof behavior.changedAnswersPercent === "number"
          ? behavior.changedAnswersPercent
          : null;

      if (totalQuestions > 0) {
        html += `<ul class="metrics-list">`;
        html += `<li><strong>Questions marked for review:</strong> ${reviewedCount} question(s)${
          reviewedPct != null
            ? ` (${reviewedPct}% of all questions you've attempted)`
            : ""
        }</li>`;
        html += `<li><strong>Questions where you changed your answer at least once:</strong> ${changedCount} question(s)${
          changedPct != null
            ? ` (${changedPct}% of all questions you've attempted)`
            : ""
        }</li>`;
        html += `</ul>`;
      } else {
        html += `<p>We don't yet have enough data about your review and answer-changing behavior. Keep using <strong>Mark for review</strong> and adjusting answers during your sessions, then open Analytics again.</p>`;
      }
    }

    // Session Timeline & Streaks (Release 6.5)
    if (timelineSessions && timelineSessions.length) {
      html += `<h3>Session Timeline & Streaks</h3>`;

      const lastScore =
        typeof trend.lastScore === "number" ? `${trend.lastScore}%` : "—";
      const avg5 =
        typeof trend.rollingAvgLast5 === "number"
          ? `${trend.rollingAvgLast5}%`
          : "—";
      const avg10 =
        typeof trend.rollingAvgLast10 === "number"
          ? `${trend.rollingAvgLast10}%`
          : "—";

      html += `<p>Your most recent session score is <strong>${lastScore}</strong>. Over your last 5 sessions, your average score is <strong>${avg5}</strong>; over your last 10 sessions, it's <strong>${avg10}</strong>.</p>`;

      const currentDays =
        typeof practiceStreak.currentDays === "number"
          ? practiceStreak.currentDays
          : 0;
      const bestDays =
        typeof practiceStreak.bestDays === "number"
          ? practiceStreak.bestDays
          : 0;

      const currentSessions =
        typeof highScoreStreak.currentSessions === "number"
          ? highScoreStreak.currentSessions
          : 0;
      const bestSessions =
        typeof highScoreStreak.bestSessions === "number"
          ? highScoreStreak.bestSessions
          : 0;
      const threshold =
        typeof highScoreStreak.threshold === "number"
          ? highScoreStreak.threshold
          : 70;

      html += `<ul class="metrics-list">
        <li><strong>Current daily practice streak:</strong> ${currentDays} day${
          currentDays === 1 ? "" : "s"
        }</li>
        <li><strong>Best daily practice streak:</strong> ${bestDays} day${
          bestDays === 1 ? "" : "s"
        }</li>
        <li><strong>Current high-score streak:</strong> ${currentSessions} session${
          currentSessions === 1 ? "" : "s"
        } at ≥ ${threshold}%</li>
        <li><strong>Best high-score streak:</strong> ${bestSessions} session${
          bestSessions === 1 ? "" : "s"
        } at ≥ ${threshold}%</li>
      </ul>`;

      // Compact recent session timeline
      html += `<details class="timeline-details">
        <summary>Show recent session timeline</summary>
        <table class="metrics-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Chapter</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>`;

      const formatDate = (ts) => {
        if (typeof ts !== "number") return "—";
        const d = new Date(ts);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };

      timelineSessions.slice(-15).forEach((s, idx) => {
        const score =
          typeof s.scorePercent === "number" ? `${s.scorePercent}%` : "—";
        const modeLabel =
          s.mode === "exam"
            ? "Exam"
            : s.mode === "study"
            ? "Study"
            : s.mode === "experiment"
            ? "Experiment"
            : "—";
        const chapterLabel =
          typeof s.chapterId === "string" ? s.chapterId : s.chapterId || "—";

        html += `<tr>
          <td>${timelineSessions.length - (timelineSessions.length - 1 - idx)}</td>
          <td>${formatDate(s.ts)}</td>
          <td>${modeLabel}</td>
          <td>${chapterLabel}</td>
          <td>${score}</td>
        </tr>`;
      });

      html += `</tbody></table></details>`;
    }

    // Section Mastery
    html += `<h3>Section Mastery</h3>`;
    if (!perSection || !perSection.length) {
      html += `<p>We don't yet have enough data to estimate section mastery. Complete a few sessions and try again.</p>`;
    } else {
      html += `<table class="metrics-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Correct</th>
            <th>Total</th>
            <th>Accuracy</th>
            <th>Mastery</th>
          </tr>
        </thead>
        <tbody>`;

      for (const row of perSection) {
        const { sectionTag, correct, total } = row;
        const accuracyPercent =
          total > 0 ? Math.round((correct / total) * 100) : 0;
        const mastery = computeMasteryLevel(correct, total);
        const masteryLabel =
          mastery === "mastered"
            ? "mastered"
            : mastery === "not_started"
            ? "not started"
            : "in progress";

        html += `<tr>
          <td>${sectionTag}</td>
          <td>${correct}</td>
          <td>${total}</td>
          <td>${accuracyPercent}%</td>
          <td><span class="tag tag-${mastery}">${masteryLabel}</span></td>
        </tr>`;
      }

      html += `</tbody></table>`;
    }

    // Simple difficulty breakdown at the bottom for continuity
    const easy = perDifficulty.easy || { correct: 0, total: 0 };
    const medium = perDifficulty.medium || { correct: 0, total: 0 };
    const difficult = perDifficulty.difficult || { correct: 0, total: 0 };

    const pct = (obj) =>
      obj.total > 0 ? Math.round((obj.correct / obj.total) * 100) : 0;

    html += `<h3>Difficulty Breakdown</h3>`;
    html += `<table class="metrics-table">
      <thead>
        <tr>
          <th>Difficulty</th>
          <th>Correct</th>
          <th>Total</th>
          <th>Accuracy</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Easy</td>
          <td>${easy.correct}</td>
          <td>${easy.total}</td>
          <td>${pct(easy)}%</td>
        </tr>
        <tr>
          <td>Medium</td>
          <td>${medium.correct}</td>
          <td>${medium.total}</td>
          <td>${pct(medium)}%</td>
        </tr>
        <tr>
          <td>Difficult</td>
          <td>${difficult.correct}</td>
          <td>${pct(difficult)}%</td>
        </tr>
      </tbody>
    </table>`;
    // Goals & Recommendations (Release 6.7a)
    const hasGoalsEnabled = this.anyGoalEnabled(goals);

    html += `<h3>Goals & Recommendations</h3>`;

    if (!hasGoalsEnabled) {
      html += `<p>You haven't set any goals yet. Click <strong>Edit goals</strong> below to set accuracy or streak targets and get personalized suggestions.</p>`;
    } else {
      const lines = [];

      if (goals.overall && goals.overall.enabled) {
        lines.push(
          `Overall accuracy target: ${goals.overall.targetAccuracyPercent || 0}%`
        );
      }

      const diffGoals = goals.difficulty || {};
      const diffParts = [];
      if (diffGoals.easy && diffGoals.easy.enabled) {
        diffParts.push(`Easy: ${diffGoals.easy.targetAccuracyPercent || 0}%`);
      }
      if (diffGoals.medium && diffGoals.medium.enabled) {
        diffParts.push(`Medium: ${diffGoals.medium.targetAccuracyPercent || 0}%`);
      }
      if (diffGoals.difficult && diffGoals.difficult.enabled) {
        diffParts.push(
          `Difficult: ${diffGoals.difficult.targetAccuracyPercent || 0}%`
        );
      }
      if (diffParts.length) {
        lines.push(`Difficulty goals – ${diffParts.join(" · ")}`);
      }

      const streakGoal = goals.streak || {};
      if (streakGoal.enabled) {
        lines.push(
          `Streak goals – ${streakGoal.targetPracticeDays || 0} day(s) in a row, ${
            streakGoal.targetHighScoreSessions || 0
          } high-score session(s).`
        );
      }

      const secGoal = goals.sectionFocus || {};
      if (secGoal.enabled) {
        if (Array.isArray(secGoal.preferredSections) && secGoal.preferredSections.length) {
          lines.push(
            `Section focus – ${secGoal.preferredSections.join(", ")}`
          );
        } else {
          lines.push("Section focus – auto-detect weakest sections.");
        }
      }

      if (lines.length) {
        html += `<ul class="metrics-list">`;
        lines.forEach((line) => {
          html += `<li>${line}</li>`;
        });
        html += `</ul>`;
      }
    }

    if (recommendation) {
      const pieces = [];

      if (recommendation.mode === "exam") {
        pieces.push("Exam mode");
      } else if (recommendation.mode === "experiment") {
        pieces.push("Experiment mode");
      } else {
        pieces.push("Study mode");
      }

      if (recommendation.difficulty === "easy") {
        pieces.push("Easy questions");
      } else if (recommendation.difficulty === "medium") {
        pieces.push("Medium questions");
      } else if (recommendation.difficulty === "difficult") {
        pieces.push("Difficult questions");
      }

      if (recommendation.examLength === "quick") {
        pieces.push("Quick check");
      } else if (recommendation.examLength === "full") {
        pieces.push("Full session");
      }

      const summary = pieces.join(" · ");

      html += `<p><strong>Suggested next session:</strong> ${summary}.</p>`;

      if (Array.isArray(recommendation.reasons) && recommendation.reasons.length) {
        html += `<ul class="metrics-list">`;
        recommendation.reasons.forEach((reason) => {
          html += `<li>${reason}</li>`;
        });
        html += `</ul>`;
      }
    } else if (sessionsCount > 0) {
      html += `<p>We don't yet have enough data to compute a suggestion. Complete a few more sessions and try again.</p>`;
    }

    html += `<p><button type="button" id="goalsEditBtn">Edit goals</button></p>`;



    this.masteryBodyEl.innerHTML = html;
    this.masteryOverlayEl.hidden = false;

    const goalsEditBtn = this.masteryBodyEl.querySelector("#goalsEditBtn");
    if (goalsEditBtn) {
      goalsEditBtn.addEventListener("click", () => {
        const currentGoals = loadGoalsFromStorage();
        this.editGoalsViaPrompt(currentGoals);
      });
    }
  }



  hideMasteryOverlay() {
    if (this.masteryOverlayEl) {
      this.masteryOverlayEl.hidden = true;
    }
  }


  anyGoalEnabled(goals) {
    if (!goals || typeof goals !== "object") return false;

    if (goals.overall && goals.overall.enabled) return true;

    const diff = goals.difficulty || {};
    if (
      (diff.easy && diff.easy.enabled) ||
      (diff.medium && diff.medium.enabled) ||
      (diff.difficult && diff.difficult.enabled)
    ) {
      return true;
    }

    if (goals.streak && goals.streak.enabled) return true;

    const sec = goals.sectionFocus;
    if (sec && sec.enabled) return true;

    return false;
  }

  editGoalsViaPrompt(currentGoals) {
    const goals = currentGoals || loadGoalsFromStorage();
    const base = goals || {};

    const overall = base.overall || {};
    const diff = base.difficulty || {};
    const streak = base.streak || {};
    const sec = base.sectionFocus || {};

    const newGoals = {
      version: 1,
      overall: {
        enabled: !!overall.enabled,
        targetAccuracyPercent:
          typeof overall.targetAccuracyPercent === "number"
            ? overall.targetAccuracyPercent
            : 70
      },
      difficulty: {
        easy: {
          enabled: diff.easy && !!diff.easy.enabled,
          targetAccuracyPercent:
            diff.easy && typeof diff.easy.targetAccuracyPercent === "number"
              ? diff.easy.targetAccuracyPercent
              : 80
        },
        medium: {
          enabled: diff.medium && !!diff.medium.enabled,
          targetAccuracyPercent:
            diff.medium && typeof diff.medium.targetAccuracyPercent === "number"
              ? diff.medium.targetAccuracyPercent
              : 70
        },
        difficult: {
          enabled: diff.difficult && !!diff.difficult.enabled,
          targetAccuracyPercent:
            diff.difficult &&
            typeof diff.difficult.targetAccuracyPercent === "number"
              ? diff.difficult.targetAccuracyPercent
              : 60
        }
      },
      streak: {
        enabled: !!streak.enabled,
        targetPracticeDays:
          typeof streak.targetPracticeDays === "number"
            ? streak.targetPracticeDays
            : 5,
        targetHighScoreSessions:
          typeof streak.targetHighScoreSessions === "number"
            ? streak.targetHighScoreSessions
            : 3
      },
      sectionFocus: {
        enabled: !!sec.enabled,
        preferredSections: Array.isArray(sec.preferredSections)
          ? [...sec.preferredSections]
          : []
      }
    };

    try {
      const enableOverall = window.confirm(
        "Enable an overall accuracy goal?\nClick OK for Yes, Cancel for No."
      );
      newGoals.overall.enabled = enableOverall;
      if (enableOverall) {
        const overallInput = window.prompt(
          "Target overall accuracy (%)",
          String(newGoals.overall.targetAccuracyPercent)
        );
        if (overallInput !== null && overallInput.trim() !== "") {
          const parsed = parseInt(overallInput, 10);
          if (Number.isFinite(parsed)) {
            newGoals.overall.targetAccuracyPercent = parsed;
          }
        }
      }

      const configureDifficulty = (levelKey, label) => {
        const existing = newGoals.difficulty[levelKey];
        const enable = window.confirm(
          `Enable a goal for ${label} questions?\nClick OK for Yes, Cancel for No.`
        );
        existing.enabled = enable;
        if (enable) {
          const input = window.prompt(
            `Target accuracy (%) for ${label} questions`,
            String(existing.targetAccuracyPercent)
          );
          if (input !== null && input.trim() !== "") {
            const parsed = parseInt(input, 10);
            if (Number.isFinite(parsed)) {
              existing.targetAccuracyPercent = parsed;
            }
          }
        }
      };

      configureDifficulty("easy", "Easy");
      configureDifficulty("medium", "Medium");
      configureDifficulty("difficult", "Difficult");

      const enableStreak = window.confirm(
        "Enable a practice/high-score streak goal?\nClick OK for Yes, Cancel for No."
      );
      newGoals.streak.enabled = enableStreak;
      if (enableStreak) {
        const daysInput = window.prompt(
          "Target number of practice days in a row",
          String(newGoals.streak.targetPracticeDays)
        );
        if (daysInput !== null && daysInput.trim() !== "") {
          const parsed = parseInt(daysInput, 10);
          if (Number.isFinite(parsed)) {
            newGoals.streak.targetPracticeDays = parsed;
          }
        }

        const hsInput = window.prompt(
          "Target number of high-score sessions (at or above the Analytics high-score threshold)",
          String(newGoals.streak.targetHighScoreSessions)
        );
        if (hsInput !== null && hsInput.trim() !== "") {
          const parsed = parseInt(hsInput, 10);
          if (Number.isFinite(parsed)) {
            newGoals.streak.targetHighScoreSessions = parsed;
          }
        }
      }

      const enableSectionFocus = window.confirm(
        "Enable a section-focus goal (specific sections you want to improve)?\nClick OK for Yes, Cancel for No."
      );
      newGoals.sectionFocus.enabled = enableSectionFocus;
      if (enableSectionFocus) {
        const currentList = newGoals.sectionFocus.preferredSections.join(", ");
        const secInput = window.prompt(
          "Enter section IDs, separated by commas (for example: 1.1, 1.2, 2.3).\nLeave blank to let the app auto-detect weak sections.",
          currentList
        );
        if (secInput !== null) {
          const tokens = secInput
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          newGoals.sectionFocus.preferredSections = tokens;
        }
      }
    } catch (err) {
      // If prompts are blocked, do nothing.
    }

    saveGoalsToStorage(newGoals);

    const stats = loadAggregatedStats();
    const difficultyInsights = loadDifficultyInsights();
    const timeline = loadTimelineAndStreaks();
    this.renderMasteryOverlay(stats, difficultyInsights, timeline);
    this.refreshSuggestedSessionStrip();
  }

  // --- Persistence ----------------------------------------------------

  persistDifficultyOverrides() {
    saveDifficultyOverridesToStorage(this.state.difficultyOverrides);
  }

  persistExperimentConfig() {
    saveExperimentConfigToStorage(this.state.experimentConfig);
  }
}