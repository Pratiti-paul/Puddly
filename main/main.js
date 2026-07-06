const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const display = screen.getPrimaryDisplay();

    const {
    width,
    height
    } = display.bounds;

  mainWindow = new BrowserWindow({
    width:180,
    height:290,

    x: width - 190,
    y: height - 290,

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