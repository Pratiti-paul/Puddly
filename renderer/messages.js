const REMINDER_CATEGORIES = {
    morning: {
        startsAt: 5,
        endsBefore: 12,
        messages: [
            "Good morning! 🌞\nLet's start the day with water 💧",
            "Rise and shine! 💛\nTime to hydrate.",
            "A fresh day deserves a fresh glass of water 💧",
            "Morning hydration = morning energy ✨",
            "Tiny morning sip before the day gets busy 🌸",
            "Your sleepy cells would love some water 🥺💧",
            "Start soft, start hydrated 🌷",
            "A little water for your morning sparkle ✨",
            "Good morning, bestie!\nSip before you zoom away 💕",
            "New day, new water moment 🌞",
            "Let's wake up gently with a few sips 💙",
            "Morning check-in: have you had water yet? 👀",
            "Your bottle wants to say good morning 💧",
            "Hydrate first, conquer later 👑",
            "A calm sip for a bright start 🌿",
            "Breakfast loves a water buddy 🥤",
            "Puddly says morning water is self-care 💕",
            "Sun is up, sip is due 🌞💧",
            "Let's give your brain a morning refill 🧠",
            "Soft morning reminder: you deserve water too 🌸"
        ]
    },
    afternoon: {
        startsAt: 12,
        endsBefore: 17,
        messages: [
            "You've been working hard 💻\nTake a water break!",
            "Afternoon hydration check! 🌸",
            "Stretch a little and grab some water 💙",
            "Time for a tiny recharge 🥤",
            "Midday sip break, bestie 💧",
            "Your afternoon focus needs water fuel ✨",
            "Lunch era hydration reminder 🌷",
            "Pause the scroll, sip the water 👀",
            "A few sips could make the afternoon softer 🌿",
            "Puddly says: water before more work 💕",
            "Let's refill your sparkle for part two of the day ✨",
            "Afternoon brain deserves a hydration hug 🧠💙",
            "Sip check before the next task 💻💧",
            "A little water break never hurt anybody 🌸",
            "Your bottle is waiting patiently 🥺",
            "Tiny recharge, big difference 🥤",
            "Hydration checkpoint unlocked 💧",
            "Keep going, but bring water with you 💙",
            "Your hardworking self needs a sip 🌷",
            "Afternoon Puddly patrol: drink water please 🫡"
        ]
    },
    evening: {
        startsAt: 17,
        endsBefore: 21,
        messages: [
            "You're almost done for the day 🌇\nDon't forget to hydrate.",
            "Evening water break! 💕",
            "Keep your energy up with a few sips 💧",
            "Relax and hydrate 🌿",
            "A soft evening sip sounds nice 🌸",
            "Your day worked hard. Water will help 💙",
            "Golden hour hydration check 🌇",
            "Before you wind down, take a tiny sip ✨",
            "Evening bestie reminder: bottle time 👀",
            "Let's end the day gently hydrated 💧",
            "A few sips for your cozy evening 🌙",
            "Puddly is here with a calm water nudge 💕",
            "Hydration before chill mode 🥤",
            "Your evening glow needs water too ✨",
            "Almost rest time, but first: sip 🌷",
            "Tiny water break before dinner or downtime 💙",
            "You made it this far. Water cheers you on 🌸",
            "Evening reset: breathe, sip, soften 🌿",
            "Your bottle wants a little attention 💧",
            "Let's keep you feeling good tonight 💕"
        ]
    },
    night: {
        startsAt: 21,
        endsBefore: 5,
        messages: [
            "Almost bedtime 🌙\nOne last glass of water?",
            "You've done great today 💙\nStay hydrated before you sleep.",
            "Don't forget your nighttime sip ✨",
            "Sweet dreams start with good hydration 🥺",
            "A tiny night sip for cozy vibes 🌙",
            "Puddly's gentle bedtime water check 💧",
            "Before you get too sleepy, have some water 💙",
            "Night mode reminder: sip softly 🌸",
            "A few calm sips before rest sounds perfect ✨",
            "Your future morning self says thank you 💕",
            "Hydrate a little, then cozy up 🌙",
            "Late-night Puddly whisper: water please 🥺",
            "One small sip before dreams 💧",
            "Let's keep you comfy and hydrated tonight 🌷",
            "Your bottle is quietly waiting 👀",
            "Gentle night check-in: did you drink water? 💙",
            "Sip, breathe, rest 🌿",
            "Bedtime is better with a tiny water moment ✨",
            "Puddly won't be loud, just lovingly reminding 💕",
            "Good night soon. Water first? 🌙💧"
        ]
    }
};

const MESSAGE_POOLS = {
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
    return getMessageFromPool(category, pool);
}

function getMessageFromPool(category, pool) {
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

function getCurrentTimeCategory(date = new Date()) {
    const hour = date.getHours();

    return Object.keys(REMINDER_CATEGORIES).find((category) => {
        const { startsAt, endsBefore } = REMINDER_CATEGORIES[category];

        if (startsAt < endsBefore) {
            return hour >= startsAt && hour < endsBefore;
        }

        return hour >= startsAt || hour < endsBefore;
    }) || "morning";
}

function getReminderMessage(date = new Date()) {
    const category = getCurrentTimeCategory(date);
    const reminderPool = REMINDER_CATEGORIES[category].messages;
    return getMessageFromPool("reminder", reminderPool);
}

function getDrinkMessage() {
    return getMessage("drink");
}

function getSnoozeMessage() {
    return getMessage("snooze");
}

module.exports = {
    MESSAGE_POOLS,
    REMINDER_CATEGORIES,
    getMessage,
    getCurrentTimeCategory,
    getReminderMessage,
    getDrinkMessage,
    getSnoozeMessage
};
