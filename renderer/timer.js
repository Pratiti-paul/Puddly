class Timer {
  constructor(durationMs, onTimeout) {
    this.durationMs = durationMs;
    this.onTimeout = onTimeout;
    this.timerId = null;
  }

  start() {
    this.stop();
    this.timerId = setTimeout(() => {
      if (this.onTimeout) {
        this.onTimeout();
      }
    }, this.durationMs);
  }

  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  reset(newDurationMs) {
    if (newDurationMs !== undefined) {
      this.durationMs = newDurationMs;
    }
    this.start();
  }
}

module.exports = Timer;
