const States = {
  STANDING: 'STANDING',
  WAVING: 'WAVING',
  DRINKING: 'DRINKING',
  SAD: 'SAD'
};

class StateMachine {
  constructor(initialState, onStateChange) {
    this.currentState = initialState;
    this.onStateChange = onStateChange;
  }

  transitionTo(nextState) {
    console.log(`State transition: ${this.currentState} -> ${nextState}`);
    this.currentState = nextState;
    if (this.onStateChange) {
      this.onStateChange(nextState);
    }
  }

  getCurrentState() {
    return this.currentState;
  }
}

module.exports = { States, StateMachine };