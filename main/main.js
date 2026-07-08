const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;
let tray;

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

    createTray();
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

function createTray() {

    tray = new Tray(
        path.join(__dirname, "../assets/icon.png")
    );

    const menu = Menu.buildFromTemplate([

        {
            label: "🩷 Show Puddly",
            click() {
                mainWindow.showInactive();
            }
        },

        {
            label: "🙈 Hide Puddly",
            click() {
                mainWindow.hide();
            }
        },

        {
            type: "separator"
        },

        {
            label: "❌ Quit Puddly",
            click() {
                app.quit();
            }
        }

    ]);

    tray.setToolTip("Puddly 💖");
    tray.setContextMenu(menu);
}

ipcMain.on("quit-app", () => {
    app.quit();
});

ipcMain.on("set-ignore-mouse-events", (event, ignore, options) => {

    if (!mainWindow || mainWindow.isDestroyed()) {
        return;
    }

    mainWindow.setIgnoreMouseEvents(ignore, options);

});

app.whenReady().then(() => {
    createWindow();
});

app.on("activate", () => {

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }

});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});
