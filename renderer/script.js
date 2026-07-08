const { ipcRenderer } = require("electron");
const Character = require("./character");
const PopupManager = require("./popup");
const { States, StateMachine } = require("./states");
const Timer = require("./timer");
const { registerCompanionDrag } = require("./windowDrag");

const puddly = document.getElementById("puddly-container");
const companion = document.querySelector(".companion-container");
const HIDDEN_RIGHT_OFFSET = "-320px";
const VISIBLE_RIGHT_OFFSET = "30px";
const DEFAULT_PREFERENCES = {
    dndMode: "off",
    dndUntil: null,
    reminderIntervalMinutes: 90
};
const ONE_MINUTE_MS = 60 * 1000;
const INITIAL_REMINDER_DELAY_MS = 3000;
const reminderTimer = new Timer(0, handleReminderTimeout);

let preferences = { ...DEFAULT_PREFERENCES };
let preferencesLoaded = false;

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
            scheduleNextReminder();

            break;

        case States.WAVING:

            reminderTimer.stop();

            walkIn(() => {

                Character.showWaving();

                popup.show(
                    "💕 Hiii gurlll!!\nIt's time for some water 💧",
                    true
                );

            });

            break;

        case States.DRINKING:

            reminderTimer.stop();
            Character.showDrinking();

            popup.show(
                "Yayyy!! 💖\nGood job staying hydrated!",
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

            reminderTimer.stop();
            Character.showSad();

            popup.show(
                "Okkayy 🥺\nI'll remind you again soon.",
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

// -------------------------------------
// Reminder Scheduling
// -------------------------------------

function reminderIntervalMs() {
    return preferences.reminderIntervalMinutes * ONE_MINUTE_MS;
}

function isDndActive() {
    return Boolean(preferences.dndUntil && preferences.dndUntil > Date.now());
}

function scheduleNextReminder(delayMs = reminderIntervalMs()) {
    if (!preferencesLoaded) {
        return;
    }

    if (isDndActive()) {
        reminderTimer.reset(preferences.dndUntil - Date.now());
        return;
    }

    reminderTimer.reset(delayMs);
}

function handleReminderTimeout() {
    if (isDndActive()) {
        scheduleNextReminder();
        return;
    }

    if (machine.is(States.STANDING)) {
        machine.transitionTo(States.WAVING);
        return;
    }

    scheduleNextReminder(ONE_MINUTE_MS);
}

function applyPreferences(nextPreferences) {
    preferences = {
        ...DEFAULT_PREFERENCES,
        ...nextPreferences
    };

    if (preferencesLoaded && machine.is(States.STANDING)) {
        scheduleNextReminder();
    }
}

ipcRenderer.on("preferences:changed", (event, nextPreferences) => {
    applyPreferences(nextPreferences);
});

ipcRenderer.on("app-quitting", () => {
    reminderTimer.stop();
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

    applyPreferences(await ipcRenderer.invoke("preferences:get"));
    preferencesLoaded = true;
    scheduleNextReminder(INITIAL_REMINDER_DELAY_MS);

};
