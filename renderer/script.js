window.onload = () => {

    Character.showStanding();

    setTimeout(() => {
        Character.showWaving();
    }, 3000);

    setTimeout(() => {
        Character.showDrinking();
    }, 6000);

    setTimeout(() => {
        Character.showSad();
    }, 9000);

    setTimeout(() => {
        Character.showStanding();
    }, 12000);

};