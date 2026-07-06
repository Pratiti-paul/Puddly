const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 250,
    height: 350,

    x: width - 270,
    y: height - 370,

    transparent: true,
    frame: false,

    alwaysOnTop: true,

    resizable: false,
    movable: true,

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
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    app.quit();
});