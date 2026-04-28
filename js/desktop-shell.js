/** Phase 2 — boot overlay + draggable desktop windows. Loaded only in browser. */

import { attachCommandPalette } from "./command-palette.js";

const BOOT_LINES = [
  "Loading USDC Control Plane...",
  "Verifying trust invariants...",
  "Checking settlement assumptions...",
  "Scanning failure domains...",
  "Access granted.",
];

const WINDOWS = [
  {
    id: "lifecycle",
    title: "Asset Lifecycle",
    body: "Hybrid USDC / tokenized flow — simulator UI in a later phase.",
    className: "win-lifecycle",
  },
  {
    id: "invariant",
    title: "Invariant Monitor",
    body: "Supply integrity, replay safety, finality — status grid next.",
    className: "win-invariant",
  },
  {
    id: "explorer",
    title: "Chain State Explorer",
    body: "Command terminal (`inspect-finality`, `why-circle`, …) — wired in Phase 6.",
    className: "win-explorer",
  },
  {
    id: "failure",
    title: "Failure Modes",
    body: "Duplicate replay · finality disturbance · reconciliation drift.",
    className: "win-failure",
  },
  {
    id: "architecture",
    title: "Architecture",
    body:
      "How I think about programmable asset infrastructure — flow diagram fills this window later.",
    className: "win-architecture",
  },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function mount(rootSelector) {
  const root =
    typeof rootSelector === "string" ? document.querySelector(rootSelector) : rootSelector;
  if (!root) {
    return;
  }
  root.replaceChildren();

  runBootOverlay(root, () => {
    root.replaceChildren();
    const { shell, byId } = buildDesktop();
    root.appendChild(shell);
    attachCommandPalette(root, {
      focusWindow(id) {
        const el = byId.get(id);
        if (!el) {
          return;
        }
        bringToFront(el);
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      },
    });
  });
}

function runBootOverlay(root, onRevealDesktop) {
  const overlay = document.createElement("div");
  overlay.className = "boot-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "System boot sequence");

  const log = document.createElement("pre");
  log.className = "boot-log";
  log.setAttribute("aria-live", "polite");

  const skipWrap = document.createElement("div");
  skipWrap.className = "boot-skip-row";
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "boot-skip";
  skip.textContent = "Skip boot";
  skipWrap.appendChild(skip);

  overlay.appendChild(log);
  overlay.appendChild(skipWrap);
  root.appendChild(overlay);

  let done = false;
  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    document.removeEventListener("keydown", onKey);
    overlay.classList.add("boot-overlay--out");
    window.setTimeout(() => {
      onRevealDesktop();
    }, 280);
  };

  function onKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      finish();
    }
  }
  document.addEventListener("keydown", onKey);
  skip.addEventListener("click", finish);

  (async () => {
    for (const line of BOOT_LINES) {
      if (done) {
        break;
      }
      appendBootLine(log, line);
      await sleep(320);
    }
    if (!done) {
      await sleep(520);
      finish();
    }
  })();
}

function appendBootLine(container, text) {
  const row = document.createElement("div");
  row.className = "boot-line";
  row.textContent = "> " + text;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

let zCounter = 10;

function buildDesktop() {
  const shell = document.createElement("div");
  shell.className = "desktop-shell";

  /** @type {Map<string, HTMLElement>} */
  const byId = new Map();

  WINDOWS.forEach((def) => {
    const w = createWindow(def);
    byId.set(def.id, w);
    shell.appendChild(w);
  });

  return { shell, byId };
}

function createWindow(def) {
  const el = document.createElement("section");
  el.className = `desktop-window ${def.className}`;
  el.dataset.windowId = def.id;
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", def.title);

  const head = document.createElement("header");
  head.className = "desktop-window__head";

  const title = document.createElement("span");
  title.className = "desktop-window__title";
  title.textContent = def.title;

  head.appendChild(title);

  const body = document.createElement("div");
  body.className = "desktop-window__body";
  const p = document.createElement("p");
  p.className = "desktop-window__placeholder";
  p.textContent = def.body;
  body.appendChild(p);

  el.appendChild(head);
  el.appendChild(body);

  attachDrag(el, head);
  bringToFront(el);

  return el;
}

function bringToFront(el) {
  zCounter += 1;
  el.style.zIndex = String(zCounter);
}

function attachDrag(windowEl, handleEl) {
  let startX = 0;
  let startY = 0;
  let origLeft = 0;
  let origTop = 0;

  handleEl.style.cursor = "grab";

  handleEl.addEventListener("mousedown", (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    bringToFront(windowEl);
    handleEl.style.cursor = "grabbing";

    const rect = windowEl.getBoundingClientRect();
    windowEl.style.transform = "none";
    windowEl.style.right = "auto";
    windowEl.style.bottom = "auto";
    windowEl.style.left = `${Math.round(rect.left)}px`;
    windowEl.style.top = `${Math.round(rect.top)}px`;

    startX = e.clientX;
    startY = e.clientY;
    origLeft = rect.left;
    origTop = rect.top;

    /** @param {MouseEvent} ev */
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      windowEl.style.left = `${Math.round(origLeft + dx)}px`;
      windowEl.style.top = `${Math.round(origTop + dy)}px`;
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      handleEl.style.cursor = "grab";
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  handleEl.addEventListener("dblclick", () => {
    bringToFront(windowEl);
  });
}
