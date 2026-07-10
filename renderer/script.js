const { ipcRenderer } = require("electron");
const Character = require("./character");
const PopupManager = require("./popup");
const { States, StateMachine } = require("./states");
const { registerCompanionDrag } = require("./windowDrag");
const { ReminderEngine } = require("./reminderEngine");
const {
    getDrinkMessage,
    getReminderMessage,
    getSnoozeMessage
} = require("./messages");

const puddly = document.getElementById("puddly-container");
const companion = document.querySelector(".companion-container");
const HIDDEN_RIGHT_OFFSET = "-320px";
const VISIBLE_RIGHT_OFFSET = "30px";
const INITIAL_REMINDER_DELAY_MS = 3000;

// -------------------------------------
// Popup
// -------------------------------------

const popup = new PopupManager(
    onDrank,
    onSnooze,
    onQuit
);

// -------------------------------------
// State Machine
// -------------------------------------

const machine = new StateMachine(
    States.STANDING,
    handleStateChange
);

registerCompanionDrag(companion);

const reminderEngine = new ReminderEngine({
    standingState: States.STANDING,
    getCurrentState: () => machine.getCurrentState(),
    onReminderDue: () => machine.transitionTo(States.WAVING)
});

// -------------------------------------
// Walking Animations
// -------------------------------------

function walkIn(callback) {

    Character.startWalking("right");

    puddly.style.transition = "right 2s ease";
    puddly.style.right = VISIBLE_RIGHT_OFFSET;

    setTimeout(() => {

        Character.stopWalking();

        if (callback) callback();

    }, 2000);

}

function walkOut(callback) {

    Character.startWalking("left");

    puddly.style.transition = "right 2s ease";
    puddly.style.right = HIDDEN_RIGHT_OFFSET;

    setTimeout(() => {

        Character.stopWalking();
        Character.showStanding();

        if (callback) callback();

    }, 2000);

}

// -------------------------------------
// State Changes
// -------------------------------------

function handleStateChange(state) {

    console.log("[STATE]", state);

    switch (state) {

        case States.STANDING:

            popup.hide();
            Character.showStanding();
            reminderEngine.scheduleAfterInteraction();

            break;

        case States.WAVING:

            reminderEngine.pauseForInteraction();

            walkIn(() => {

                Character.showWaving();

                popup.show(
                    getReminderMessage(),
                    true
                );

            });

            break;

        case States.DRINKING:

            reminderEngine.pauseForInteraction();
            Character.showDrinking();

            popup.show(
                getDrinkMessage(),
                false
            );

            setTimeout(() => {

                popup.hide();

                setTimeout(() => {

                    walkOut(() => {

                        machine.transitionTo(States.STANDING);

                    });

                }, 300);

            }, 2500);

            break;

        case States.SAD:

            reminderEngine.pauseForInteraction();
            Character.showSad();

            popup.show(
                getSnoozeMessage(),
                false
            );

            setTimeout(() => {

                popup.hide();

                setTimeout(() => {

                    walkOut(() => {

                        machine.transitionTo(States.STANDING);

                    });

                }, 300);

            }, 2500);

            break;
    }

}

// -------------------------------------
// Button Actions
// -------------------------------------

function onDrank() {

    machine.transitionTo(States.DRINKING);

}

function onSnooze() {

    machine.transitionTo(States.SAD);

}

function onQuit() {

    window.close();

}

// -------------------------------------
// Debug Helpers
// -------------------------------------

window.machine = machine;
window.States = States;

window.showStanding = () => machine.transitionTo(States.STANDING);
window.showWaving = () => machine.transitionTo(States.WAVING);
window.showDrinking = () => machine.transitionTo(States.DRINKING);
window.showSad = () => machine.transitionTo(States.SAD);

ipcRenderer.on("preferences:changed", (event, nextPreferences) => {
    reminderEngine.applyPreferences(nextPreferences);
});

ipcRenderer.on("app-quitting", () => {
    reminderEngine.stop();
});

// -------------------------------------
// App Start
// -------------------------------------

window.onload = async () => {

    console.log("Puddly Started");

    // Start hidden off-screen
    puddly.style.right = HIDDEN_RIGHT_OFFSET;

    // Character is standing off-screen
    Character.showStanding();

    reminderEngine.start(
        await ipcRenderer.invoke("preferences:get"),
        INITIAL_REMINDER_DELAY_MS
    );

};
