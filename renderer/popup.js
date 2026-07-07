const { ipcRenderer } = require('electron');

class PopupManager {
  constructor(onDrank, onSnooze, onQuit) {
    this.bubble = document.getElementById('speech-bubble');
    this.textEl = document.getElementById('speech-text');
    this.btnContainer = document.getElementById('button-container');
    this.btnDrank = document.getElementById('btn-drank');
    this.btnSnooze = document.getElementById('btn-snooze');
    this.btnQuit = document.getElementById('btn-quit');

    // Attach click listeners to callbacks
    this.btnDrank.addEventListener('click', onDrank);
    this.btnSnooze.addEventListener('click', onSnooze);
    if (this.btnQuit && onQuit) {
      this.btnQuit.addEventListener('click', onQuit);
    }

    // Track mouse hover to toggle click-through behavior
    window.addEventListener('mousemove', (e) => {
      // Only capture clicks if hovering over an element with the "interactive" class
      const isInteractive = e.target.closest('.interactive') !== null;
      ipcRenderer.send('set-ignore-mouse-events', !isInteractive, { forward: true });
    });
  }

  show(text, showButtons = false) {
    this.textEl.innerHTML = text.replace(/\n/g, '<br>');
    if (showButtons) {
      this.btnContainer.classList.add('show');
      this.bubble.classList.add('has-buttons');
    } else {
      this.btnContainer.classList.remove('show');
      this.bubble.classList.remove('has-buttons');
    }
    this.bubble.classList.add('visible');
    
    // Trigger size recalculation
    window.dispatchEvent(new Event('popup-changed'));
  }

  hide() {
    this.bubble.classList.remove('visible');
    
    // Trigger size recalculation
    window.dispatchEvent(new Event('popup-changed'));
  }

  isVisible() {
    return this.bubble.classList.contains('visible');
  }
}

module.exports = PopupManager;
