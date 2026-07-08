const { BrowserWindow, Menu, Tray, dialog, ipcMain, nativeImage } = require("electron");

const DND_OPTIONS = [
    { id: "off", label: "Off", minutes: 0 },
    { id: "30m", label: "30 Minutes", minutes: 30 },
    { id: "1h", label: "1 Hour", minutes: 60 },
    { id: "2h", label: "2 Hours", minutes: 120 },
    { id: "tomorrow", label: "Until Tomorrow Morning", untilTomorrow: true }
];

const REMINDER_INTERVALS = [15, 30, 45, 60, 90];

function createPuddlyTray(options) {
    const tray = new Tray(createTrayIcon(options.iconPath));
    let contextMenu;

    function rebuildMenu() {
        contextMenu = buildTrayMenu({
            ...options,
            tray,
            rebuildMenu
        });

        tray.setContextMenu(contextMenu);
    }

    tray.setToolTip("Puddly");
    rebuildMenu();

    tray.on("click", () => {
        tray.popUpContextMenu(contextMenu);
    });

    tray.on("right-click", () => {
        tray.popUpContextMenu(contextMenu);
    });

    return {
        tray,
        rebuildMenu,
        destroy() {
            tray.destroy();
        }
    };
}

function createTrayIcon(iconPath) {
    const icon = nativeImage.createFromPath(iconPath);
    const size = process.platform === "darwin" ? 18 : 16;
    const trayIcon = icon.resize({
        width: size,
        height: size
    });

    if (process.platform === "darwin") {
        trayIcon.setTemplateImage(false);
    }

    return trayIcon;
}

function buildTrayMenu(options) {
    const preferences = options.getPreferences();

    return Menu.buildFromTemplate([
        {
            label: "💧 Puddly",
            enabled: false
        },
        {
            type: "separator"
        },
        {
            label: "🌙 Do Not Disturb",
            submenu: buildDndMenu(options, preferences)
        },
        {
            label: "⚙️ Settings",
            submenu: buildSettingsMenu(options, preferences)
        },
        {
            type: "separator"
        },
        {
            label: "❌ Quit",
            click: options.onQuit
        }
    ]);
}

function buildDndMenu(options, preferences) {
    return DND_OPTIONS.map((item) => ({
        label: item.label,
        type: "checkbox",
        checked: preferences.dndMode === item.id,
        click() {
            const updatedPreferences = {
                ...preferences,
                dndMode: item.id,
                dndUntil: getDndUntil(item)
            };

            options.updatePreferences(updatedPreferences);
            options.rebuildMenu();
        }
    }));
}

function buildSettingsMenu(options, preferences) {
    return [
        {
            label: "Reminder Interval",
            submenu: buildReminderIntervalMenu(options, preferences)
        },
        {
            label: "About",
            click() {
                dialog.showMessageBox(options.mainWindow, {
                    type: "info",
                    buttons: ["OK"],
                    defaultId: 0,
                    title: "Puddly",
                    message: "Puddly",
                    detail: "Version 1.0\nYour adorable hydration companion 💙"
                });
            }
        }
    ];
}

function buildReminderIntervalMenu(options, preferences) {
    const intervalItems = REMINDER_INTERVALS.map((minutes) => ({
        label: `${minutes} Minutes`,
        type: "checkbox",
        checked: preferences.reminderIntervalMinutes === minutes,
        click() {
            options.updatePreferences({
                ...preferences,
                reminderIntervalMinutes: minutes
            });

            options.rebuildMenu();
        }
    }));

    intervalItems.push(
        {
            type: "separator"
        },
        {
            label: "Custom...",
            type: "checkbox",
            checked: !REMINDER_INTERVALS.includes(preferences.reminderIntervalMinutes),
            click() {
                openCustomIntervalDialog(options);
            }
        }
    );

    return intervalItems;
}

function getDndUntil(item) {
    if (item.id === "off") {
        return null;
    }

    if (item.untilTomorrow) {
        const tomorrowMorning = new Date();
        tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
        tomorrowMorning.setHours(8, 0, 0, 0);
        return tomorrowMorning.getTime();
    }

    return Date.now() + item.minutes * 60 * 1000;
}

function openCustomIntervalDialog(options) {
    const parent = options.mainWindow;
    const dialogId = Date.now().toString();
    const cancelChannel = `custom-interval-cancel-${dialogId}`;
    const submitChannel = `custom-interval-submit-${dialogId}`;
    const dialogWindow = new BrowserWindow({
        width: 320,
        height: 170,
        parent,
        modal: true,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: "Custom Reminder Interval",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    function cleanup() {
        ipcMain.removeListener(cancelChannel, handleCancel);
        ipcMain.removeListener(submitChannel, handleSubmit);
    }

    function handleCancel() {
        cleanup();
        dialogWindow.close();
    }

    function handleSubmit(event, value) {
        const minutes = Number(value);

        if (!Number.isFinite(minutes) || minutes <= 0) {
            dialog.showErrorBox(
                "Invalid Interval",
                "Please enter a reminder interval greater than 0 minutes."
            );
            return;
        }

        options.updatePreferences({
            ...options.getPreferences(),
            reminderIntervalMinutes: Math.round(minutes)
        });

        options.rebuildMenu();
        cleanup();
        dialogWindow.close();
    }

    ipcMain.on(cancelChannel, handleCancel);
    ipcMain.on(submitChannel, handleSubmit);

    dialogWindow.setMenu(null);
    dialogWindow.loadURL(createCustomIntervalDialogUrl(
        options.getPreferences().reminderIntervalMinutes,
        cancelChannel,
        submitChannel
    ));

    dialogWindow.once("ready-to-show", () => {
        dialogWindow.show();
    });

    dialogWindow.on("closed", () => {
        cleanup();
    });
}

function createCustomIntervalDialogUrl(currentMinutes, cancelChannel, submitChannel) {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
    margin: 0;
    padding: 18px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f7f7f7;
    color: #1f1f1f;
}
label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
}
input {
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 6px 8px;
    font-size: 14px;
}
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
}
button {
    min-width: 76px;
    height: 30px;
}
</style>
</head>
<body>
<label for="minutes">Reminder interval in minutes</label>
<input id="minutes" type="number" min="1" step="1" value="${currentMinutes}" autofocus>
<div class="actions">
    <button id="cancel">Cancel</button>
    <button id="save">Save</button>
</div>
<script>
const { ipcRenderer } = require("electron");
const minutes = document.getElementById("minutes");
document.getElementById("cancel").addEventListener("click", () => {
    ipcRenderer.send("${cancelChannel}");
});
document.getElementById("save").addEventListener("click", () => {
    ipcRenderer.send("${submitChannel}", minutes.value);
});
minutes.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        ipcRenderer.send("${submitChannel}", minutes.value);
    }
});
</script>
</body>
</html>`;

    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

module.exports = {
    createPuddlyTray
};
