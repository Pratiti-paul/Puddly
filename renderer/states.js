const logger = require("./logger");

// =========================
// Available Character States
// =========================
const States = {
    STANDING: "standing",
    WAVING: "waving",
    DRINKING: "drinking",
    SAD: "sad"
};

// =========================
// State Machine
// =========================
class StateMachine {

    constructor(initialState, onStateChange = null) {
        this.currentState = initialState;
        this.onStateChange = onStateChange;
    }

    transitionTo(newState) {

        // Ignore if already in same state
        if (this.currentState === newState) {
            return;
        }

        logger.debug(
            `[STATE] ${this.currentState} -> ${newState}`
        );

        this.currentState = newState;

        if (typeof this.onStateChange === "function") {
            this.onStateChange(newState);
        }
    }

    getCurrentState() {
        return this.currentState;
    }

    is(state) {
        return this.currentState === state;
    }
}

// =========================
// Export
// =========================
module.exports = {
    States,
    StateMachine
};
