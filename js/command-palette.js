/** Phase 3 — command palette (⌘/Ctrl-K). */

import { populateHiddenMemo } from "./memo-content.js";

/**
 * @typedef {{ id: string; label: string; hint?: string; windowId?: string; openMemo?: boolean }} PaletteEntry
 */

/** @type {PaletteEntry[]} */
export const PALETTE_ENTRIES = [
  {
    id: "open-lifecycle",
    label: "Open Asset Lifecycle window",
    hint: "Simulator",
    windowId: "lifecycle",
  },
  {
    id: "open-invariants",
    label: "Open Invariant Monitor",
    hint: "Trust invariants",
    windowId: "invariant",
  },
  {
    id: "open-explorer",
    label: "Open Chain State Explorer",
    hint: "Terminal — type help",
    windowId: "explorer",
  },
  {
    id: "open-failure",
    label: "Open Failure Modes",
    hint: "Scenarios",
    windowId: "failure",
  },
  {
    id: "open-architecture",
    label: "Open Architecture window",
    hint: "System view",
    windowId: "architecture",
  },
  {
    id: "open-memo",
    label: "Open hidden memo",
    hint: "Circle intent + links",
    openMemo: true,
  },
];

/**
 * @param {string} query
 * @param {PaletteEntry[]} entries
 */
export function filterPaletteEntries(query, entries = PALETTE_ENTRIES) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...entries];
  }
  return entries.filter((e) => {
    const hay = `${e.label} ${e.hint ?? ""} ${e.id}`.toLowerCase();
    return hay.includes(q);
  });
}

/**
 * @param {HTMLElement} root
 * @param {{ focusWindow: (id: string) => void }} handlers
 */
export function attachCommandPalette(root, { focusWindow }) {
  let paletteOpen = false;
  let memoOpen = false;
  let selectedIndex = 0;

  const overlay = document.createElement("div");
  overlay.className = "palette-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Command palette");
  overlay.hidden = true;

  const panel = document.createElement("div");
  panel.className = "palette-panel";

  const input = document.createElement("input");
  input.className = "palette-input";
  input.type = "search";
  input.placeholder = "Search commands…";
  input.setAttribute("autocomplete", "off");
  input.setAttribute("aria-label", "Search commands");

  const list = document.createElement("ul");
  list.className = "palette-results";
  list.setAttribute("role", "listbox");

  const hintBar = document.createElement("div");
  hintBar.className = "palette-hint-bar";
  hintBar.innerHTML =
    '<span><kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> run · <kbd>Esc</kbd> close</span>';

  panel.appendChild(input);
  panel.appendChild(list);
  panel.appendChild(hintBar);

  const backdrop = document.createElement("div");
  backdrop.className = "palette-backdrop";
  backdrop.addEventListener("click", () => closePalette());

  overlay.appendChild(backdrop);
  overlay.appendChild(panel);
  root.appendChild(overlay);

  const memoOverlay = document.createElement("div");
  memoOverlay.className = "memo-overlay";
  memoOverlay.hidden = true;
  memoOverlay.setAttribute("role", "dialog");
  memoOverlay.setAttribute("aria-modal", "true");
  memoOverlay.setAttribute("aria-label", "Hidden memo");
  memoOverlay.innerHTML =
    `<div class="memo-backdrop"></div>` +
    `<div class="memo-panel"></div>`;
  root.appendChild(memoOverlay);
  memoOverlay.setAttribute("aria-hidden", "true");

  function closeMemo() {
    if (!memoOpen) {
      return;
    }
    memoOpen = false;
    memoOverlay.hidden = true;
    memoOverlay.setAttribute("aria-hidden", "true");
  }

  populateHiddenMemo(memoOverlay, closeMemo);

  memoOverlay.querySelector(".memo-backdrop")?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMemo();
  });

  function renderList() {
    const items = filterPaletteEntries(input.value);
    list.replaceChildren();
    selectedIndex = Math.min(selectedIndex, Math.max(0, items.length - 1));
    items.forEach((entry, i) => {
      const li = document.createElement("li");
      li.className = "palette-result" + (i === selectedIndex ? " palette-result--active" : "");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === selectedIndex ? "true" : "false");
      li.dataset.index = String(i);
      li.innerHTML = `<span class="palette-result-label">${escapeHtml(entry.label)}</span>${
        entry.hint ? `<span class="palette-result-hint">${escapeHtml(entry.hint)}</span>` : ""
      }`;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        runEntry(entry);
      });
      list.appendChild(li);
    });
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  /** @param {PaletteEntry} entry */
  function runEntry(entry) {
    closePalette();
    if (entry.openMemo) {
      openMemo();
      return;
    }
    if (entry.windowId) {
      focusWindow(entry.windowId);
    }
  }

  function openPalette() {
    if (memoOpen) {
      closeMemo();
    }
    paletteOpen = true;
    overlay.hidden = false;
    input.value = "";
    selectedIndex = 0;
    renderList();
    window.requestAnimationFrame(() => {
      input.focus();
    });
  }

  function closePalette() {
    if (!paletteOpen) {
      return;
    }
    paletteOpen = false;
    overlay.hidden = true;
  }

  function openMemo() {
    memoOpen = true;
    memoOverlay.hidden = false;
    memoOverlay.removeAttribute("aria-hidden");
    window.requestAnimationFrame(() => {
      memoOverlay.querySelector(".memo-close")?.focus();
    });
  }

  function togglePalette() {
    if (paletteOpen) {
      closePalette();
    } else {
      openPalette();
    }
  }

  input.addEventListener("input", () => {
    selectedIndex = 0;
    renderList();
  });

  input.addEventListener("keydown", (e) => {
    const items = filterPaletteEntries(input.value);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, items.length);
      renderList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + Math.max(1, items.length)) % Math.max(1, items.length);
      renderList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = items[selectedIndex];
      if (entry) {
        runEntry(entry);
      }
    }
  });

  function onGlobalKeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (!e.repeat) {
        togglePalette();
      }
      return;
    }
    if (e.key !== "Escape") {
      return;
    }
    if (memoOpen) {
      e.preventDefault();
      closeMemo();
      return;
    }
    if (paletteOpen) {
      e.preventDefault();
      closePalette();
    }
  }

  document.addEventListener("keydown", onGlobalKeydown, true);
}
