const Character = require("./character");
const PopupManager = require("./popup");
const { States, StateMachine } = require("./states");

const puddly = document.getElementById("puddly-container");

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

// -------------------------------------
// Walking Animations
// -------------------------------------

function walkIn(callback) {

    Character.startWalking("right");

    puddly.style.transition = "right 2s ease";
    puddly.style.right = "30px";

    setTimeout(() => {

        Character.stopWalking();

        if (callback) callback();

    }, 2000);

}

function walkOut(callback) {

    Character.startWalking("left");

    puddly.style.transition = "right 2s ease";
    puddly.style.right = "-250px";

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

            break;

        case States.WAVING:

            walkIn(() => {

                Character.showWaving();

                popup.show(
                    "💕 Hiii gurlll!!\nIt's time for some water 💧",
                    true
                );

            });

            break;

        case States.DRINKING:

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
// App Start
// -------------------------------------

window.onload = () => {

    console.log("Puddly Started");

    // Start hidden off-screen
    puddly.style.right = "-250px";

    // Character is standing off-screen
    Character.showStanding();

    // Demo: walk in after 3 seconds
    setTimeout(() => {

        machine.transitionTo(States.WAVING);

    }, 3000);

};
