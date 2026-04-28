/** In-app Architecture window — abbreviated system view. */

/**
 * @param {HTMLElement} container `.desktop-window__body`
 */
export function mountArchitectureWindow(container) {
  container.classList.add("architecture-window-root");

  const intro = document.createElement("p");
  intro.className = "architecture-window-lede";
  intro.textContent =
    "Simulation-only SPA: programmable-asset posture, trust invariants, and failure drills — entirely in the browser. No backend, no DB, no live chain RPC.";

  const sectionLabel = document.createElement("div");
  sectionLabel.className = "architecture-window-label";
  sectionLabel.textContent = "SYSTEM CONTEXT";

  const flow = document.createElement("div");
  flow.className = "architecture-flow";
  flow.setAttribute("role", "group");
  flow.setAttribute("aria-label", "Reviewer to modules");

  flow.innerHTML =
    `<div class="architecture-flow__lane">` +
    `<span class="architecture-flow__node architecture-flow__node--review">Reviewer</span>` +
    `<span class="architecture-flow__arrow" aria-hidden="true">→</span>` +
    `<span class="architecture-flow__node architecture-flow__node--spa">USDC Control Plane</span>` +
    `</div>` +
    `<div class="architecture-flow__tiles">` +
    `<span class="architecture-tile">Lifecycle</span>` +
    `<span class="architecture-tile">Invariant</span>` +
    `<span class="architecture-tile">Explorer</span>` +
    `<span class="architecture-tile">Failure</span>` +
    `</div>`;

  container.append(intro, sectionLabel, flow);
}
