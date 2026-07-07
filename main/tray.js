const { Tray, Menu, app } = require("electron");
const path = require("path");

let tray;

function createTray(mainWindow) {

    tray = new Tray(path.join(__dirname, "../assets/icon.png"));

    const contextMenu = Menu.buildFromTemplate([

        {
            label: "💧 Show Puddly",
            click() {
                mainWindow.show();
            }
        },

        {
            label: "⚙ Settings",
            enabled: false
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

    tray.setToolTip("Puddly 💕");

    tray.setContextMenu(contextMenu);

}

module.exports = createTray;