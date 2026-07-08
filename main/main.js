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

        transparent: true,
        frame: false,

        alwaysOnTop: true,

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

    createTray();
}

function createTray() {

    tray = new Tray(
        path.join(__dirname, "../assets/icon.png")
    );

    const menu = Menu.buildFromTemplate([

        {
            label: "🩷 Show Puddly",
            click() {
                mainWindow.show();
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
