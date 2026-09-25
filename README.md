# ToDo List App

A **beautiful, responsive To-Do List app** built with pure HTML, CSS, and JavaScript - no frameworks, no libraries, just clean and well-commented code.

**Live Demo:** https://olied-ahmed-chowdhury.github.io/ToDo_list_app/

---

## Features

- **Add tasks** - type and press Enter or click the `+` button
- **Mark as done** - click the circle checkbox to complete a task
- **Delete tasks** - hover over a task to reveal the x button
- **Filter tasks** - switch between All, Pending, and Done tabs
- **Auto-save** - tasks are saved in `localStorage` and survive page refresh
- **Live stats bar** - shows Total, Pending, and Done counts in real time

---

## Design

- Dark glassmorphism card with frosted-glass effect
- Mesh gradient background (navy with cyan, indigo, and emerald blobs)
- Gradient text title (cyan to indigo to emerald)
- Segmented pill filter bar - each active tab has its own unique colour
- Spring slide-in animation for new tasks
- Shimmer effect on the Add button
- Responsive - works on desktop and mobile

---

## Project Structure

```
ToDo_list_app/
|-- index.html   # Page structure
|-- style.css    # All styling (heavily commented)
|-- app.js       # All logic  (heavily commented)
```

---

## How to Run Locally

1. Clone or download the repo
2. Open a terminal in the project folder
3. Run a local server:
   ```bash
   npx serve .
   ```
4. Open http://localhost:3000 in your browser

> You can also open `index.html` directly in any browser - no build step needed.

---

## Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, glassmorphism |
| JavaScript (ES6) | App logic, DOM manipulation, localStorage |
| Google Fonts (Inter) | Clean, modern typography |

---

## Code Philosophy

Every file is written to be as readable as possible:

- `index.html` - short, plain-English comments on each section
- `style.css` - table of contents at the top, variables in one place, section headers
- `app.js` - grouped into named sections (STORAGE, RENDER, ADD, TOGGLE, DELETE...)

---

## Author

**Olied Ahmed Chowdhury**
GitHub: https://github.com/Olied-Ahmed-chowdhury
