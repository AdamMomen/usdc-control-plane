/** Phase 8 — Desktop top chrome. GitHub + Résumé live as draggable desktop file icons. */

import { X_URL } from "./content-config.js";

/**
 * Prepends persistent nav above simulator desktop.
 * @param {HTMLElement} root `#app-root` after boot
 */
export function attachDesktopChrome(root) {
  if (root.querySelector(".desktop-chrome")) {
    return;
  }

  const nav = document.createElement("nav");
  nav.className = "desktop-chrome";
  nav.setAttribute("aria-label", "BazingaOS actions");

  const brand = document.createElement("div");
  brand.className = "desktop-chrome-brand";
  brand.innerHTML =
    `<span class="desktop-chrome-title">BazingaOS</span>` +
    `<span class="desktop-chrome-tagline">USDC Control Plane</span>`;

  const links = document.createElement("div");
  links.className = "desktop-chrome-links";

  const xh = document.createElement("a");
  xh.href = X_URL;
  xh.rel = "noreferrer noopener";
  xh.target = "_blank";
  xh.className = "desktop-chrome-link";
  xh.setAttribute("title", "@0xmomen on X");
  xh.textContent = "X";

  links.appendChild(xh);

  nav.appendChild(brand);
  nav.appendChild(links);
  root.prepend(nav);

  const shell = root.querySelector(".desktop-shell");
  if (shell) {
    shell.classList.add("desktop-shell--chromed");
  }
}
