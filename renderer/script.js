const { ipcRenderer } = require('electron');
const { States, StateMachine } = require('./states');
const Timer = require('./timer');
const PopupManager = require('./popup');

// Elements
const img1 = document.getElementById('puddly-img-1');
const img2 = document.getElementById('puddly-img-2');

let activeImg = img1;
let inactiveImg = img2;

// Layout configurations
const TARGET_HEIGHT = 380;
let currentCharacterWidth = 0;
let currentCharacterScale = 1;
let currentCharacterBounds = null;
let inSnoozeCycle = false;

// Time Constants (90 minutes & 15 minutes)
const REMINDER_TIME = 90 * 60 * 1000;
const SNOOZE_TIME = 15 * 60 * 1000;

// Canvas Trim Algorithm
function getImageBounds(imgElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  let hasContent = false;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        hasContent = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  if (!hasContent) {
    return {
      trimLeft: 0,
      trimTop: 0,
      trimRight: 0,
      trimBottom: 0,
      width: imgElement.naturalWidth,
      height: imgElement.naturalHeight
    };
  }
  
  return {
    trimLeft: minX,
    trimTop: minY,
    trimRight: canvas.width - 1 - maxX,
    trimBottom: canvas.height - 1 - maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

// Function to handle image changes and crop transparent pixels dynamically
function changeCharacter(src) {
  return new Promise((resolve) => {
    let resolved = false;
    
    const handleLoad = () => {
      if (resolved) return;
      resolved = true;
      
      const bounds = getImageBounds(inactiveImg);
      const scale = TARGET_HEIGHT / bounds.height;
      const characterWidth = bounds.width * scale;
      
      // Position the hidden image layer at the bottom-right
      inactiveImg.style.width = `${inactiveImg.naturalWidth * scale}px`;
      inactiveImg.style.height = `${inactiveImg.naturalHeight * scale}px`;
      inactiveImg.style.right = `${-bounds.trimRight * scale}px`;
      inactiveImg.style.bottom = `${-bounds.trimBottom * scale}px`;
      
      // Update dimensions state
      currentCharacterWidth = characterWidth;
      currentCharacterScale = scale;
      currentCharacterBounds = bounds;
      
      recalculateWindowBounds();
      
      // Trigger CSS cross-fade transition
      inactiveImg.classList.remove('hidden');
      inactiveImg.classList.add('visible');
      
      activeImg.classList.remove('visible');
      activeImg.classList.add('hidden');
      
      // Swap active and inactive references
      const temp = activeImg;
      activeImg = inactiveImg;
      inactiveImg = temp;
      
      resolve();
    };

    // Attach handler before setting src to avoid race conditions
    inactiveImg.onload = handleLoad;
    inactiveImg.src = src;
    
    // Fallback if cached and already complete
    if (inactiveImg.complete && inactiveImg.naturalWidth > 0) {
      handleLoad();
    }
  });
}

// Resizes and repositions the Electron window to fit both character and speech bubble
function recalculateWindowBounds() {
  if (!currentCharacterBounds) return;
  
  const scale = currentCharacterScale;
  const characterWidth = currentCharacterBounds.width * scale;
  
  let bubbleHeight = 0;
  let bubbleWidth = 0;
  
  const bubble = document.getElementById('speech-bubble');
  if (bubble.classList.contains('visible')) {
    bubbleHeight = bubble.offsetHeight;
    bubbleWidth = bubble.offsetWidth;
  }
  
  const totalHeight = TARGET_HEIGHT + (bubbleHeight > 0 ? bubbleHeight + 10 : 0);
  const totalWidth = Math.max(characterWidth, bubbleWidth) + 20;
  
  console.log(`[PUDDLY] Recalculating window size: width=${totalWidth}, height=${totalHeight}, characterWidth=${Math.round(characterWidth)}, bubbleHeight=${bubbleHeight}`);

  // Center speech bubble above the visible character bounds
  const characterCenter = totalWidth - 10 - (characterWidth / 2);
  bubble.style.left = `${characterCenter}px`;
  
  // Size the character container to fill bottom of window
  const container = document.getElementById('character-container');
  container.style.width = `${totalWidth}px`;
  container.style.height = `${TARGET_HEIGHT}px`;
  
  ipcRenderer.send('resize-and-reposition', {
    width: Math.round(totalWidth),
    height: Math.round(totalHeight)
  });
}

// Window state event listeners
window.addEventListener('popup-changed', recalculateWindowBounds);
window.addEventListener('resize', recalculateWindowBounds);

// Timer Callbacks
const reminderTimer = new Timer(REMINDER_TIME, () => {
  stateMachine.transitionTo(States.WAVING);
});

const snoozeTimer = new Timer(SNOOZE_TIME, () => {
  stateMachine.transitionTo(States.WAVING);
});

// Setup FSM State Event Handlers
async function handleStateChange(newState) {
  console.log(`[PUDDLY] FSM Transition: -> ${newState}`);
  // Clear any existing timers on transition
  reminderTimer.stop();
  snoozeTimer.stop();

  switch (newState) {
    case States.STANDING:
      popup.hide();
      await changeCharacter('../assets/standing.png');
      if (inSnoozeCycle) {
        snoozeTimer.start();
      } else {
        reminderTimer.start();
      }
      break;
      
    case States.WAVING:
      await changeCharacter('../assets/waving.png');
      popup.show("Hiii gurlll! 💖\nIt's time for some water!", true);
      break;
      
    case States.DRINKING:
      inSnoozeCycle = false;
      await changeCharacter('../assets/drinking.png');
      popup.show("Yayyy!! 💖\nGood job staying hydrated!", false);
      setTimeout(() => {
        stateMachine.transitionTo(States.STANDING);
      }, 3000);
      break;
      
    case States.SAD:
      inSnoozeCycle = true;
      await changeCharacter('../assets/sad.png');
      popup.show("Okkayy 🥺\nI'll remind you again soon.", false);
      setTimeout(() => {
        stateMachine.transitionTo(States.STANDING);
      }, 3000);
      break;
  }
}

// Initialize FSM & Managers
const stateMachine = new StateMachine(States.STANDING, handleStateChange);
const popup = new PopupManager(
  () => stateMachine.transitionTo(States.DRINKING), // I Drank Callback
  () => stateMachine.transitionTo(States.SAD),     // Snooze Callback
  () => ipcRenderer.send('quit-app')               // Quit Callback
);

// Expose state actions globally for testing and easy triggers
const showStanding = () => stateMachine.transitionTo(States.STANDING);
const showWaving = () => stateMachine.transitionTo(States.WAVING);
const showDrinking = () => stateMachine.transitionTo(States.DRINKING);
const showSad = () => stateMachine.transitionTo(States.SAD);
const resetTimers = () => {
  reminderTimer.stop();
  snoozeTimer.stop();
};

window.puddly = {
  stateMachine,
  reminderTimer,
  snoozeTimer,
  showStanding,
  showWaving,
  showDrinking,
  showSad,
  resetTimers,
  // Helper to speed up timers for quick verification
  setTestDurations: (reminderMs = 5000, snoozeMs = 3000) => {
    reminderTimer.durationMs = reminderMs;
    snoozeTimer.durationMs = snoozeMs;
    console.log(`[PUDDLY] Test durations configured: Reminder = ${reminderMs}ms, Snooze = ${snoozeMs}ms`);
    // Restart current timers with new durations
    if (stateMachine.getCurrentState() === States.STANDING) {
      if (inSnoozeCycle) {
        snoozeTimer.start();
      } else {
        reminderTimer.start();
      }
    }
  }
};

// Press 'T' to trigger Test Mode (5s reminder, 3s snooze)
window.addEventListener('keydown', (e) => {
  if (e.key === 't' || e.key === 'T') {
    window.puddly.setTestDurations(5000, 3000);
    console.log("[PUDDLY] TEST MODE ACTIVATED: Reminder is now 5s, Snooze is 3s!");
  }
});

console.log("[PUDDLY] Renderer script initialized successfully.");

// Initial setup to display standing character on app launch
handleStateChange(States.STANDING);