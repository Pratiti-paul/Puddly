const { ipcRenderer } = require("electron");

function registerCompanionDrag(element) {
    let isDragging = false;

    function startDrag(event) {
        if (event.button !== 0 || event.target.closest("button")) {
            return;
        }

        isDragging = true;
        element.classList.add("dragging");

        ipcRenderer.send(
            "set-ignore-mouse-events",
            false,
            { forward: true }
        );

        ipcRenderer.send("window-drag:start", getPointer(event));

        window.addEventListener("mousemove", moveDrag);
        window.addEventListener("mouseup", stopDrag, { once: true });
        window.addEventListener("blur", stopDrag, { once: true });

        event.preventDefault();
    }

    function moveDrag(event) {
        if (!isDragging) {
            return;
        }

        ipcRenderer.send("window-drag:move", getPointer(event));
    }

    function stopDrag() {
        if (!isDragging) {
            return;
        }

        isDragging = false;
        element.classList.remove("dragging");

        window.removeEventListener("mousemove", moveDrag);
        window.removeEventListener("blur", stopDrag);

        ipcRenderer.send("window-drag:end");
    }

    element.addEventListener("mousedown", startDrag);
}

function getPointer(event) {
    return {
        x: Math.round(event.screenX),
        y: Math.round(event.screenY)
    };
}

module.exports = {
    registerCompanionDrag
};
