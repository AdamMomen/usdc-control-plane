/** In-app Architecture window — abbreviated system view + link to repo `architecture.md`. */

import { ARCHITECTURE_DOC_URL } from "./content-config.js";

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

  const deployLabel = document.createElement("div");
  deployLabel.className = "architecture-window-label architecture-window-label--sub";
  deployLabel.textContent = "DEPLOYMENT";

  const deploy = document.createElement("p");
  deploy.className = "architecture-deploy-strip";
  deploy.textContent = "Repo → Coolify → static HTTPS (HTML / CSS / JS only).";

  const footer = document.createElement("p");
  footer.className = "architecture-window-footer";

  const docLink = document.createElement("a");
  docLink.className = "architecture-doc-link";
  docLink.href = ARCHITECTURE_DOC_URL;
  docLink.rel = "noreferrer noopener";
  docLink.target = "_blank";
  docLink.textContent = "architecture.md";

  footer.append(document.createTextNode("Deep diagrams & narrative → "), docLink);

  container.append(intro, sectionLabel, flow, deployLabel, deploy, footer);
}
