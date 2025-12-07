// js/core/timer.js

export class SessionTimer {
  constructor({ onTick, now = () => Date.now(), intervalMs = 1000 } = {}) {
    this.onTick = onTick;
    this.now = now;
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.startTimeMs = null;
  }

  start(startTimeMs) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startTimeMs = startTimeMs ?? this.now();
    this.intervalId = window.setInterval(() => {
      const elapsed = this.now() - this.startTimeMs;
      if (typeof this.onTick === "function") {
        this.onTick(elapsed);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
