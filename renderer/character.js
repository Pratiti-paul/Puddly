const character = document.getElementById("puddly-img-1");

const SPRITES = {
    standing: "../assets/standing.png",
    waving: "../assets/waving.png",
    drinking: "../assets/drinking.png",
    sad: "../assets/sad.png",

    walk1: "../assets/walk1.png",
    walk2: "../assets/walk2.png",
    walk3: "../assets/walk3.png",
    walk4: "../assets/walk4.png"
};

let walkInterval = null;

function setImage(src){
    character.src = src;
}

function showStanding(){
    stopWalking();
    setImage(SPRITES.standing);
}

function showWaving(){
    stopWalking();
    setImage(SPRITES.waving);
}

function showDrinking(){
    stopWalking();
    setImage(SPRITES.drinking);
}

function showSad(){
    stopWalking();
    setImage(SPRITES.sad);
}

function startWalking(){

    stopWalking();

    const frames = [
        SPRITES.walk1,
        SPRITES.walk2,
        SPRITES.walk3,
        SPRITES.walk4
    ];

    let i = 0;

    walkInterval = setInterval(() => {

        setImage(frames[i]);

        i++;

        if(i >= frames.length){
            i = 0;
        }

    },120);

}

function stopWalking(){

    if(walkInterval){

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