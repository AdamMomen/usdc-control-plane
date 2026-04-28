/**
 * Phase 4 — lifecycle simulator UI embedded in Asset Lifecycle window.
 */

import { getPhasesForMode } from "./lifecycle-simulator.js";

const STEP_DELAY_MS = 480;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {HTMLElement} container desktop-window__body for lifecycle window only
 */
export function mountLifecycleSimulator(container) {
  container.classList.add("lifecycle-sim-host");
  container.replaceChildren();

  const root = document.createElement("div");
  root.className = "lifecycle-sim";

  const modeRow = document.createElement("div");
  modeRow.className = "lifecycle-mode";
  modeRow.setAttribute("role", "group");
  modeRow.setAttribute("aria-label", "Simulation mode");

  const usdcId = "lifecycle-mode-usdc";
  const tokId = "lifecycle-mode-tokenized";

  modeRow.innerHTML = `
    <label class="lifecycle-mode-label">
      <input type="radio" name="lifecycle-mode" id="${usdcId}" value="usdc" checked />
      <span>USDC transfer</span>
    </label>
    <label class="lifecycle-mode-label">
      <input type="radio" name="lifecycle-mode" id="${tokId}" value="tokenized" />
      <span>Tokenized asset</span>
    </label>
  `;

  const stepsEl = document.createElement("ol");
  stepsEl.className = "lifecycle-steps";
  stepsEl.setAttribute("aria-label", "Pipeline stages");

  const actions = document.createElement("div");
  actions.className = "lifecycle-actions";

  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.className = "lifecycle-btn lifecycle-btn--primary";
  runBtn.textContent = "Run simulation";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "lifecycle-btn";
  resetBtn.textContent = "Reset";

  actions.appendChild(runBtn);
  actions.appendChild(resetBtn);

  const log = document.createElement("div");
  log.className = "lifecycle-log";
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-label", "Simulation log");

  const foot = document.createElement("p");
  foot.className = "lifecycle-ocp-note";
  foot.textContent =
    "Modeling approach informed by OCP-style separation of concerns (simulation).";

  root.appendChild(modeRow);
  root.appendChild(stepsEl);
  root.appendChild(actions);
  root.appendChild(log);
  root.appendChild(foot);
  container.appendChild(root);

  let mode = /** @type {"usdc" | "tokenized"} */ ("usdc");
  let running = false;

  const usdcRadio = modeRow.querySelector(`#${usdcId}`);
  const tokRadio = modeRow.querySelector(`#${tokId}`);

  function currentMode() {
    return /** @type {"usdc" | "tokenized"} */ (usdcRadio?.checked ? "usdc" : "tokenized");
  }

  function renderSteps() {
    mode = currentMode();
    const phases = getPhasesForMode(mode);
    stepsEl.replaceChildren();
    phases.forEach((ph, i) => {
      const li = document.createElement("li");
      li.className = "lifecycle-step";
      li.dataset.phaseId = ph.id;
      li.dataset.index = String(i);
      const mark = document.createElement("span");
      mark.className = "lifecycle-step-mark";
      mark.textContent = String(i + 1);
      const text = document.createElement("span");
      text.className = "lifecycle-step-text";
      text.textContent = ph.label;
      li.appendChild(mark);
      li.appendChild(text);
      stepsEl.appendChild(li);
    });
    log.replaceChildren();
    updateStepClasses(-1, false);
  }

  /**
   * @param {number} activeIndex -1 none
   * @param {boolean} doneAll
   */
  function updateStepClasses(activeIndex, doneAll) {
    const items = stepsEl.querySelectorAll(".lifecycle-step");
    const phases = getPhasesForMode(mode);
    items.forEach((li, i) => {
      li.classList.remove("lifecycle-step--pending", "lifecycle-step--active", "lifecycle-step--done");
      if (doneAll || i < activeIndex) {
        li.classList.add("lifecycle-step--done");
      } else if (i === activeIndex) {
        li.classList.add("lifecycle-step--active");
      } else {
        li.classList.add("lifecycle-step--pending");
      }
    });
    if (doneAll) {
      appendLogLine(`— run complete (${phases.length} stages) —`, "lifecycle-log-line--meta");
    }
  }

  function appendLogLine(text, extraClass) {
    const line = document.createElement("div");
    line.className = "lifecycle-log-line" + (extraClass ? ` ${extraClass}` : "");
    const ts = new Date().toISOString().split("T")[1].replace("Z", "");
    line.textContent = `[${ts}] ${text}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  function setRunning(isRun) {
    running = isRun;
    runBtn.disabled = isRun;
    resetBtn.disabled = isRun;
    if (usdcRadio) {
      usdcRadio.disabled = isRun;
    }
    if (tokRadio) {
      tokRadio.disabled = isRun;
    }
  }

  async function runSimulation() {
    if (running) {
      return;
    }
    mode = currentMode();
    const phases = getPhasesForMode(mode);
    log.replaceChildren();
    setRunning(true);
    window.dispatchEvent(
      new CustomEvent("lifecycle-sim-begin", {
        bubbles: true,
        detail: { mode },
      }),
    );
    appendLogLine(`mode=${mode} batch=sim_${Math.random().toString(36).slice(2, 9)}`, "lifecycle-log-line--meta");

    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i];
      updateStepClasses(i, false);
      appendLogLine(`${ph.logTag} :: ${ph.label}`, "");

      window.dispatchEvent(
        new CustomEvent("lifecycle-sim-step", {
          bubbles: true,
          detail: {
            mode,
            phaseId: ph.id,
            index: i,
            label: ph.label,
            isLast: i === phases.length - 1,
          },
        }),
      );

      await sleep(STEP_DELAY_MS);
    }

    updateStepClasses(phases.length, true);
    setRunning(false);
  }

  function resetView() {
    window.dispatchEvent(new CustomEvent("lifecycle-sim-reset", { bubbles: true }));
    renderSteps();
  }

  runBtn.addEventListener("click", () => {
    runSimulation().catch(() => {
      setRunning(false);
    });
  });

  resetBtn.addEventListener("click", () => {
    if (running) {
      return;
    }
    resetView();
  });

  usdcRadio?.addEventListener("change", () => {
    if (!running) {
      renderSteps();
    }
  });
  tokRadio?.addEventListener("change", () => {
    if (!running) {
      renderSteps();
    }
  });

  renderSteps();
}
