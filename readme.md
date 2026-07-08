# Puddly

<p align="center">
  <img src="assets/icon.png" alt="Puddly Logo" width="120">
</p>

<p align="center">
  <b>Your adorable desktop hydration companion.</b><br>
  Stay hydrated with gentle reminders from a cute desktop companion that lives on your screen.
</p>

---

## Overview

Puddly is a cross-platform desktop companion built with **Electron** that helps users stay hydrated throughout the day.

Instead of sending traditional notifications, Puddly walks onto your desktop, reminds you to drink water through cute animations and interactive dialogues, and then walks away after you respond.

Designed to be lightweight, non-intrusive, and enjoyable to use.

---

## Features

- Cute animated desktop companion
- 🚶 Walk-in & walk-out reminder animations
- 👋 Multiple character states
  - Standing
  - Waving
  - Drinking
  - Sad
- 💬 Interactive speech bubble
- ✅ "I Drank" confirmation
- 😴 Snooze reminders
- 📌 Always-on-top desktop companion
- 🖱️ Draggable companion with remembered position
- 🍎 Native macOS system tray support
- ⚙️ Configurable reminder intervals
- 🌙 Do Not Disturb mode
- 💾 Persistent user preferences
- ❌ Native Quit option

---

## 🖥️ Tech Stack

- Electron
- HTML5
- CSS3
- JavaScript (ES6)

---

## 📂 Project Structure

```text
Puddly/
│
├── assets/
│   ├── standing.png
│   ├── waving.png
│   ├── drinking.png
│   ├── sad.png
│   ├── walk1.png
│   ├── walk2.png
│   ├── walk3.png
│   └── icon.png
│
├── main/
│   └── main.js
│
├── renderer/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── character.js
│   ├── popup.js
│   ├── states.js
│   └── timer.js
│
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/Puddly.git
```

Go into the project

```bash
cd Puddly
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm start
```

---

## 💙 How It Works

1. Puddly quietly stays on your desktop.
2. After the configured reminder interval, she walks onto the screen.
3. A hydration reminder appears.
4. You can either:
   - 💧 I Drank
   - 😴 Snooze
5. Puddly responds with an animation and walks away.
6. The reminder timer resets automatically.

---

## 🌙 System Tray

The tray provides quick access to:

- Do Not Disturb
- Reminder Interval
- About
- Quit

---

## 📸 Screenshots

> Screenshots and GIFs coming soon.

---

## 🛣️ Roadmap

### ✅ Completed

- Animated desktop companion
- State machine
- Walking animations
- Interactive speech bubble
- Reminder actions
- Always-on-top window
- Native tray menu
- Reminder interval settings
- Do Not Disturb
- Persistent settings
- Draggable companion

### 🚧 In Progress

- Idle animations
- Settings window
- Reminder scheduler improvements
- Better walking animations
- Custom reminder messages

### 🔮 Future Plans

- Daily hydration statistics
- Water streak tracking
- Multiple companion characters
- Themes
- Stretch reminders
- Eye-care reminders
- Auto updates
- Native installers (.dmg & .exe)

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are always welcome.

Feel free to open an Issue or submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Pratiti Paul**

Built with 💙 and lots of water.