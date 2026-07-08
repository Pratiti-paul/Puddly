const { clampWindowBounds } = require("./windowBounds");

function registerWindowDrag(options) {
    let dragState = null;

    options.ipcMain.on("window-drag:start", (event, pointer) => {
        const window = options.getWindow();

        if (!window || window.isDestroyed()) {
            return;
        }

        dragState = {
            pointer,
            bounds: window.getBounds()
        };
    });

    options.ipcMain.on("window-drag:move", (event, pointer) => {
        const window = options.getWindow();

        if (!dragState || !window || window.isDestroyed()) {
            return;
        }

        const nextBounds = clampWindowBounds(
            options.screen,
            {
                ...dragState.bounds,
                x: dragState.bounds.x + pointer.x - dragState.pointer.x,
                y: dragState.bounds.y + pointer.y - dragState.pointer.y
            },
            pointer
        );

        window.setBounds(nextBounds, false);
    });

    options.ipcMain.on("window-drag:end", () => {
        const window = options.getWindow();
        dragState = null;

        if (!window || window.isDestroyed()) {
            return;
        }

        const bounds = clampWindowBounds(
            options.screen,
            window.getBounds()
        );

        window.setBounds(bounds, false);
        options.updatePreferences({
            ...options.getPreferences(),
            windowPosition: {
                x: bounds.x,
                y: bounds.y
            }
        });
    });
}

module.exports = {
    registerWindowDrag
};
