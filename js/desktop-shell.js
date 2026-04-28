/** Phase 2 / 2.5 — boot, launcher icons, onboarding, draggable windows. Browser only. */

import { attachCommandPalette } from "./command-palette.js";
import { mountLifecycleSimulator } from "./lifecycle-simulator-ui.js";
import { mountInvariantMonitor } from "./invariant-monitor-ui.js";
import { mountChainExplorer } from "./chain-explorer-ui.js";
import { mountFailureModes } from "./failure-modes-ui.js";
import { attachDesktopChrome } from "./desktop-chrome.js";
import { mountDesktopIcons } from "./desktop-icons.js";
import { mountArchitectureWindow } from "./architecture-ui.js";
import { mountOnboardingWizard } from "./onboarding-ui.js";
import { isOnboardingComplete } from "./onboarding-storage.js";

const BOOT_LINES = [
  "Loading BazingaOS...",
  "Verifying trust invariants...",
  "Checking settlement assumptions...",
  "Scanning failure domains...",
  "Access granted.",
];

/** App windows (programs). Shown only after opening from an icon or the palette. */
const WINDOWS = [
  {
    id: "lifecycle",
    title: "Asset Lifecycle",
    body: "",
    className: "win-lifecycle",
  },
  {
    id: "invariant",
    title: "Invariant Monitor",
    body: "",
    className: "win-invariant",
  },
  {
    id: "explorer",
    title: "Chain State Explorer",
    body: "",
    className: "win-explorer",
  },
  {
    id: "failure",
    title: "Failure Modes",
    body: "",
    className: "win-failure",
  },
  {
    id: "architecture",
    title: "Architecture",
    body: "",
    className: "win-architecture",
  },
];

const ONBOARDING_DEF = {
  id: "onboarding",
  title: "Getting started",
  body: "",
  className: "win-onboarding",
};

/** Desktop program shortcuts — emoji + default position (% of desktop). */
const LAUNCHERS = [
  { id: "lifecycle", label: "Lifecycle", glyph: "📊", defaultPct: { left: 5, top: 12 } },
  { id: "invariant", label: "Invariants", glyph: "🛡️", defaultPct: { left: 5, top: 32 } },
  { id: "explorer", label: "Explorer", glyph: "🔎", defaultPct: { left: 22, top: 12 } },
  { id: "failure", label: "Failures", glyph: "⚠️", defaultPct: { left: 22, top: 32 } },
  {
    id: "architecture",
    label: "Architecture",
    glyph: "📐",
    defaultPct: { left: 39, top: 12 },
  },
];

/** Pixels from viewport bottom so minimized title bars sit above the launcher ribbon + disclaimer band. */
const MINIMIZED_DOCK_GAP = 132;

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

  const skipBoot = isOnboardingComplete();

  runBootOverlay(
    root,
    () => {
      root.replaceChildren();
      const { shell, byId } = buildDesktop();
      root.appendChild(shell);
      attachDesktopChrome(root);
      attachCommandPalette(root, {
        focusWindow(id) {
          revealWindow(byId, shell, id);
        },
      });
    },
    { skip: skipBoot },
  );
}

/**
 * @param {HTMLElement} root
 * @param {() => void} onRevealDesktop
 * @param {{ skip?: boolean }} options
 */
function runBootOverlay(root, onRevealDesktop, options = {}) {
  if (options.skip) {
    onRevealDesktop();
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "boot-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "System boot sequence");

  const log = document.createElement("pre");
  log.className = "boot-log";
  log.setAttribute("aria-live", "polite");

  overlay.appendChild(log);
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

/** @typedef {{ startClosed?: boolean; onboardingOnDone?: () => void }} CreateWindowOpts */

/**
 * @param {HTMLElement} shell
 */
function captureWindowGeometry(shell, windowEl) {
  const shellRect = shell.getBoundingClientRect();
  const r = windowEl.getBoundingClientRect();
  windowEl.dataset.restoreLeftPx = String(Math.round(r.left - shellRect.left + shell.scrollLeft));
  windowEl.dataset.restoreTopPx = String(Math.round(r.top - shellRect.top + shell.scrollTop));
  windowEl.dataset.restoreOuterWidthPx = String(Math.round(windowEl.offsetWidth));
}

/**
 * Apply saved geometry from before minimize / layout reset.
 *
 * @param {HTMLElement} windowEl
 */
function applyRestoredGeometry(windowEl) {
  const left = windowEl.dataset.restoreLeftPx;
  const top = windowEl.dataset.restoreTopPx;
  if (left != null && left !== "" && top != null && top !== "") {
    windowEl.style.left = `${left}px`;
    windowEl.style.top = `${top}px`;
  }
}

/**
 * @param {HTMLElement} shell
 */
function tileMinimizedWindows(shell) {
  const row = [...shell.querySelectorAll(".desktop-window.desktop-window--minimized")];
  const gap = 10;
  const chipWidth = Math.min(200, Math.max(160, (shell.clientWidth - 24 - (row.length - 1) * gap) / Math.max(row.length, 1)));
  let left = 12;
  row.forEach((win) => {
    win.style.width = `${Math.round(chipWidth)}px`;
    win.style.bottom = `${MINIMIZED_DOCK_GAP}px`;
    win.style.top = "auto";
    win.style.left = `${left}px`;
    win.style.transform = "none";
    win.style.right = "auto";
    left += chipWidth + gap;
  });
}

/**
 * @param {HTMLElement} windowEl
 * @param {HTMLElement} shell
 */
function minimizeWindow(windowEl, shell) {
  captureWindowGeometry(shell, windowEl);
  windowEl.classList.remove("desktop-window--closed");
  windowEl.classList.add("desktop-window--minimized");
  tileMinimizedWindows(shell);
  bringToFront(windowEl);
}

/**
 * @param {HTMLElement} windowEl
 * @param {HTMLElement} shell
 */
function restoreMinimized(windowEl, shell) {
  if (!windowEl.classList.contains("desktop-window--minimized")) {
    return;
  }
  windowEl.classList.remove("desktop-window--minimized");
  const restoredW = windowEl.dataset.restoreOuterWidthPx;
  windowEl.style.width = restoredW ? `${restoredW}px` : "";
  applyRestoredGeometry(windowEl);
  tileMinimizedWindows(shell);
}

/**
 * Close hides the window (same for apps and onboarding dismissed with × until Finish clears storage).
 *
 * @param {HTMLElement} windowEl
 * @param {HTMLElement} shell
 */
function closeWindow(windowEl, shell) {
  windowEl.classList.remove("desktop-window--minimized");
  windowEl.style.width = "";
  windowEl.style.bottom = "";
  windowEl.dataset.restoreLeftPx = "";
  windowEl.dataset.restoreTopPx = "";
  delete windowEl.dataset.restoreOuterWidthPx;
  windowEl.style.left = "";
  windowEl.style.top = "";
  windowEl.style.right = "";
  windowEl.style.transform = "";

  windowEl.classList.add("desktop-window--closed");

  tileMinimizedWindows(shell);
}

/**
 * @param {typeof WINDOWS[number] | typeof ONBOARDING_DEF} def
 * @param {CreateWindowOpts} opts
 * @param {HTMLElement} shell
 */
function createWindow(def, opts, shell) {
  const startClosed = opts.startClosed ?? false;

  const el = document.createElement("section");
  el.className = `desktop-window ${def.className}`;
  if (startClosed) {
    el.classList.add("desktop-window--closed");
  }
  el.dataset.windowId = def.id;
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", def.title);

  const head = document.createElement("header");
  head.className = "desktop-window__head";

  const dragHandle = document.createElement("div");
  dragHandle.className = "desktop-window__drag-handle";

  const title = document.createElement("span");
  title.className = "desktop-window__title";
  title.textContent = def.title;
  dragHandle.appendChild(title);

  const controls = document.createElement("div");
  controls.className = "desktop-window__controls";

  const btnMin = document.createElement("button");
  btnMin.type = "button";
  btnMin.className = "desktop-window__btn desktop-window__btn--minimize";
  btnMin.title = "Minimize";
  btnMin.setAttribute("aria-label", "Minimize window");
  btnMin.textContent = "−";

  const btnClose = document.createElement("button");
  btnClose.type = "button";
  btnClose.className = "desktop-window__btn desktop-window__btn--close";
  btnClose.title = "Close";
  btnClose.setAttribute("aria-label", "Close window");
  btnClose.textContent = "×";

  controls.append(btnMin, btnClose);
  head.append(dragHandle, controls);

  const body = document.createElement("div");
  body.className = "desktop-window__body";

  if (def.id === "lifecycle") {
    mountLifecycleSimulator(body);
  } else if (def.id === "invariant") {
    mountInvariantMonitor(body);
  } else if (def.id === "explorer") {
    mountChainExplorer(body);
  } else if (def.id === "failure") {
    mountFailureModes(body);
  } else if (def.id === "architecture") {
    mountArchitectureWindow(body);
  } else if (def.id === "onboarding") {
    mountOnboardingWizard(body, {
      onDone: () => {
        opts.onboardingOnDone?.();
      },
    });
  } else {
    const p = document.createElement("p");
    p.className = "desktop-window__placeholder";
    p.textContent = def.body;
    body.appendChild(p);
  }

  el.appendChild(head);
  el.appendChild(body);

  btnMin.addEventListener("mousedown", (e) => e.stopPropagation());
  btnClose.addEventListener("mousedown", (e) => e.stopPropagation());

  btnMin.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    minimizeWindow(el, shell);
  });

  btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeWindow(el, shell);
  });

  attachDrag(el, dragHandle, shell);
  if (!startClosed) {
    bringToFront(el);
  }

  return el;
}

/**
 * @param {Map<string, HTMLElement>} byId
 * @param {HTMLElement} shell
 * @param {string} id
 */
function revealWindow(byId, shell, id) {
  const el = byId.get(id);
  if (!el) {
    return;
  }
  el.classList.remove("desktop-window--closed");
  if (el.classList.contains("desktop-window--minimized")) {
    restoreMinimized(el, shell);
  }
  applyRestoredGeometry(el);
  bringToFront(el);
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Quiet entry until the visitor opens the wizard (no onboarding window auto-focus on load).
 *
 * @param {HTMLElement} shell
 * @param {Map<string, HTMLElement>} byId
 */
function attachOnboardingInvite(shell, byId) {
  const invite = document.createElement("button");
  invite.type = "button";
  invite.className = "desktop-onboarding-invite";
  invite.textContent = "Getting started";
  invite.setAttribute("aria-label", "Open Getting started tour");
  invite.title = "Open the BazingaOS tour";

  invite.addEventListener("click", () => {
    revealWindow(byId, shell, "onboarding");
  });

  invite.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealWindow(byId, shell, "onboarding");
    }
  });

  shell.appendChild(invite);
}

function buildDesktop() {
  const shell = document.createElement("div");
  shell.className = "desktop-shell";

  /** @type {Map<string, HTMLElement>} */
  const byId = new Map();

  WINDOWS.forEach((def) => {
    const w = createWindow(def, { startClosed: true }, shell);
    byId.set(def.id, w);
    shell.appendChild(w);
  });

  if (!isOnboardingComplete()) {
    const onboardingEl = createWindow(
      ONBOARDING_DEF,
      {
        startClosed: true,
        onboardingOnDone() {
          shell.querySelector(".desktop-onboarding-invite")?.remove();
          onboardingEl.remove();
          byId.delete("onboarding");
        },
      },
      shell,
    );
    byId.set("onboarding", onboardingEl);
    shell.appendChild(onboardingEl);

    attachOnboardingInvite(shell, byId);
  }

  mountDesktopIcons(shell, {
    revealWindow: (windowId) => revealWindow(byId, shell, windowId),
    programs: LAUNCHERS.map((l) => ({
      id: l.id,
      windowId: l.id,
      label: l.label,
      glyph: l.glyph,
      defaultPct: l.defaultPct,
    })),
  });

  window.addEventListener(
    "resize",
    () => {
      tileMinimizedWindows(shell);
    },
    { passive: true },
  );

  return { shell, byId };
}

function bringToFront(el) {
  zCounter += 1;
  el.style.zIndex = String(zCounter);
}

/**
 * @param {HTMLElement} windowEl
 * @param {HTMLElement} handleEl Drag handle only (title strip), not maximize/minimize/close buttons.
 * @param {HTMLElement} shell
 */
function attachDrag(windowEl, handleEl, shell) {
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
    /** @type {HTMLElement} */
    const t = e.target;
    if (t.closest(".desktop-window__controls")) {
      return;
    }

    if (windowEl.classList.contains("desktop-window--minimized")) {
      e.preventDefault();
      restoreMinimized(windowEl, shell);
      bringToFront(windowEl);
      return;
    }

    revealWindowLike(windowEl);
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

    captureWindowGeometry(shell, windowEl);

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
      captureWindowGeometry(shell, windowEl);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  handleEl.addEventListener("dblclick", (e) => {
    const t = e.target;
    if (t.closest && t.closest(".desktop-window__controls")) {
      return;
    }
    windowEl.classList.remove("desktop-window--closed");
    bringToFront(windowEl);
  });
}

/** Restores visibility for drag / palette flows. */
function revealWindowLike(el) {
  el.classList.remove("desktop-window--closed");
}
