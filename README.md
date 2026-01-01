# 💸 Expense Tracker

A modern, responsive, and accessible **Expense Tracker** built with **vanilla HTML, CSS & JavaScript**.  
Track, filter, and manage expenses with ease — includes light/dark themes, sorting, exporting, and smooth interactions.  

---

## ✨ Features

- 📱 **Responsive UI** – Clean card-style design that works on all devices  
- 🌓 **Light/Dark Mode** – Toggle with persistence (saved in localStorage)  
- ➕ **Expense Management** – Add, edit, delete expenses quickly  
- 🔍 **Search & Filters** – Real-time search by name/notes, filter by category or time (All, This Month, Last 30 Days)  
- ↕ **Sorting** – Sort expenses by date, amount, or name (asc/desc)  
- 🏷️ **Category Chips** – Quick view of totals per category  
- 📊 **Summary & Totals** – Displays total amount + item count of current view  
- 🔔 **Toast Notifications** – Animated feedback for user actions  
- 📂 **Export** – Download expenses as `.txt` file  
- 🗑️ **Clear All** – Delete all data with confirmation  
- ♿ **Accessibility** – Keyboard navigation, ARIA labels, reduced motion support  

---

## 🖼️ Preview

![image](https://github.com/MdSaifAli063/Expense-Tracker/blob/f83c878810980359eb870d538f2d991ebf942b0a/Screenshot%202025-09-23%20010618.png)

---

## 🧱 Tech Stack

- **HTML5** – App structure & forms  
- **CSS3** – CSS variables, grid, responsive layout, animations  
- **Vanilla JavaScript** – App logic, filtering, sorting, localStorage persistence  
- ✅ No build tools or frameworks required  

---

## 🚀 Getting Started

1. **Clone or Download** this repository  
2. **Run locally**:  
   - Option A: Open `index.html` directly  
   - Option B: Run with a local server (recommended for best path handling):  
     - VS Code Live Server extension  
     - Node: `npx serve .` or `npx http-server .`  
3. **Start using**:  
   - Add expenses using the form  
   - Use filters, search, sorting, and export features  

---

## 📁 Project Structure

- `index.html` — App structure and controls  
- `style.css` — Layout, themes, animations  
- `script.js` — Logic, storage, rendering  
- `README.md` — Documentation  

---

## 🧩 UI & Controls
- **Theme:** ☀️/🌙 toggle (saved in localStorage)  
- **Form:** Name, Amount, Category, Date (required); Notes optional  
- **Filters:** Search, Category, Period, Sort  
- **Actions:** Export `.txt`, Clear All  
- **Summary:** Category chips + total spending overview  

---

## ⌨️ Accessibility
- Tab-friendly navigation with clear focus styles  
- Screen reader support with `aria-labels`  
- Toast area uses `aria-live="polite"`  
- Supports `prefers-reduced-motion`  

---

## 🎨 Theming & Customization
- `<html>` carries `data-theme="light"` or `data-theme="dark"`  
- Controlled via CSS variables in `:root`  
- Key variables:  
  - Colors: `--bg, --surface, --text, --primary, --danger, ...`  
  - Components: `--card-radius, --radius, --shadow-1`  
- Update `<select>` options in `index.html` to add or rename categories  

---

## 🗄️ Data Persistence
- Expenses stored in **localStorage**  
- Data stays until manually cleared  
- Use **Clear All** to wipe storage  

---

## 🧪 Exporting
- Export visible (filtered/sorted) list as `.txt`  
- Can be extended for **CSV** or **JSON** export  

---

## 🌐 Browser Support
- Works on latest **Chrome, Firefox, Safari**  
- Advanced CSS (e.g., `color-mix`) looks best on up-to-date browsers  
- May degrade on very old browsers  

---

## 🔧 Troubleshooting
- **Nothing shows?** → Check required fields or filters  
- **Theme doesn’t stick?** → Ensure localStorage is allowed (private browsing may block it)  
- **Export doesn’t download?** → Try desktop browser (some mobile browsers restrict downloads)  

---

## 🗺️ Roadmap
- CSV/JSON export  
- Monthly budgets with progress bars  
- Category spending charts  
- Multi-currency support  
- Import from CSV  

---

## 🤝 Contributing
- Fork, branch, and open a PR with clear description  
- Keep UI **accessible & responsive**  
- Add tests or manual test notes for changes  

---

## 📄 License
MIT — free to use and modify with attribution  

---

## 💡 Credits
- 👨‍💻 Design & implementation: You  
- 🎨 Icons: Native emoji (no dependencies)  

---
