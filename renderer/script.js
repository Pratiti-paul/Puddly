const Character = require("./character");
const PopupManager = require("./popup");
const { States, StateMachine } = require("./states");

// -----------------------------
// Popup
// -----------------------------
const popup = new PopupManager(
    onDrank,
    onSnooze,
    onQuit
);

// -----------------------------
// State Machine
// -----------------------------
const machine = new StateMachine(
    States.STANDING,
    handleStateChange
);

// -----------------------------
// State Changes
// -----------------------------
function handleStateChange(state) {

    switch (state) {

        case States.STANDING:

            Character.showStanding();
            popup.hide();

            break;

        case States.WAVING:

            Character.showWaving();

            popup.show(
                "💕 Hiii gurlll!!\nIt's time for some water 💧",
                true
            );

            break;

        case States.DRINKING:

            Character.showDrinking();

            popup.show(
                "Yayyy!! 💖\nGood job staying hydrated!",
                false
            );

            setTimeout(() => {
                machine.transitionTo(States.STANDING);
            }, 3000);

            break;

        case States.SAD:

            Character.showSad();

            popup.show(
                "Okkayy 🥺\nI'll remind you again soon.",
                false
            );

            setTimeout(() => {
                machine.transitionTo(States.STANDING);
            }, 3000);

            break;
    }
}

// -----------------------------
// Button Callbacks
// -----------------------------
function onDrank() {

    machine.transitionTo(States.DRINKING);

}

function onSnooze() {

    machine.transitionTo(States.SAD);

}

function onQuit() {

    window.close();

}

// -----------------------------
// Debug Helpers
// -----------------------------
window.machine = machine;
window.States = States;

// Easy testing from DevTools
window.showStanding = () => machine.transitionTo(States.STANDING);
window.showWaving = () => machine.transitionTo(States.WAVING);
window.showDrinking = () => machine.transitionTo(States.DRINKING);
window.showSad = () => machine.transitionTo(States.SAD);

// -----------------------------
// Start App
// -----------------------------
window.onload = () => {

    console.log("App Started");

    machine.transitionTo(States.STANDING);

    setTimeout(() => {
        console.log("Going to waving");
        machine.transitionTo(States.WAVING);
    }, 3000);

};