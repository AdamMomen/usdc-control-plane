/** Phase 5 — Trust Invariant Monitor (hero panel in Invariant window). */

import { deriveInvariantRows, INVARIANT_DEFS } from "./invariant-monitor.js";

/**
 * @param {HTMLElement} container `.desktop-window__body` for invariant window
 */
export function mountInvariantMonitor(container) {
  container.classList.add("invariant-monitor-host");
  container.replaceChildren();

  const wrap = document.createElement("div");
  wrap.className = "invariant-monitor";

  const title = document.createElement("div");
  title.className = "invariant-monitor-hero";
  title.textContent = "Trust invariants";

  const subtitle = document.createElement("p");
  subtitle.className = "invariant-monitor-sub";
  subtitle.textContent =
    "Live against the Asset Lifecycle simulator (simulation — statuses follow staged pipeline progress).";

  const rowsEl = document.createElement("dl");
  rowsEl.className = "invariant-rows";
  rowsEl.setAttribute("aria-label", "Invariant statuses");

  /** @type {Map<string, HTMLElement>} */
  const valueById = new Map();

  INVARIANT_DEFS.forEach((def) => {
    const dt = document.createElement("dt");
    dt.className = "invariant-row-label";
    dt.textContent = def.label;

    const dd = document.createElement("dd");
    dd.className = "invariant-row-value invariant-row-value--standby";
    dd.dataset.invariantId = def.id;
    dd.textContent = "—";

    valueById.set(def.id, dd);
    rowsEl.appendChild(dt);
    rowsEl.appendChild(dd);
  });

  wrap.appendChild(title);
  wrap.appendChild(subtitle);
  wrap.appendChild(rowsEl);
  container.appendChild(wrap);

  let completedIdx = -1;
  let lastMode = /** @type {"usdc" | "tokenized"} */ ("usdc");

  function renderRows() {
    const snapshot = deriveInvariantRows(lastMode, completedIdx);
    for (const row of snapshot) {
      const el = valueById.get(row.id);
      if (!el) {
        continue;
      }
      el.textContent = row.value;
      el.className = "invariant-row-value invariant-row-value--" + row.tone;
    }
  }

  /** @param {Event} e */
  function onStep(e) {
    const d = /** @type {CustomEvent} */ (e).detail;
    if (!d || typeof d.mode !== "string" || typeof d.index !== "number") {
      return;
    }
    lastMode = d.mode === "tokenized" ? "tokenized" : "usdc";
    completedIdx = d.index;
    renderRows();
  }

  function onReset() {
    completedIdx = -1;
    renderRows();
  }

  function onBegin(/** @type {Event} */ e) {
    const d = /** @type {CustomEvent} */ (e).detail;
    lastMode = d?.mode === "tokenized" ? "tokenized" : "usdc";
    completedIdx = -1;
    renderRows();
  }

  window.addEventListener("lifecycle-sim-begin", onBegin);
  window.addEventListener("lifecycle-sim-step", onStep);
  window.addEventListener("lifecycle-sim-reset", onReset);

  renderRows();
}
