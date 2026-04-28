/** Draggable desktop icons (programs + outbound file tiles). Browser only. */

import { GITHUB_URL, RESUME_URL } from "./content-config.js";

const STORAGE_KEY = "bazingaos.desktopIconLayout.v1";
const LEGACY_STORAGE_KEY = "backos.desktopIconLayout.v1";
const DRAG_THRESHOLD = 6;

function loadIconLayout() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        try {
          localStorage.setItem(STORAGE_KEY, raw);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
          /* ignore quota / blocked storage */
        }
      }
    }
    if (!raw) {
      return /** @type {Record<string, { leftPct: number; topPct: number }>} */ ({});
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** @param {Record<string, { leftPct: number; topPct: number }>} layout */
function saveIconLayout(layout) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    /* ignore */
  }
}

function getPctFromStyle(el) {
  return {
    leftPct: parseFloat(el.style.left) || 0,
    topPct: parseFloat(el.style.top) || 0,
  };
}

function getIconPct(icon, shell) {
  const sr = shell.getBoundingClientRect();
  const ir = icon.getBoundingClientRect();
  const sw = sr.width || 1;
  const sh = sr.height || 1;
  return {
    leftPct: ((ir.left - sr.left) / sw) * 100,
    topPct: ((ir.top - sr.top) / sh) * 100,
  };
}

/**
 * @param {{
 *   el: HTMLElement;
 *   shell: HTMLElement;
 *   id: string;
 *   onActivate: () => void;
 * }} opts
 */
function attachDraggableIcon(opts) {
  const { el, shell, id, onActivate } = opts;

  el.addEventListener("mousedown", (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();

    const sx = e.clientX;
    const sy = e.clientY;
    const pct0 = getIconPct(el, shell);
    let dragged = false;

    /** @param {MouseEvent} ev */
    function onMove(ev) {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!dragged && Math.sqrt(dx * dx + dy * dy) <= DRAG_THRESHOLD) {
        return;
      }

      dragged = true;
      el.style.cursor = "grabbing";

      const sw = shell.clientWidth || 1;
      const sh = shell.clientHeight || 1;

      let nx = pct0.leftPct + (dx / sw) * 100;
      let ny = pct0.topPct + (dy / sh) * 100;
      nx = Math.min(94, Math.max(1, nx));
      ny = Math.min(90, Math.max(1, ny));

      el.style.left = `${nx}%`;
      el.style.top = `${ny}%`;
    }

    /** @param {MouseEvent} ev */
    function onUp(ev) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      el.style.cursor = "";

      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;

      if (dragged) {
        const layout = loadIconLayout();
        const pct = getPctFromStyle(el);
        layout[id] = { leftPct: pct.leftPct, topPct: pct.topPct };
        saveIconLayout(layout);
      } else if (Math.sqrt(dx * dx + dy * dy) <= DRAG_THRESHOLD) {
        onActivate();
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}

/**
 * @typedef {{ id: string; windowId: string; label: string; glyph: string; defaultPct: { left: number; top: number }}} ProgramLauncher
 */

/**
 * @param {HTMLElement} shell
 * @param {{ revealWindow: (id: string) => void; programs: ProgramLauncher[] }} ctx
 */
export function mountDesktopIcons(shell, ctx) {
  const surface = document.createElement("div");
  surface.className = "desktop-icons-surface";
  surface.setAttribute("aria-hidden", "true");

  const layout = loadIconLayout();

  ctx.programs.forEach((def) => {
    const saved = layout[def.id];
    const pct = saved ? { left: saved.leftPct, top: saved.topPct } : def.defaultPct;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "desktop-draggable-icon desktop-draggable-icon--program";
    btn.dataset.desktopIconId = def.id;
    btn.style.left = `${pct.left}%`;
    btn.style.top = `${pct.top}%`;
    btn.setAttribute("aria-label", `Open ${def.label}`);
    btn.title = `Open ${def.label}`;

    const glyph = document.createElement("span");
    glyph.className = "desktop-draggable-icon-tile";
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = def.glyph;

    const label = document.createElement("span");
    label.className = "desktop-draggable-icon-label";
    label.textContent = def.label;

    btn.append(glyph, label);

    attachDraggableIcon({
      el: btn,
      shell,
      id: def.id,
      onActivate: () => ctx.revealWindow(def.windowId),
    });

    btn.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.revealWindow(def.windowId);
        }
      },
      false,
    );

    surface.appendChild(btn);
  });

  const linkDefs = [
    {
      id: "link-github",
      label: "GitHub.md",
      sub: "Opens profile · new tab",
      glyph: "🐙",
      href: GITHUB_URL,
      defaultPct: { left: 78, top: 8 },
      variant: "code",
    },
    {
      id: "link-resume",
      label: "Résumé.pdf",
      sub: "Google Doc (viewer)",
      glyph: "📄",
      href: RESUME_URL,
      defaultPct: { left: 78, top: 22 },
      variant: "doc",
    },
  ];

  linkDefs.forEach((link) => {
    const saved = layout[link.id];
    const pct = saved ? { left: saved.leftPct, top: saved.topPct } : link.defaultPct;

    let host = "";
    try {
      host = new URL(link.href).hostname;
    } catch {
      host = link.href;
    }

    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.className = `desktop-draggable-icon desktop-draggable-icon--file desktop-draggable-icon--${link.variant}`;
    anchor.dataset.desktopIconId = link.id;
    anchor.style.left = `${pct.left}%`;
    anchor.style.top = `${pct.top}%`;
    anchor.dataset.linkHint = `Opens in new tab — ${host}`;

    anchor.setAttribute("aria-label", `${link.label} — opens ${host} in a new tab`);
    anchor.title = `${link.label} (${link.sub}) · ${host} · opens in a new tab`;

    const preview = document.createElement("span");
    preview.className = "desktop-draggable-file-preview";
    const g = document.createElement("span");
    g.className = "desktop-draggable-file-glyph";
    g.setAttribute("aria-hidden", "true");
    g.textContent = link.glyph;

    const sub = document.createElement("span");
    sub.className = "desktop-draggable-file-caption";
    sub.textContent = link.sub;

    preview.append(g, sub);

    const lab = document.createElement("span");
    lab.className = "desktop-draggable-icon-label";
    lab.textContent = link.label;

    anchor.append(preview, lab);

    // Drag layer uses mouseup/onActivate instead of anchor navigation — avoid duplicate tabs.
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
    });

    attachDraggableIcon({
      el: anchor,
      shell,
      id: link.id,
      onActivate() {
        window.open(link.href, "_blank", "noopener,noreferrer");
      },
    });

    anchor.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(link.href, "_blank", "noopener,noreferrer");
        }
      },
      false,
    );

    surface.appendChild(anchor);
  });

  shell.appendChild(surface);
}
