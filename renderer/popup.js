const { ipcRenderer } = require("electron");

class PopupManager {
    constructor(onDrank, onSnooze) {

        this.bubble = document.getElementById("speech-bubble");
        this.textEl = document.getElementById("speech-text");

        this.btnContainer = document.getElementById("button-container");
        this.btnDrank = document.getElementById("btn-drank");
        this.btnSnooze = document.getElementById("btn-snooze");

        this.btnDrank.addEventListener("click", onDrank);
        this.btnSnooze.addEventListener("click", onSnooze);

        // Enable mouse only on interactive elements
        window.addEventListener("mousemove", (e) => {

            const interactive = e.target.closest(".interactive");

            ipcRenderer.send(
                "set-ignore-mouse-events",
                !interactive,
                { forward: true }
            );

        });

    }

    show(message, showButtons = false) {

        this.textEl.innerHTML = message.replace(/\n/g, "<br>");

        this.bubble.classList.add("visible");

        if (showButtons) {

            this.btnContainer.classList.add("show");

        } else {

            this.btnContainer.classList.remove("show");

        }

        window.dispatchEvent(new Event("popup-changed"));

    }

    hide() {

        this.bubble.classList.remove("visible");

        this.btnContainer.classList.remove("show");

        window.dispatchEvent(new Event("popup-changed"));

    }

    setMessage(message) {

        this.textEl.innerHTML = message.replace(/\n/g, "<br>");

    }

    showReminder() {

        this.show(
            "💕 Hiii gurlll!\nIt's time for some water 💧",
            true
        );

    }

    showSuccess() {

        this.show(
            "🥤 Yayyy!!\nGood job staying hydrated! 💖",
            false
        );

    }

    showSnooze() {

        this.show(
            "🥺 Okkayy!\nI'll remind you again in 15 minutes 💕",
            false
        );

    }

    isVisible() {

        return this.bubble.classList.contains("visible");

    }

}

module.exports = PopupManager;