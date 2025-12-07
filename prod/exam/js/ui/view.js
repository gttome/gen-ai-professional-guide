// js/ui/view.js

function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function createView(handlers = {}) {
  const els = {
    modeTabs: document.getElementById("modeTabs"),
    chapterTabs: document.getElementById("chapterTabs"),

    examTemplateBar: document.getElementById("examTemplateBar"),
    examTemplateChips: document.querySelectorAll(
      "#examTemplateChips [data-template]"
    ),

    experimentConfigBar: document.getElementById("experimentConfigBar"),
    experimentChapterChips: document.querySelectorAll(
      "#experimentChapterChips [data-exp-chapter]"
    ),
    experimentSizeChips: document.querySelectorAll(
      "#experimentSizeChips [data-session-size]"
    ),
    buildExperimentBtn: document.getElementById("buildExperimentBtn"),

    timerDisplay: document.getElementById("timerDisplay"),

    questionCounter: document.getElementById("questionCounter"),
    questionDifficulty: document.getElementById("questionDifficulty"),
    questionText: document.getElementById("questionText"),
    answersContainer: document.getElementById("answersContainer"),
    explanationPanel: document.getElementById("explanationPanel"),
    explanationText: document.getElementById("explanationText"),

    reviewCheckbox: document.getElementById("reviewCheckbox"),

    checkAnswerBtn: document.getElementById("checkAnswerBtn"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    submitBtn: document.getElementById("submitBtn"),
    restartBtn: document.getElementById("restartBtn"),
    reviewMarkedBtn: document.getElementById("reviewMarkedBtn"),

    resultsPanel: document.getElementById("resultsPanel"),
    resultsTitle: document.getElementById("resultsTitle"),
    resultsSummary: document.getElementById("resultsSummary"),
    resultsBreakdown: document.getElementById("resultsBreakdown"),


  };

  // --- Event wiring ---------------------------------------------------

  if (els.modeTabs) {
    els.modeTabs.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        handlers.onModeChange && handlers.onModeChange(mode);
      });
    });
  }

  if (els.chapterTabs) {
    els.chapterTabs.querySelectorAll("[data-chapter-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chapterId = btn.getAttribute("data-chapter-id");
        handlers.onChapterChange && handlers.onChapterChange(chapterId);
      });
    });
  }

  if (els.examTemplateChips) {
    els.examTemplateChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const template = chip.getAttribute("data-template");
        handlers.onExamTemplateChange &&
          handlers.onExamTemplateChange(template);
      });
    });
  }

  if (els.checkAnswerBtn) {
    els.checkAnswerBtn.addEventListener("click", () => {
      handlers.onCheckAnswer && handlers.onCheckAnswer();
    });
  }

  if (els.prevBtn) {
    els.prevBtn.addEventListener("click", () => {
      handlers.onPrev && handlers.onPrev();
    });
  }

  if (els.nextBtn) {
    els.nextBtn.addEventListener("click", () => {
      handlers.onNext && handlers.onNext();
    });
  }

  if (els.submitBtn) {
    els.submitBtn.addEventListener("click", () => {
      handlers.onSubmit && handlers.onSubmit();
    });
  }

  if (els.restartBtn) {
    els.restartBtn.addEventListener("click", () => {
      handlers.onRestart && handlers.onRestart();
    });
  }

  if (els.reviewMarkedBtn) {
    els.reviewMarkedBtn.addEventListener("click", () => {
      handlers.onReviewMarked && handlers.onReviewMarked();
    });
  }

  if (els.experimentChapterChips && els.experimentChapterChips.length) {
    els.experimentChapterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
        if (handlers.onExperimentChaptersChange) {
          const activeChapters = Array.from(
            document.querySelectorAll(
              "#experimentChapterChips [data-exp-chapter].active"
            )
          ).map((btn) => btn.getAttribute("data-exp-chapter"));
          handlers.onExperimentChaptersChange(activeChapters);
        }
      });
    });
  }

  if (els.experimentSizeChips && els.experimentSizeChips.length) {
    els.experimentSizeChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const size = Number(chip.getAttribute("data-session-size") || "10");
        els.experimentSizeChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        handlers.onExperimentSizeChange &&
          handlers.onExperimentSizeChange(size);
      });
    });
  }

  if (els.buildExperimentBtn) {
    els.buildExperimentBtn.addEventListener("click", () => {
      handlers.onBuildExperiment && handlers.onBuildExperiment();
    });
  }

  if (els.questionDifficulty) {
    const diffOptions = ["Easy", "Medium", "Difficult"];
    els.questionDifficulty.addEventListener("click", () => {
      // Cycle: Easy → Medium → Difficult → Easy...
      const current = (els.questionDifficulty.textContent || "").trim();
      const idx = diffOptions.indexOf(current);
      const nextIndex = idx === -1 ? 0 : (idx + 1) % diffOptions.length;
      const next = diffOptions[nextIndex];
      els.questionDifficulty.textContent = next;

      if (handlers.onDifficultyChange) {
        handlers.onDifficultyChange(next);
      }
    });
  }

  if (els.reviewCheckbox) {
    els.reviewCheckbox.addEventListener("change", (e) => {
      handlers.onReviewToggle && handlers.onReviewToggle(!!e.target.checked);
    });
  }


  // --- Render helpers -------------------------------------------------

  function renderTimer(ms) {
    if (!els.timerDisplay) return;
    els.timerDisplay.textContent = formatMs(ms);
  }

  function renderQuestion(vm, state) {
    if (!vm || !vm.hasQuestion) {
      if (els.questionText) {
        els.questionText.textContent =
          "No questions are available for this configuration.";
      }
      if (els.answersContainer) {
        els.answersContainer.innerHTML = "";
      }
      if (els.questionCounter) {
        els.questionCounter.textContent = "";
      }
      if (els.explanationPanel) {
        els.explanationPanel.style.display = "none";
      }
      if (els.reviewCheckbox) {
        els.reviewCheckbox.checked = false;
        els.reviewCheckbox.disabled = true;
      }
      return;
    }

    const {
      question,
      indexInSession,
      totalQuestions,
      answerKey,
      isSubmitted,
      isCorrect,
      isFlagged
    } = vm;

    const mode = state && state.currentMode ? state.currentMode : "exam";

    if (els.questionCounter) {
      els.questionCounter.textContent = `${indexInSession + 1} / ${totalQuestions}`;
    }

    // Difficulty pill hidden in Exam mode
    if (els.questionDifficulty) {
      if (mode === "exam") {
        els.questionDifficulty.textContent = "";
        els.questionDifficulty.style.display = "none";
      } else {
        const overrides =
          (state && state.difficultyOverrides) || {};
        const label =
          (question && overrides[question.id]) ||
          question.difficulty ||
          "";

        els.questionDifficulty.textContent = label;
        els.questionDifficulty.style.display = label
          ? "inline-flex"
          : "none";
      }
    }

    if (els.questionText) {
      els.questionText.textContent = question.prompt || "";
    }

    if (els.answersContainer) {
      els.answersContainer.innerHTML = "";
      (question.options || []).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "answer-option";
        btn.textContent = `${opt.key}. ${opt.text}`;

        if (answerKey === opt.key) {
          btn.classList.add("selected");
        }

        // In Study mode, use the studyReveal flag instead of permanent grading.
        const showMarking =
          mode === "study"
            ? !!(state && state.studyReveal)
            : isSubmitted;

        if (showMarking) {
          if (opt.key === question.correctOptionKey) {
            btn.classList.add("correct");
          } else if (opt.key === answerKey) {
            btn.classList.add("incorrect");
          }
        }

        btn.addEventListener("click", () => {
          handlers.onAnswerSelected && handlers.onAnswerSelected(opt.key);
        });

        els.answersContainer.appendChild(btn);
      });
    }

    // Explanation:
    if (els.explanationPanel && els.explanationText) {
      const revealFlag = !!(state && state.studyReveal);
      const showExplanation =
        mode === "study"
          ? revealFlag && !!question.explanation
          : isSubmitted && revealFlag && !!question.explanation;

      if (showExplanation) {
        els.explanationPanel.style.display = "block";
        els.explanationText.textContent = question.explanation;
      } else {
        els.explanationPanel.style.display = "none";
        els.explanationText.textContent = "";
      }
    }

    if (els.prevBtn) {
      els.prevBtn.disabled = indexInSession === 0;
    }
    if (els.nextBtn) {
      els.nextBtn.disabled = indexInSession === totalQuestions - 1;
    }

    if (els.reviewCheckbox) {
      els.reviewCheckbox.disabled = false;
      els.reviewCheckbox.checked = !!isFlagged;
    }
  }

  function renderModeChrome(state) {
      if (els.modeTabs) {
        els.modeTabs.querySelectorAll("[data-mode]").forEach((btn) => {
          const mode = btn.getAttribute("data-mode");
          btn.classList.toggle("active", mode === state.currentMode);
        });
      }

      if (els.chapterTabs) {
        els.chapterTabs.querySelectorAll("[data-chapter-id]").forEach((btn) => {
          const ch = btn.getAttribute("data-chapter-id");
          btn.classList.toggle("active", ch === state.currentChapterId);
        });
      }

      if (els.examTemplateChips) {
        els.examTemplateChips.forEach((chip) => {
          const template = chip.getAttribute("data-template");
          chip.classList.toggle(
            "active",
            template === state.currentExamTemplateKey
          );
        });
      }

      // Exam length selector only for Study mode
      if (els.examTemplateBar) {
        if (state.currentMode === "study") {
          els.examTemplateBar.style.display = "flex";
        } else {
          els.examTemplateBar.style.display = "none";
        }
      }

      // "Check Answer" visibility + toggle state (Study & Experiment only)
      if (els.checkAnswerBtn) {
        const isVisible = state.currentMode !== "exam";
        els.checkAnswerBtn.style.display = isVisible ? "inline-flex" : "none";

        const isActive = !!state.studyReveal && isVisible;
        els.checkAnswerBtn.classList.add("toggle-pill");
        els.checkAnswerBtn.classList.toggle("toggle-pill-active", isActive);
        els.checkAnswerBtn.setAttribute(
          "aria-pressed",
          isActive ? "true" : "false"
        );
      }

      // Review Marked toggle reflects whether we're in review mode.
      if (els.reviewMarkedBtn) {
        const isReviewMode = !!state.isInReviewMode;
        els.reviewMarkedBtn.classList.add("toggle-pill");
        els.reviewMarkedBtn.classList.toggle("toggle-pill-active", isReviewMode);
        els.reviewMarkedBtn.setAttribute(
          "aria-pressed",
          isReviewMode ? "true" : "false"
        );
      }

      // Experiment config only visible in Experiment mode
      if (els.experimentConfigBar) {
        els.experimentConfigBar.style.display =
          state.currentMode === "experiment" ? "block" : "none";
      }
    }


  function renderResults(resultsVm, options = {}) {
    if (!els.resultsPanel) return;

    const { totalQuestions, answered, correct, scorePercent } = resultsVm;
    const { reviewMetrics } = options;

    els.resultsPanel.style.display = "block";

    if (els.resultsTitle) {
      els.resultsTitle.textContent = "Session Results";
    }

    if (els.resultsSummary) {
      els.resultsSummary.textContent = `You answered ${answered}/${totalQuestions} questions, with ${correct} correct (${scorePercent}%).`;
    }

    if (els.resultsBreakdown) {
      els.resultsBreakdown.innerHTML = "";

      const container = document.createElement("div");

      const ul = document.createElement("ul");
      const li1 = document.createElement("li");
      li1.textContent = `Total questions: ${totalQuestions}`;
      const li2 = document.createElement("li");
      li2.textContent = `Answered: ${answered}`;
      const li3 = document.createElement("li");
      li3.textContent = `Correct: ${correct}`;
      const li4 = document.createElement("li");
      li4.textContent = `Score: ${scorePercent}%`;
      ul.append(li1, li2, li3, li4);
      container.appendChild(ul);

      const reviewBlock = renderReviewInsights(reviewMetrics);
      if (reviewBlock) {
        container.appendChild(reviewBlock);
      }

      els.resultsBreakdown.appendChild(container);
    }
  }

  function renderReviewInsights(metrics) {
    const block = document.createElement("div");
    block.style.marginTop = "0.75rem";

    const title = document.createElement("div");
    title.textContent = "Review behavior:";
    title.style.fontWeight = "600";
    title.style.marginBottom = "0.25rem";
    block.appendChild(title);

    const list = document.createElement("ul");

    if (!metrics) {
      const li = document.createElement("li");
      li.textContent = "No review data available for this session.";
      list.appendChild(li);
      block.appendChild(list);
      return block;
    }

    const {
      flaggedCount,
      flaggedAnswered,
      flaggedCorrect,
      nonFlaggedAnswered,
      nonFlaggedCorrect
    } = metrics;

    if (flaggedCount === 0) {
      const li = document.createElement("li");
      li.textContent = "You did not mark any questions for review.";
      list.appendChild(li);
    } else {
      const li1 = document.createElement("li");
      li1.textContent = `Questions marked for review: ${flaggedCount}`;
      list.appendChild(li1);

      if (flaggedAnswered > 0) {
        const pct = Math.round((flaggedCorrect / flaggedAnswered) * 100);
        const li2 = document.createElement("li");
        li2.textContent = `Accuracy on reviewed questions: ${flaggedCorrect}/${flaggedAnswered} (${pct}%).`;
        list.appendChild(li2);
      } else {
        const li2 = document.createElement("li");
        li2.textContent =
          "You marked questions for review but did not answer them.";
        list.appendChild(li2);
      }
    }

    if (nonFlaggedAnswered > 0) {
      const pctNF = Math.round((nonFlaggedCorrect / nonFlaggedAnswered) * 100);
      const li3 = document.createElement("li");
      li3.textContent = `Accuracy on non-reviewed questions: ${nonFlaggedCorrect}/${nonFlaggedAnswered} (${pctNF}%).`;
      list.appendChild(li3);
    }

    block.appendChild(list);
    return block;
  }

  function hideResults() {
    if (els.resultsPanel) {
      els.resultsPanel.style.display = "none";
    }
  }


  return {
    renderTimer,
    renderQuestion,
    renderModeChrome,
    renderResults,
    hideResults
  };
}
