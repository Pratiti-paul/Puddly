const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.bounds;

  mainWindow = new BrowserWindow({
    width: 200,
    height: 320,    
    x: screenWidth - 210,
    y: screenHeight - 320,
    show: false, // Start hidden to prevent flashing/jumping

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

  console.log("Primary Display Bounds:", display.bounds);
  console.log("Primary Display WorkArea:", display.workArea);

  // Redirect renderer logs to main terminal
  mainWindow.webContents.on("console-message", (event, level, message) => {
    console.log(`[RENDERER LOG] ${message}`);
  });

  // Fallback to show window if renderer doesn't send size within 1.5 seconds
  const showFallback = setTimeout(() => {
    console.log("Fallback timeout reached, showing window with default size");
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  }, 1500);

  // Listen for dynamic resize and reposition from renderer
  ipcMain.on("resize-and-reposition", (event, { width, height }) => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    clearTimeout(showFallback);

    const currentDisplay = screen.getPrimaryDisplay();
    const { width: scrW, height: scrH } = currentDisplay.bounds;

    console.log(`Received resize request: width=${width}, height=${height}`);

    const paddingRight = 20; // Padding from right edge
    const paddingBottom = 0; // Touch bottom of physical screen

    const x = scrW - width - paddingRight;
    const y = scrH - height - paddingBottom;

    console.log(`Requested positioning window at: x=${x}, y=${y}`);

    mainWindow.setSize(width, height);
    mainWindow.setPosition(x, y);
    
    // Set level to screen-saver so it can overlap Dock and not be forced up
    mainWindow.setAlwaysOnTop(true, "screen-saver");

    console.log("Actual window position after setting bounds:", mainWindow.getPosition());

    if (!mainWindow.isVisible()) {
      mainWindow.show();
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin")
    app.quit();
});