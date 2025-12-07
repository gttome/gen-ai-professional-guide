// js/app.js
import { QUESTIONS } from "./data.js";
import { ExamAppController } from "./controller/ExamAppController.js";

document.addEventListener("DOMContentLoaded", () => {
  const controller = new ExamAppController({ questions: QUESTIONS });
  controller.init();
});
