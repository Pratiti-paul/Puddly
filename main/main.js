const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.bounds;

  mainWindow = new BrowserWindow({
    width: 200,
    height: 380,    
    x: screenWidth - 220,
    y: screenHeight - 380,
    show: false, // Start hidden to prevent flashing/jumping

    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false, // Anchored to bottom-right
    skipTaskbar: true,
    hasShadow: false,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Redirect renderer logs to main terminal
  mainWindow.webContents.on("console-message", (event, level, message) => {
    console.log(`[RENDERER LOG] ${message}`);
  });

  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.loadFile(
    path.join(__dirname, "../renderer/index.html")
  );

  // Make visible on all Spaces and full-screen screens
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, "screen-saver");

  // Fallback to show window if renderer doesn't send size within 2 seconds
  const showFallback = setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  }, 2000);

  // Listen for dynamic resize and reposition from renderer
  ipcMain.on("resize-and-reposition", (event, { width, height }) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    clearTimeout(showFallback);

    const currentDisplay = screen.getPrimaryDisplay();
    const { width: scrW, height: scrH } = currentDisplay.bounds;

    const paddingRight = 20; // Padding from right edge
    const paddingBottom = 0; // Touch bottom of physical screen

    const x = scrW - width - paddingRight;
    const y = scrH - height - paddingBottom;

    mainWindow.setSize(width, height);
    mainWindow.setPosition(x, y);

    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  });

  // Dynamic ignore mouse events to support transparency click-through
  ipcMain.on("set-ignore-mouse-events", (event, ignore, options) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    mainWindow.setIgnoreMouseEvents(ignore, options);
  });

  ipcMain.on("quit-app", () => {
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    app.quit();
});