const fs = require("fs");
const path = require("path");

const DEFAULT_PREFERENCES = {
    dndMode: "off",
    dndUntil: null,
    reminderIntervalMinutes: 90
};

function getPreferencesPath(app) {
    return path.join(app.getPath("userData"), "preferences.json");
}

function normalizePreferences(preferences) {
    const normalized = {
        ...DEFAULT_PREFERENCES,
        ...preferences
    };

    const interval = Number(normalized.reminderIntervalMinutes);
    normalized.reminderIntervalMinutes = Number.isFinite(interval) && interval > 0
        ? Math.round(interval)
        : DEFAULT_PREFERENCES.reminderIntervalMinutes;

    if (!normalized.dndUntil || normalized.dndUntil <= Date.now()) {
        normalized.dndMode = "off";
        normalized.dndUntil = null;
    }

    return normalized;
}

function loadPreferences(app) {
    const preferencesPath = getPreferencesPath(app);

    try {
        const rawPreferences = fs.readFileSync(preferencesPath, "utf8");
        return normalizePreferences(JSON.parse(rawPreferences));
    } catch (error) {
        return { ...DEFAULT_PREFERENCES };
    }
}

function savePreferences(app, preferences) {
    const preferencesPath = getPreferencesPath(app);
    const normalized = normalizePreferences(preferences);

    fs.mkdirSync(path.dirname(preferencesPath), { recursive: true });
    fs.writeFileSync(
        preferencesPath,
        JSON.stringify(normalized, null, 2)
    );

    return normalized;
}

module.exports = {
    DEFAULT_PREFERENCES,
    loadPreferences,
    savePreferences,
    normalizePreferences
};
