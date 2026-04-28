/** Phase 8 — Desktop top chrome (external links). */

import { GITHUB_URL, RESUME_URL, X_URL, mailtoHref } from "./content-config.js";

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
  nav.setAttribute("aria-label", "External links");

  const brand = document.createElement("div");
  brand.className = "desktop-chrome-brand";
  brand.innerHTML =
    `<span class="desktop-chrome-title">BackOS</span>` +
    `<span class="desktop-chrome-tagline">USDC Control Plane</span>` +
    `<span class="desktop-chrome-badge">Simulation mode</span>`;

  const links = document.createElement("div");
  links.className = "desktop-chrome-links";

  const gh = document.createElement("a");
  gh.href = GITHUB_URL;
  gh.rel = "noreferrer noopener";
  gh.target = "_blank";
  gh.className = "desktop-chrome-link";
  gh.textContent = "GitHub";

  const cv = document.createElement("a");
  cv.href = RESUME_URL;
  cv.rel = "noreferrer noopener";
  cv.target = "_blank";
  cv.className = "desktop-chrome-link";
  cv.setAttribute("title", "Résumé — Google Docs");
  cv.textContent = "Résumé";

  const xh = document.createElement("a");
  xh.href = X_URL;
  xh.rel = "noreferrer noopener";
  xh.target = "_blank";
  xh.className = "desktop-chrome-link";
  xh.setAttribute("title", "@0xmomen on X");
  xh.textContent = "X";

  const mail = document.createElement("a");
  mail.href = mailtoHref();
  mail.className = "desktop-chrome-link";
  mail.textContent = "Email";

  links.appendChild(gh);
  links.appendChild(cv);
  links.appendChild(xh);
  links.appendChild(mail);

  nav.appendChild(brand);
  nav.appendChild(links);
  root.prepend(nav);

  const shell = root.querySelector(".desktop-shell");
  if (shell) {
    shell.classList.add("desktop-shell--chromed");
  }
}
