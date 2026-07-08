const character = document.getElementById("puddly-img-1");

const SPRITES = {
    standing: "../assets/standing.png",
    waving: "../assets/waving.png",
    drinking: "../assets/drinking.png",
    sad: "../assets/sad.png"
};

function showStanding() {
    character.src = SPRITES.standing;
}

function showWaving() {
    character.src = SPRITES.waving;
}

function showDrinking() {
    character.src = SPRITES.drinking;
}

function showSad() {
    character.src = SPRITES.sad;
}

module.exports = {
    showStanding,
    showWaving,
    showDrinking,
    showSad
};