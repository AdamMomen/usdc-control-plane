/**
 * Hidden memo copy — concise Circle intent + credible technical framing.
 */

/**
 * Populate the memo `.memo-panel` inside `memoOverlay`.
 * @param {HTMLElement} memoOverlay
 * @param {() => void} onClose
 */
export function populateHiddenMemo(memoOverlay, onClose) {
  const panel = memoOverlay.querySelector(".memo-panel");
  if (!panel) {
    return;
  }
  panel.replaceChildren();

  const h = document.createElement("h2");
  h.className = "memo-title";
  h.textContent = "Hidden memo · Circle";

  const p1 = document.createElement("p");
  p1.className = "memo-lead";
  p1.textContent =
    "This control plane is an infrastructure brief: programmable assets, settlement trust, and failure domains—articulated the way platform teams review risk, not retail copy.";

  const p2 = document.createElement("p");
  p2.className = "memo-body-text";
  p2.textContent =
    "If you landed here via the \"why-circle\" explorer command or the palette, the signal is alignment with USDC-centric work: programmable money needs clear finality stories, invariant hygiene, and disciplined recovery paths under stress.";

  const pCta = document.createElement("p");
  pCta.className = "memo-body-text memo-note";
  pCta.textContent =
    "Links: desktop bar — GitHub profile, résumé (Google Docs), X @0xmomen, mail with subject prefilled. Artifact UI only—no ledger access.";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "memo-close";
  btn.textContent = "Close";

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    onClose();
  });

  panel.appendChild(h);
  panel.appendChild(p1);
  panel.appendChild(p2);
  panel.appendChild(pCta);
  panel.appendChild(btn);
}
