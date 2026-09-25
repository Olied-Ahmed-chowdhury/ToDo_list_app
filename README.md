# âœ… ToDo List App

A **beautiful, responsive To-Do List app** built with pure HTML, CSS, and JavaScript â€” no frameworks, no libraries, just clean and well-commented code.

ðŸ”— **Live Demo:** [https://github.com/Olied-Ahmed-chowdhury/ToDo_list_app](https://github.com/Olied-Ahmed-chowdhury/ToDo_list_app)

---

## âœ¨ Features

- âž• **Add tasks** â€” type and press Enter or click the `+` button
- âœ… **Mark as done** â€” click the circle checkbox to complete a task
- ðŸ—‘ï¸ **Delete tasks** â€” hover over a task to reveal the Ã— button
- ðŸ” **Filter tasks** â€” switch between **ðŸ“‹ All**, **â³ Pending**, and **âœ… Done**
- ðŸ’¾ **Auto-save** â€” tasks are saved in `localStorage` and survive page refresh
- ðŸ“Š **Live stats bar** â€” shows Total, Pending, and Done counts in real time

---

## ðŸŽ¨ Design

- **Dark glassmorphism** card with frosted-glass effect
- **Mesh gradient** background (navy with cyan, indigo, and emerald blobs)
- **Gradient text** title (cyan â†’ indigo â†’ emerald)
- **Segmented pill filter bar** â€” each active tab has its own unique colour
- **Spring slide-in animation** for new tasks
- **Shimmer effect** on the Add button
- Responsive â€” works on desktop and mobile

---

## ðŸ“ Project Structure

```
ToDo_list_app/
â”œâ”€â”€ index.html   # Page structure
â”œâ”€â”€ style.css    # All styling (heavily commented)
â””â”€â”€ app.js       # All logic  (heavily commented)
```

---

## ðŸš€ How to Run Locally

1. Clone or download the repo
2. Open a terminal in the project folder
3. Run a local server (e.g. with Node.js):
   ```bash
   npx serve .
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

> You can also just open `index.html` directly in any browser â€” no build step needed.

---

## ðŸ› ï¸ Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, animations, glassmorphism |
| JavaScript (ES6) | App logic, DOM manipulation, localStorage |
| Google Fonts (Inter) | Clean, modern typography |

---

## ðŸ“ Code Philosophy

Every file is written to be **as readable as possible**:
- `index.html` â€” short, plain-English comments on each section
- `style.css` â€” table of contents at the top, variables in one place, section headers
- `app.js` â€” grouped into named sections (STORAGE, RENDER, ADD, TOGGLE, DELETEâ€¦)

---

## ðŸ‘¤ Author

**Olied Ahmed Chowdhury**  
GitHub: [@Olied-Ahmed-chowdhury](https://github.com/Olied-Ahmed-chowdhury)
