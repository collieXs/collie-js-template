# collie-js-template

A lightweight, boilerplate structure for COLLIE JS library, packed with a clean architecture and a built-in demo project to see it in action.

---

## 📂 Project Structure

Here is a breakdown of the directory layout so you know exactly where everything lives:

```text
├── assets/
│   ├── fonts/          # Custom typography files
│   ├── images/         # Image assets used in the project
│   └── sounds/         # Audio clips (videos and audios)
│
├── js/
│   ├── collie/         # Core library directory (your custom JS tools)
│   │   ├── assemble.js # Library component assembler
│   │   ├── funcs.js    # Utility helper functions
│   │   └── iconObj.js  # Svg Icon data handling
│   │
│   ├── layouts/        # Layout structure scripts
│   │   └── taskTracker/ # Specific layouts (e.g., Task Tracker components)
│   │
│   └── main.js         # Entry point for the demo/application logic
│
├── scss/               # Styling source files
├── index.html          # Main HTML entry point for the demo project
└── README.md           # Project documentation