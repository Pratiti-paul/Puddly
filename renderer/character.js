const character = document.getElementById("puddly-img-1");

const SPRITES = {
    standing: "../assets/standing.png",
    waving: "../assets/waving.png",
    drinking: "../assets/drinking.png",
    sad: "../assets/sad.png",

    walk: [
        "../assets/walkout1.png",
        "../assets/walkout2.png",
        "../assets/walkout3.png"
    ]
};

let walkInterval = null;
let frame = 0;

function showStanding() {
    stopWalking();
    character.style.transform = "scaleX(1)";
    character.src = SPRITES.standing;
}

function showWaving() {
    stopWalking();
    character.style.transform = "scaleX(1)";
    character.src = SPRITES.waving;
}

function showDrinking() {
    stopWalking();
    character.style.transform = "scaleX(1)";
    character.src = SPRITES.drinking;
}

function showSad() {
    stopWalking();
    character.style.transform = "scaleX(1)";
    character.src = SPRITES.sad;
}

function startWalking(direction = "right") {

    stopWalking();

    frame = 0;

    // Face the correct direction
    if (direction === "left") {
        character.style.transform = "scaleX(-1)";
    } else {
        character.style.transform = "scaleX(1)";
    }

    // Show first frame immediately
    character.src = SPRITES.walk[0];

    walkInterval = setInterval(() => {

        frame = (frame + 1) % SPRITES.walk.length;
        character.src = SPRITES.walk[frame];

    }, 100);

}

function stopWalking() {

    if (walkInterval) {
        clearInterval(walkInterval);
        walkInterval = null;
    }

}

module.exports = {
    showStanding,
    showWaving,
    showDrinking,
    showSad,
    startWalking,
    stopWalking
};