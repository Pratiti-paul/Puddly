const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { createPuddlyTray } = require("./tray");
const { loadPreferences, savePreferences, normalizePreferences } = require("./preferences");

let mainWindow;
let trayController;
let preferences;
let dndExpirationTimer;

function createWindow() {

    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workAreaSize;

    mainWindow = new BrowserWindow({

        width: 360,
        height: 490,

        x: width - 360,
        y: height - 490,

        type: process.platform === "darwin" ? "panel" : undefined,

        transparent: true,
        frame: false,

        alwaysOnTop: true,
        show: false,

        resizable: false,
        maximizable: false,
        minimizable: false,

        skipTaskbar: true,
        hasShadow: false,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    });

    mainWindow.loadFile(
        path.join(__dirname, "../renderer/index.html")
    );

    mainWindow.once("ready-to-show", () => {
        configureTopLevelWindow(mainWindow);
        mainWindow.showInactive();
        configureTopLevelWindow(mainWindow);
    });

    mainWindow.on("show", () => {
        configureTopLevelWindow(mainWindow);
    });

    mainWindow.on("blur", () => {
        configureTopLevelWindow(mainWindow);
    });

    trayController = createPuddlyTray({
        app,
        mainWindow,
        iconPath: path.join(__dirname, "../assets/icon.png"),
        getPreferences: () => preferences,
        updatePreferences,
        onQuit: quitApp
    });
}

function configureTopLevelWindow(window) {

    window.setAlwaysOnTop(true, "screen-saver");

    window.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
    });

    window.setFullScreenable(false);
    window.setSkipTaskbar(true);
    window.moveTop();
}

ipcMain.on("quit-app", () => {
    quitApp();
});

ipcMain.on("set-ignore-mouse-events", (event, ignore, options) => {

    if (!mainWindow || mainWindow.isDestroyed()) {
        return;
    }

    mainWindow.setIgnoreMouseEvents(ignore, options);

});

ipcMain.handle("preferences:get", () => {
    return preferences;
});

function updatePreferences(nextPreferences) {
    preferences = savePreferences(app, nextPreferences);

    scheduleDndExpiration();

    if (trayController) {
        trayController.rebuildMenu();
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("preferences:changed", preferences);
    }

    return preferences;
}

function scheduleDndExpiration() {
    if (dndExpirationTimer) {
        clearTimeout(dndExpirationTimer);
        dndExpirationTimer = null;
    }

    if (!preferences.dndUntil) {
        return;
    }

    const delay = preferences.dndUntil - Date.now();

    if (delay <= 0) {
        updatePreferences({
            ...preferences,
            dndMode: "off",
            dndUntil: null
        });
        return;
    }

    dndExpirationTimer = setTimeout(() => {
        updatePreferences({
            ...preferences,
            dndMode: "off",
            dndUntil: null
        });
    }, delay);
}

function quitApp() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("app-quitting");
    }

    cleanupAppResources();
    app.quit();
}

function cleanupAppResources() {
    if (dndExpirationTimer) {
        clearTimeout(dndExpirationTimer);
        dndExpirationTimer = null;
    }

    if (trayController) {
        trayController.destroy();
        trayController = null;
    }
}

app.whenReady().then(() => {
    preferences = normalizePreferences(loadPreferences(app));
    preferences = savePreferences(app, preferences);
    scheduleDndExpiration();
    createWindow();
});

app.on("activate", () => {

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }

});

app.on("before-quit", () => {
    cleanupAppResources();
});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});
