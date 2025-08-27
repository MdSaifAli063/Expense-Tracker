# 💸 Expense Tracker

A beautiful, responsive, and accessible Expense Tracker built with vanilla HTML, CSS, and JavaScript. Includes light/dark themes, powerful filtering, sorting, exporting, and delightful micro-interactions.

## ✨ Features

- Modern UI with responsive layout and card-style list items
- Light/Dark themes with a toggle (persisted in localStorage)
- Add, edit, and delete expenses
- Search by name and notes in real-time
- Filter by category and time period (All time, This month, Last 30 days)
- Sort by date, amount, or name
- Category summary chips
- Animated toast notifications
- Export expenses as a .txt file
- Clear all data with confirmation
- Keyboard and screen reader friendly

## 🖼️ Preview

- Open index.html in your browser to see the app.
- Optional: Add screenshots to a /screenshots folder and reference them here.

## 🧱 Tech Stack

- HTML5, CSS3 (CSS variables, grid, responsive)
- Vanilla JavaScript (localStorage for persistence)
- No build tools required

## 🚀 Getting Started

1. Download or clone this repository
2. Run it locally:

- Option A: Double-click index.html to open in your browser
- Option B: Serve with a local server (recommended for best path handling)
  - VS Code Live Server extension
  - Node: npx serve . or npx http-server .

3. Start using the app:

- Fill in the form at the top and click "Add Expense"
- Use the controls to search, filter, sort, export, or clear

## 📁 Project Structure

- index.html — App structure and UI controls
- style.css — Theme, layout, components, animations
- script.js — App logic, rendering, storage, events
- README.md — You’re here

## 🧩 UI and Controls

- Theme: Toggle the ☀️/🌙 switch to switch themes. The theme is saved and restored on reload.
- Form:
  - Name, Amount, Category, Date are required
  - Notes are optional
  - Hidden field #editing-id is used internally for editing mode
- Filters:
  - Search: Matches name and notes
  - Category: All or a specific category
  - Period: All time, This month, Last 30 days
  - Sort: Date, Amount, Name (asc/desc)
- Actions:
  - Export TXT: Downloads current (filtered) list as a .txt file
  - Clear All: Removes all expenses after confirmation
- Summary:
  - Category chips show totals grouped by category
- Totals:
  - Displays total amount and item count of the current view

## ⌨️ Keyboard & Accessibility

- Tab through inputs, selects, and buttons
- Focus styles are highly visible
- aria-labels and role attributes included for screen readers
- Toast area uses aria-live="polite"
- Reduced motion: Honors prefers-reduced-motion

## 🎨 Theming and Customization

- The root element <html> carries data-theme="light" or data-theme="dark"
- Colors and component metrics are controlled via CSS variables in :root
- To change the default theme, switch the data-theme attribute in index.html or update the script’s initialization

Key CSS variables (style.css):

- --bg, --surface, --surface-2, --text, --muted, --border
- --primary, --danger, --warning, --success
- --card-radius, --radius, --shadow-1

Tip: You can add or rename categories by editing the <select> options in both the form and filter controls in index.html.

## 🗄️ Data Persistence

- Expenses are stored in the browser’s localStorage
- Data remains on the same device and browser unless cleared
- Use “Clear All” to wipe storage for this app

## 🧪 Exporting

- “Export TXT” generates a text file of the currently visible (filtered/sorted) list
- Great for quick sharing or archiving
- For CSV/JSON export, you can extend the script to generate other formats

## 🌐 Browser Support

- Modern Chromium, Firefox, and Safari are supported
- Advanced CSS (e.g., color-mix) looks best on up-to-date browsers
- If something looks off on very old browsers, try updating

## 🔧 Troubleshooting

- “Nothing appears in the list”
  - Ensure required fields are filled
  - Check the filters (maybe they’re excluding your items)
- “Theme doesn’t stick”
  - Make sure localStorage is available (private browsing modes may restrict this)
- “Export doesn’t download”
  - Some mobile browsers block downloads; try on desktop or change permissions

## 🗺️ Roadmap Ideas

- CSV/JSON export
- Monthly budgets and progress bars
- Charts for category spending
- Multi-currency support
- Import from CSV

## 🤝 Contributing

- Fork, branch, and open a PR with a clear description
- Keep the UI accessible and responsive
- Add tests or manual test notes when changing logic

## 📄 License

- MIT — Use it freely, attribution appreciated

## 💡 Credits

- Design and implementation: You
- Icons: Native emoji (no external dependencies)

Enjoy tracking your expenses!
