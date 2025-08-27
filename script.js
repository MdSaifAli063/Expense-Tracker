document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseCategorySelect = document.getElementById("expense-category");
  const expenseDateInput = document.getElementById("expense-date");
  const expenseNotesInput = document.getElementById("expense-notes");
  const editingIdInput = document.getElementById("editing-id");
  const submitBtn = document.getElementById("submit-btn");

  const searchInput = document.getElementById("search");
  const filterCategorySelect = document.getElementById("filter-category");
  const filterPeriodSelect = document.getElementById("filter-period");
  const sortBySelect = document.getElementById("sort-by");

  const expenseList = document.getElementById("expense-list");
  const emptyState = document.getElementById("empty-state");
  const expensesTitle = document.getElementById("expenses-title");
  const totalAmountDisplay = document.getElementById("total-amount");
  const totalCountDisplay = document.getElementById("total-count");
  const categorySummary = document.getElementById("category-summary");

  const clearAllBtn = document.getElementById("clear-all");

  const themeSwitch = document.getElementById("theme-switch");
  const toastRoot = document.getElementById("toast");
  const htmlEl = document.documentElement;

  // Storage keys
  const EXPENSES_KEY = "expenses_v1";
  const PREFS_KEY = "prefs_v1";

  // State
  let expenses = loadExpenses();
  let prefs = loadPrefs();

  // Initialize theme
  const initialTheme = prefs.theme || htmlEl.getAttribute("data-theme") || "dark";
  applyTheme(initialTheme);
  if (themeSwitch) {
    themeSwitch.checked = initialTheme === "dark";
  }

  // Default date to today
  expenseDateInput.valueAsDate = new Date();

  // Sync UI with prefs
  searchInput.value = prefs.search || "";
  filterCategorySelect.value = prefs.filterCategory || "all";
  filterPeriodSelect.value = prefs.filterPeriod || "all";
  sortBySelect.value = prefs.sortBy || "date-desc";

  // Event Listeners
  expenseForm.addEventListener("submit", onSubmit);
  expenseForm.addEventListener("reset", onReset);
  expenseList.addEventListener("click", onListClick);

  searchInput.addEventListener("input", () => {
    prefs.search = searchInput.value.trim();
    savePrefs();
    render();
  });
  filterCategorySelect.addEventListener("change", () => {
    prefs.filterCategory = filterCategorySelect.value;
    savePrefs();
    render();
  });
  filterPeriodSelect.addEventListener("change", () => {
    prefs.filterPeriod = filterPeriodSelect.value;
    savePrefs();
    render();
  });
  sortBySelect.addEventListener("change", () => {
    prefs.sortBy = sortBySelect.value;
    savePrefs();
    render();
  });

  if (clearAllBtn) clearAllBtn.addEventListener("click", clearAll);

  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const theme = themeSwitch.checked ? "dark" : "light";
      applyTheme(theme);
      prefs.theme = theme;
      savePrefs();
    });
  }

  // Initial render
  render();

  // Handlers
  function onSubmit(e) {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value || "Other";
    const date = parseDate(expenseDateInput.value) || new Date();
    const notes = expenseNotesInput.value.trim();

    if (!name || isNaN(amount) || amount <= 0) {
      return showToast("Please provide a valid name and amount greater than 0.", "error");
    }

    const editingId = editingIdInput.value ? Number(editingIdInput.value) : null;

    if (editingId) {
      const idx = expenses.findIndex(x => x.id === editingId);
      if (idx !== -1) {
        expenses[idx] = { ...expenses[idx], name, amount, category, date: date.toISOString(), notes };
        showToast("Expense updated.", "success");
      }
      submitBtn.textContent = "Add Expense";
      editingIdInput.value = "";
    } else {
      const newExpense = {
        id: Date.now(),
        name,
        amount,
        category,
        date: date.toISOString(),
        notes
      };
      expenses.push(newExpense);
      showToast("Expense added.", "success");
    }

    saveExpenses();
    expenseForm.reset();
    expenseDateInput.valueAsDate = new Date();
    render();
  }

  function onReset() {
    // Reset editing state
    if (editingIdInput.value) {
      editingIdInput.value = "";
      submitBtn.textContent = "Add Expense";
    }
  }

  function onListClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const li = btn.closest("li.expense-item");
    const id = li ? Number(li.getAttribute("data-id")) : null;
    if (!id) return;

    const action = btn.getAttribute("data-action");
    if (action === "delete") {
      deleteExpense(id);
    } else if (action === "edit") {
      editExpense(id);
    }
  }

  // Actions
  function deleteExpense(id) {
    const exp = expenses.find(x => x.id === id);
    if (!exp) return;
    if (!confirm(`Delete "${exp.name}" for ${formatNumber(exp.amount)}?`)) return;
    expenses = expenses.filter(x => x.id !== id);
    saveExpenses();
    render();
    showToast("Expense deleted.", "success");
  }

  function editExpense(id) {
    const exp = expenses.find(x => x.id === id);
    if (!exp) return;
    expenseNameInput.value = exp.name;
    expenseAmountInput.value = exp.amount.toString();
    expenseCategorySelect.value = exp.category;
    expenseDateInput.value = exp.date ? exp.date.slice(0, 10) : "";
    expenseNotesInput.value = exp.notes || "";
    editingIdInput.value = String(exp.id);
    submitBtn.textContent = "Update Expense";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearAll() {
    if (expenses.length === 0) return;
    if (!confirm("This will delete all expenses. Continue?")) return;
    expenses = [];
    saveExpenses();
    render();
    showToast("All expenses cleared.", "success");
  }

  // Render
  function render() {
    const view = filteredAndSorted(expenses, prefs);
    renderList(view);
    renderTotals(view);
    renderCategorySummary(view);
  }

  function renderList(list) {
    expenseList.innerHTML = "";
    if (list.length === 0) {
      emptyState.style.display = "block";
      expensesTitle.textContent = "Expenses";
      return;
    }
    emptyState.style.display = "none";
    expensesTitle.textContent = `Expenses (${list.length})`;

    const frag = document.createDocumentFragment();

    for (const expense of list) {
      const li = document.createElement("li");
      li.className = "expense-item";
      li.setAttribute("data-id", String(expense.id));

      const left = document.createElement("div");
      left.className = "item-left";

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = expense.name;

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = expense.category || "Other";

      const date = document.createElement("small");
      date.className = "date";
      date.textContent = formatDate(expense.date);

      const notes = document.createElement("small");
      notes.className = "notes";
      notes.textContent = expense.notes ? `• ${expense.notes}` : "";

      left.append(name, badge, date);
      if (expense.notes) left.append(notes);

      const right = document.createElement("div");
      right.className = "item-right";

      const amount = document.createElement("span");
      amount.className = "amount";
      amount.textContent = formatNumber(expense.amount);

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.setAttribute("data-action", "edit");
      editBtn.setAttribute("aria-label", "Edit expense");
      editBtn.title = "Edit";
      editBtn.textContent = "✏️";

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn danger";
      delBtn.setAttribute("data-action", "delete");
      delBtn.setAttribute("aria-label", "Delete expense");
      delBtn.title = "Delete";
      delBtn.textContent = "🗑️";

      right.append(amount, editBtn, delBtn);

      li.append(left, right);
      frag.appendChild(li);
    }

    expenseList.appendChild(frag);
  }

  function renderTotals(list) {
    const total = list.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    totalAmountDisplay.textContent = formatNumber(total);
    totalCountDisplay.textContent = `(${list.length} ${list.length === 1 ? "item" : "items"})`;
  }

  function renderCategorySummary(list) {
    categorySummary.innerHTML = "";
    if (list.length === 0) return;

    const map = new Map();
    for (const e of list) {
      const key = e.category || "Other";
      map.set(key, (map.get(key) || 0) + Number(e.amount || 0));
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

    for (const [cat, sum] of entries) {
      const chip = document.createElement("div");
      chip.className = "chip";
      const label = document.createElement("span");
      label.textContent = cat;
      const amount = document.createElement("span");
      amount.className = "amount";
      amount.textContent = formatNumber(sum);
      chip.append(label, amount);
      categorySummary.appendChild(chip);
    }
  }

  // Filters + sorting
  function filteredAndSorted(all, prefs) {
    let list = all.slice();

    // Search
    const q = (prefs.search || "").toLowerCase();
    if (q) {
      list = list.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    // Category
    if (prefs.filterCategory && prefs.filterCategory !== "all") {
      list = list.filter(e => (e.category || "Other") === prefs.filterCategory);
    }

    // Period
    const now = new Date();
    if (prefs.filterPeriod === "this-month") {
      list = list.filter(e => isSameMonth(parseDate(e.date) || now, now));
    } else if (prefs.filterPeriod === "last-30") {
      const since = new Date(now);
      since.setDate(since.getDate() - 30);
      list = list.filter(e => {
        const d = parseDate(e.date);
        return d && d >= since && d <= now;
      });
    }

    // Sort
    const sort = prefs.sortBy || "date-desc";
    list.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return compareDates(a.date, b.date);
        case "date-desc":
          return compareDates(b.date, a.date);
        case "amount-asc":
          return Number(a.amount) - Number(b.amount);
        case "amount-desc":
          return Number(b.amount) - Number(a.amount);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        default:
          return 0;
      }
    });

    return list;
  }

  // Theme
  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
  }

  // Storage
  function loadExpenses() {
    try {
      const raw = localStorage.getItem(EXPENSES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      // sanitize
      return parsed.map(e => ({
        id: Number(e.id),
        name: String(e.name || ""),
        amount: Number(e.amount || 0),
        category: String(e.category || "Other"),
        date: e.date || new Date().toISOString(),
        notes: String(e.notes || "")
      }));
    } catch {
      return [];
    }
  }

  function saveExpenses() {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const p = raw ? JSON.parse(raw) : {};
      return {
        search: p.search || "",
        filterCategory: p.filterCategory || "all",
        filterPeriod: p.filterPeriod || "all",
        sortBy: p.sortBy || "date-desc",
        theme: p.theme || null
      };
    } catch {
      return { search: "", filterCategory: "all", filterPeriod: "all", sortBy: "date-desc" };
    }
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }

  // Utils
  function parseDate(input) {
    if (!input) return null;
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  function compareDates(a, b) {
    const da = parseDate(a);
    const db = parseDate(b);
    if (!da && !db) return 0;
    if (!da) return -1;
    if (!db) return 1;
    return da - db;
  }

  function isSameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function formatDate(input) {
    const d = parseDate(input);
    if (!d) return "";
    try {
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }

  function formatNumber(n) {
    const num = Number(n || 0);
    try {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch {
      return num.toFixed(2);
    }
  }

  // Toasts
  function showToast(message, type = "success", timeout = 2600) {
    if (!toastRoot) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : "success"}`;
    toast.textContent = message;
    toastRoot.appendChild(toast);
    const timer = setTimeout(() => {
      toast.remove();
      clearTimeout(timer);
    }, timeout);
  }

  /* ========= Export TXT =========
     Exports all stored expenses in a readable .txt file with header and totals.
     - Uses the in-memory 'expenses' array (correct app state)
     - Shows toasts on success/empty
     - File name: expenses_YYYY-MM-DD.txt
  */
  (function setupExportTxt() {
    const btn = document.getElementById("export-txt");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const data = expenses.slice(); // use current app state
      if (!data.length) {
        showToast("Nothing to export.", "error");
        return;
      }

      const content = buildTxt(data);
      const dateStamp = new Date().toISOString().slice(0, 10);
      downloadText(content, `expenses_${dateStamp}.txt`);
      showToast("Exported TXT.", "success");
    });

    function buildTxt(list) {
      const lines = [];
      const now = new Date();
      const total = list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      lines.push("Expense Tracker - Export");
      lines.push(`Generated: ${now.toLocaleString()}`);
      lines.push("");

      // Header
      lines.push("Date\tName\tCategory\tAmount\tNotes");

      // Rows
      for (const e of list) {
        const date = safeDate(e.date);
        const name = sanitize(e.name);
        const category = sanitize(e.category || "");
        const amount = fixed2(e.amount);
        const notes = sanitize(e.notes || "");
        lines.push(`${date}\t${name}\t${category}\t${amount}\t${notes}`);
      }

      lines.push("");
      lines.push(`Total items: ${list.length}`);
      lines.push(`Total amount: ${fixed2(total)}`);

      return lines.join("\n");
    }

    function safeDate(value) {
      if (!value) return "";
      try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString();
      } catch {
        return String(value);
      }
    }

    function fixed2(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "";
      return n.toFixed(2);
    }

    function sanitize(s) {
      // Replace tabs and CR/LF to keep a clean TSV-like text
      return String(s).replace(/\t/g, " ").replace(/\r?\n/g, " / ");
    }

    function downloadText(text, filename) {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "expenses.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  })();
});