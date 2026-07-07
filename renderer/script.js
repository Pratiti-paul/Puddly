const PopupManager = require("./popup");

// Character images
const standing = () => Character.showStanding();
const waving = () => Character.showWaving();
const drinking = () => Character.showDrinking();
const sad = () => Character.showSad();

// Popup
const popup = new PopupManager(
    () => {
        console.log("I Drank clicked");
    },
    () => {
        console.log("Snooze clicked");
    }
);

window.onload = () => {

    // Start with standing
    standing();

    // After 3 seconds, wave
    setTimeout(() => {

        waving();

    }, 3000);

    // After 4 seconds, show bubble
    setTimeout(() => {

        popup.showReminder();

    }, 4000);

};