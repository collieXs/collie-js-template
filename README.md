# collie-js

A lightweight, offline-first boilerplate for building websites and PWAs — no frameworks, no build tools, no bundler.

---

## Why collie-js exists

Vanilla JavaScript projects tend to go one of two ways: a single sprawling HTML file that gets harder to navigate with every feature added, or a jump straight to React — component structure, but at the cost of a build step, `node_modules`, and a project that can no longer just *run*, offline, the moment you open it.

collie-js borrows the one idea from React worth borrowing without the rest of the weight: break a page into components that assemble back into one — the same problem React itself was built to solve in 2011, code that grew too tangled to safely change. No virtual DOM, no build tools, no bundler. Just files, organized, that a browser can load directly.

Alongside that, collie-js ships a small toolkit of the things every interactive vanilla project ends up needing anyway — a way to track state (`createState`), conditional and list rendering (`renderIf`, `renderList`), shorthand for the DOM APIs you write constantly (`cE`, `sH`, `tE`, `tEs`), and a few gestures the browser doesn't hand you for free (`onHold`, `debounce`, a non-blocking `customAlert`). None of it is required — collie-js is a starting structure, not a dependency. Clone it, edit anything, delete what you don't need.

---

## 📂 Project Structure

```text
project-root/
├── assets/
│   ├── fonts/
│   ├── images/
│   └── sounds/
│
├── js/
│   ├── collie/                  # the library itself
│   │   ├── assemble.js          # bootstraps the library, attaches everything to window
│   │   ├── funcs.js             # core utility functions
│   │   └── iconObj.js           # SVG icon set — optional, delete if you prefer importing icons
│   │
│   ├── layouts/
│   │   ├── components/          # PascalCase — functional components shared across ALL sections
│   │   │
│   │   └── sections/            # PascalCase or any case — one object component per folder
│   │       └── Home/
│   │           ├── assemble.js  # the section's {UI, logic} — its own object component
│   │           └── modules/     # functional components used ONLY by this section
│   │
│   ├── utils/                   # camelCase — standalone behaviors, not UI (e.g. scrollEffect.js)
│   └── main.js                  # entry point for a static site — use app.js instead for a PWA
│
├── scss/                        # mirrors js/ folder-for-folder, file-for-file (optional folder)
│   ├── layouts/
│   │   ├── components/
│   │   │   └── _assemble.scss   # imports every partial in this folder
│   │   │
│   │   └── sections/
│   │       ├── _assemble.scss   # imports every section's own _assemble.scss
│   │       └── Home/
│   │           ├── _assemble.scss
│   │           └── modules/
│   │               └── _assemble.scss
│   │
│   ├── utils/
│   │   ├── _reset.scss
│   │   ├── _variables.scss
│   │   └── _assemble.scss
│   │
│   └── main.scss                # imports utils, components, and sections — compiles to main.min.css
│
├── index.html
├── main.min.css
└── README.md
```

---

## Getting Started

1. Click **Use this template** and clone your new repo.
2. Open `index.html`. Note the two script tags:
   ```html
   <script type="module" src="./js/collie/assemble.js"></script>
   <script type="module" src="./js/main.js"></script>
   ```
   The library always loads first, in the `<head>`. Your app code (`main.js` for a static site, `app.js` for a PWA) loads second, at the bottom of `<body>`.
3. Build your sections inside `js/layouts/sections/`, one folder per section.
4. Don't need SCSS? Delete the `scss/` folder and link Tailwind or plain CSS directly in `index.html`.

---

## Naming Conventions

- **PascalCase** — components and sections (`ProjectCard.js`, `Home/`). Signals "this is a UI piece."
- **camelCase** — utilities (`scrollEffect.js`, `markdown.js`). Signals "this is a behavior, not a UI piece."
- Beyond that split, casing for your own section/folder names is entirely up to you.

---

## `components/` vs a section's `modules/`

- **`layouts/components/`** — functional components shared across two or more sections.
- **A section's own `modules/` folder** — functional components used by that one section only, and nothing else. Keeping them local, rather than in the global `components/` folder, makes the scope obvious from the file's address alone.

---

## The SCSS `_assemble.scss` pattern

Every folder that holds more than one file gets its own `_assemble.scss`, whose only job is to `@import` its immediate children — never actual styles itself. This repeats at every depth, so `main.scss` only ever needs a handful of `@import` lines regardless of how large the project grows:

```scss
// scss/main.scss
@import 'utils/assemble';
@import 'layouts/components/assemble';
@import 'layouts/sections/assemble';
```

collie-js only uses `@import`, not `@forward`/`@use`.

---

## Core Functions (`funcs.js`)

| Function | Description |
|---|---|
| `cE(tagName, className)` | Shorthand for `document.createElement`, with an optional class names. |
| `sH(el, html)` | Sets `innerHTML` on an element. |
| `tE(selector, context?)` | Shorthand for `querySelector`. Warns if nothing is found. |
| `tEs(selector, context?)` | Shorthand for `querySelectorAll`. Warns if nothing is found. |
| `renderIf(condition, html)` | Returns `html` if `condition` is truthy, else an empty string. |
| `renderList(array, fn)` | Maps an array to HTML strings and joins them. |
| `addEvent(el, event, fn, options?)` | Shorthand for `addEventListener`, with param validation. |
| `createState(initial)` | Lightweight state container with `.get()`, `.set(newVal, callback)` and `sub(fn)`. |
| `debounce(fn, delaySeconds)` | Delays invoking `fn` until `delaySeconds` have passed since the last call. |
| `onHold(element, callback, holdDuration?)` | Fires `callback` after a long-press/hold, unified across mouse and touch. |
| `cTC(target)` | Copies an element's `innerText` to the clipboard. |
| `customAlert(message, options?)` | Promise-based, styleable replacement for the native `alert()`/`confirm()`. |

### A note on `customAlert`

Loading `funcs.js` replaces the browser's native `window.alert` with `customAlert`. The original is preserved at `window.nativeAlert` if you ever need it.

---

## Icons (`iconObj.js`)

All icons live in one plain object, attached to `window.icons`. Add new icons directly to this file — no registration function, no build step:

```js
window.icons.plus // returns the SVG string
```

SVGs are hardcoded rather than imported, so icons render with zero network calls. This file is entirely optional — delete it (and its one line in `js/collie/assemble.js`) if you'd rather import icons the conventional way.

---

## Component Pattern

Sections and shared components follow an object-component shape:

```js
export default {
  UI: `<div>...</div>`,
  logic: () => {
    // event bindings, state, render logic
  }
}
```

Use a function component only when the component needs arguments passed in.

---

## Demos

Looking for a working example? Check out projects built with collie-js: *(links coming soon)*

---

## License

MIT
