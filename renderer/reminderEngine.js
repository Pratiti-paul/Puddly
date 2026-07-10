const Timer = require("./timer");

const DEFAULT_PREFERENCES = {
    dndMode: "off",
    dndUntil: null,
    reminderIntervalMinutes: 90
};

const ONE_MINUTE_MS = 60 * 1000;

class ReminderEngine {
    constructor(options) {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.timer = new Timer(0, () => this.handleTimeout());
        this.isStarted = false;
        this.isWaitingForDndToExpire = false;
        this.getCurrentState = options.getCurrentState;
        this.onReminderDue = options.onReminderDue;
        this.standingState = options.standingState;
    }

    start(preferences, initialDelayMs = this.getReminderIntervalMs(preferences)) {
        this.preferences = this.normalizePreferences(preferences);
        this.isStarted = true;
        this.scheduleNext(initialDelayMs);
    }

    stop() {
        this.isWaitingForDndToExpire = false;
        this.timer.stop();
    }

    pauseForInteraction() {
        this.isWaitingForDndToExpire = false;
        this.timer.stop();
    }

    applyPreferences(preferences) {
        this.preferences = this.normalizePreferences(preferences);

        if (!this.isStarted || !this.isStanding()) {
            return;
        }

        this.scheduleNext();
    }

    scheduleAfterInteraction() {
        if (!this.isStarted) {
            return;
        }

        this.scheduleNext();
    }

    scheduleNext(delayMs = this.getReminderIntervalMs()) {
        if (!this.isStarted) {
            return;
        }

        if (this.isDndActive()) {
            this.isWaitingForDndToExpire = true;
            this.timer.reset(this.getDndRemainingMs());
            return;
        }

        this.isWaitingForDndToExpire = false;
        this.timer.reset(delayMs);
    }

    handleTimeout() {
        if (this.isWaitingForDndToExpire) {
            this.isWaitingForDndToExpire = false;
            this.scheduleNext();
            return;
        }

        if (this.isDndActive()) {
            this.scheduleNext();
            return;
        }

        if (!this.isStanding()) {
            this.scheduleNext(ONE_MINUTE_MS);
            return;
        }

        this.onReminderDue();
    }

    isDndActive() {
        return Boolean(this.preferences.dndUntil && this.preferences.dndUntil > Date.now());
    }

    getDndRemainingMs() {
        return Math.max(this.preferences.dndUntil - Date.now(), 0);
    }

    getReminderIntervalMs(preferences = this.preferences) {
        return preferences.reminderIntervalMinutes * ONE_MINUTE_MS;
    }

    isStanding() {
        return this.getCurrentState() === this.standingState;
    }

    normalizePreferences(preferences) {
        const normalized = {
            ...DEFAULT_PREFERENCES,
            ...preferences
        };
        const interval = Number(normalized.reminderIntervalMinutes);

        normalized.reminderIntervalMinutes = Number.isFinite(interval) && interval > 0
            ? Math.round(interval)
            : DEFAULT_PREFERENCES.reminderIntervalMinutes;

        return normalized;
    }
}

module.exports = {
    ReminderEngine,
    DEFAULT_PREFERENCES
};
