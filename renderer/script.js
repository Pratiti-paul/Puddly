const Character = require("./character");
const PopupManager = require("./popup");
const { States, StateMachine } = require("./states");

const puddly = document.getElementById("puddly-container");

// ----------------------------------
// Popup
// ----------------------------------

const popup = new PopupManager(
    onDrank,
    onSnooze,
    onQuit
);

// ----------------------------------
// State Machine
// ----------------------------------

const machine = new StateMachine(
    States.STANDING,
    handleStateChange
);

// ----------------------------------
// Walking
// ----------------------------------

function walkIn(callback){

    Character.startWalking();

    puddly.style.transition = "right .9s ease";
    puddly.style.right = "30px";

    setTimeout(() => {

        Character.stopWalking();

        if(callback){
            callback();
        }

    },900);

}

function walkOut(callback){

    Character.startWalking();

    puddly.style.transition = "right .9s ease";
    puddly.style.right = "-250px";

    setTimeout(() => {

        Character.stopWalking();
        Character.showStanding();

        if(callback){
            callback();
        }

    },900);

}

// ----------------------------------
// State Changes
// ----------------------------------

function handleStateChange(state){

    console.log("[STATE]",state);

    switch(state){

        case States.STANDING:

            Character.showStanding();
            popup.hide();

            break;

        case States.WAVING:

            walkIn(()=>{

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

            setTimeout(()=>{

                popup.hide();

                walkOut(()=>{

                    machine.transitionTo(States.STANDING);

                });

            },3000);

            break;

        case States.SAD:

            Character.showSad();

            popup.show(
                "Okkayy 🥺\nI'll remind you again soon.",
                false
            );

            setTimeout(()=>{

                popup.hide();

                walkOut(()=>{

                    machine.transitionTo(States.STANDING);

                });

            },3000);

            break;

    }

}

// ----------------------------------
// Buttons
// ----------------------------------

function onDrank(){

    machine.transitionTo(States.DRINKING);

}

function onSnooze(){

    machine.transitionTo(States.SAD);

}

function onQuit(){

    window.close();

}

// ----------------------------------
// Debug
// ----------------------------------

window.machine = machine;
window.States = States;

window.showStanding = () => machine.transitionTo(States.STANDING);
window.showWaving = () => machine.transitionTo(States.WAVING);
window.showDrinking = () => machine.transitionTo(States.DRINKING);
window.showSad = () => machine.transitionTo(States.SAD);

// ----------------------------------
// Start App
// ----------------------------------

window.onload = () => {

    console.log("Puddly Started");

    // Start hidden
    puddly.style.right = "-250px";

    machine.transitionTo(States.STANDING);

    // Demo after 3 sec
    setTimeout(()=>{

        machine.transitionTo(States.WAVING);

    },3000);

};