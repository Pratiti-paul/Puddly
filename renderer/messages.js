const MESSAGE_POOLS = {
    reminder: [
        "Hiii gurlll!! 💕\nIt's time for some water 💧",
        "Your water bottle misses you 🥺💧",
        "Hydration check! 🌸",
        "Just one sip! You got this ✨",
        "Coding is better when hydrated 💻💧",
        "Tiny sip break, bestie 💙",
        "Puddly reporting for water duty 🫡💧",
        "Your brain called. It wants water 🧠💦",
        "Pause, breathe, sip 🌿",
        "Let's refill your sparkle ✨💧",
        "A little water moment for you 🌷",
        "Sip sip hooray? 👀💧",
        "Your future self says thank you 💙",
        "Hydration makes everything softer 🌸",
        "Water break time, pretty human 💕",
        "Don't make your bottle feel ignored 🥺",
        "Gentle reminder: you deserve water too 💧",
        "Let's keep you glowing from the inside ✨",
        "One sip now, superstar 🌟",
        "Time to water the hardworking human 🌱"
    ],
    drink: [
        "Yayyy!! 💖\nGood job staying hydrated!",
        "Hydrated queen 👑",
        "That's my girl! 🌸",
        "Your body says thank you 💙",
        "Keep shining and sipping ✨",
        "Proud of youuu 💕",
        "Look at you taking care of yourself 🌷",
        "Beautiful hydration behavior 💧",
        "Sip secured. Wellness upgraded ✨",
        "Tiny habit, big slay 💙",
        "Your brain is doing a happy dance 🧠💧",
        "Absolutely iconic hydration 👑",
        "Puddly is very impressed 💕",
        "You did the thing! 🌟",
        "Main character hydration moment 💧",
        "Your cells are cheering 🎉",
        "Soft life includes water 🌸",
        "Hydration streak energy ✨",
        "That was cute and responsible 💙",
        "Gold star for you 🌟"
    ],
    snooze: [
        "Okkayy 🥺\nI'll remind you again soon.",
        "No worries 💙",
        "I'll patiently wait 🌸",
        "See you soon 👀",
        "Don't forget me though 💧",
        "Alright bestie, tiny pause granted 💕",
        "I'll be right here when you're ready 🌷",
        "Snooze accepted, but hydration remembers 👀",
        "Taking a small rain check 💙",
        "Okayy, but your bottle still misses you 🥺",
        "I'll circle back gently ✨",
        "No pressure, just puddly patience 💧",
        "I'll save the sip for later 🌸",
        "A little delay is okay 💕",
        "Resting reminder mode activated 🌙",
        "I'll nudge you again soon 💙",
        "Puddly will wait politely ✨",
        "Okay, tiny hydration timeout 👀",
        "Soon soon, promise? 💧",
        "I'll be back with more water energy 🌷"
    ]
};

const previousMessages = {};

function getMessage(category) {
    const pool = MESSAGE_POOLS[category];

    if (!pool || pool.length === 0) {
        return "";
    }

    if (pool.length === 1) {
        previousMessages[category] = pool[0];
        return pool[0];
    }

    let nextMessage = pool[randomIndex(pool)];

    while (nextMessage === previousMessages[category]) {
        nextMessage = pool[randomIndex(pool)];
    }

    previousMessages[category] = nextMessage;
    return nextMessage;
}

function randomIndex(pool) {
    return Math.floor(Math.random() * pool.length);
}

function getReminderMessage() {
    return getMessage("reminder");
}

function getDrinkMessage() {
    return getMessage("drink");
}

function getSnoozeMessage() {
    return getMessage("snooze");
}

module.exports = {
    MESSAGE_POOLS,
    getMessage,
    getReminderMessage,
    getDrinkMessage,
    getSnoozeMessage
};
