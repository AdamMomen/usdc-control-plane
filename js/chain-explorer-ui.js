/** Phase 6 — Chain State Explorer terminal. */

import { explorerRun } from "./explorer-commands.js";

export function mountChainExplorer(container) {
  container.classList.add("chain-explorer-host");
  container.replaceChildren();

  const wrap = document.createElement("div");
  wrap.className = "chain-explorer";

  const note = document.createElement("p");
  note.className = "chain-explorer-note";
  note.textContent = "Simulation only — deterministic fixtures; no RPC or indexer.";

  const scroll = document.createElement("div");
  scroll.className = "chain-explorer-scroll";
  scroll.setAttribute("aria-label", "Command output");
  scroll.setAttribute("tabindex", "0");

  const form = document.createElement("form");
  form.className = "chain-explorer-form";

  const label = document.createElement("label");
  label.className = "chain-explorer-prompt";
  label.innerHTML =
    `<span aria-hidden="true" class="chain-explorer-chevron">&gt;</span>` +
    `<input type="text" class="chain-explorer-input" spellcheck="false" autocomplete="off" aria-label="Explorer command"/>`;

  const input = /** @type {HTMLInputElement} */ (label.querySelector(".chain-explorer-input"));
  form.appendChild(label);

  wrap.appendChild(note);
  wrap.appendChild(scroll);
  wrap.appendChild(form);
  container.appendChild(wrap);

  function println(text, cssClass = "") {
    const line = document.createElement("div");
    line.className = "chain-explorer-line " + cssClass.trim();
    line.textContent = text;
    scroll.appendChild(line);
    scroll.scrollTop = scroll.scrollHeight;
  }

  function printlnBlock(lines, cssClass = "") {
    for (const s of lines) {
      println(s, cssClass);
    }
  }

  println(
    "type a command · e.g. inspect-finality tx_4412 · why-circle · Enter to submit",
    "chain-explorer-line--meta",
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value ?? "";
    const trimmed = raw.trim();
    println(`> ${raw}`, "chain-explorer-line--cmd");
    input.value = "";

    const out = explorerRun(trimmed);
    printlnBlock(out.lines, out.ok ? "chain-explorer-line--out" : "chain-explorer-line--err");
    input.focus();
  });

  input.focus();
}
