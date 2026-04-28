/** Phase 7 — Failure Modes window: three drills + PRD summary strip. */

import { getFailureScenarioStages } from "./failure-scenarios.js";

const SCENARIO_ORDER = /** @type {const} */ ([
  "duplicate-replay",
  "finality-disturbance",
  "reconciliation-drift",
]);

const SCENARIO_TITLE = {
  "duplicate-replay": "Duplicate replay",
  "finality-disturbance": "Finality disturbance",
  "reconciliation-drift": "Reconciliation drift",
};

const SCENARIO_BLURB = {
  "duplicate-replay": "Same intent observed twice — contain blast radius, drain replay window, re-check invariants.",
  "finality-disturbance": "Equivocal depth — re-anchor policy, revalidate effective finality, recover head.",
  "reconciliation-drift": "Mirror vs anchor mismatch — repair path, ledger recheck, invariant gate.",
};

/** @type {Record<string, Record<string, string>>} */
const STAGE_LINE = {
  "duplicate-replay": {
    detect: "idem_key collision flagged on settlement queue head",
    contain: "blast radius bounded to batch; shadow drain engaged",
    recover: "replay window drained — idempotency fence holds",
    "invariant-recheck": "aggregate invariants RECHECK — PASS (simulated)",
  },
  "finality-disturbance": {
    disturb: "depth marker oscillates within tolerance band",
    revalidate: "policy_anchor v3 cross-check — effective finality",
    recover: "head advanced; certainty counter reset",
  },
  "reconciliation-drift": {
    mismatch: "custodial mirror diverges from settlement anchor",
    repair: "repair ledger batch applied; drift delta zeroed",
    "invariant-recheck": "reconciliation proof + invariant gate closed",
  },
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {string} scenarioId
 * @param {string} stageId
 */
function stageLine(scenarioId, stageId) {
  return STAGE_LINE[scenarioId]?.[stageId] ?? `${stageId} (fixture)`;
}

export function mountFailureModes(container) {
  container.classList.add("failure-modes-host");
  container.replaceChildren();

  const root = document.createElement("div");
  root.className = "failure-modes";

  const intro = document.createElement("p");
  intro.className = "failure-modes-intro";
  intro.textContent =
    "Three failure-domain drills. Each run is deterministic simulation only — no chain or RPC.";

  root.appendChild(intro);

  /** @type {HTMLButtonElement[]} */
  const buttons = [];

  for (const id of SCENARIO_ORDER) {
    const card = document.createElement("section");
    card.className = "failure-scenario-card";
    card.dataset.scenarioId = id;

    const h = document.createElement("h3");
    h.className = "failure-scenario-heading";
    h.textContent = SCENARIO_TITLE[id] ?? id;

    const blurb = document.createElement("p");
    blurb.className = "failure-scenario-blurb";
    blurb.textContent = SCENARIO_BLURB[id] ?? "";

    const stagesWrap = document.createElement("ol");
    stagesWrap.className = "failure-stage-list";

    const stageIds = getFailureScenarioStages(id);
    stageIds.forEach((stageId, idx) => {
      const li = document.createElement("li");
      li.className = "failure-stage";
      li.dataset.stageIndex = String(idx);

      const mark = document.createElement("span");
      mark.className = "failure-stage-idx";
      mark.textContent = String(idx + 1);

      const text = document.createElement("span");
      text.className = "failure-stage-text";
      text.textContent = stageLine(id, stageId);

      li.appendChild(mark);
      li.appendChild(text);
      stagesWrap.appendChild(li);
    });

    const run = document.createElement("button");
    run.type = "button";
    run.className = "failure-run-btn";
    run.textContent = "Run scenario";
    run.dataset.scenarioRun = id;
    buttons.push(run);

    card.appendChild(h);
    card.appendChild(blurb);
    card.appendChild(stagesWrap);
    card.appendChild(run);
    root.appendChild(card);

    run.addEventListener("click", () => {
      runDrill(id).catch(() => {
        unlockAll();
      });
    });
  }

  const footer = document.createElement("footer");
  footer.className = "failure-prd-summary";
  footer.hidden = true;
  footer.innerHTML = `
    <dl class="failure-summary-dl">
      <dt class="failure-summary-dt">Failure Domain</dt>
      <dd class="failure-summary-val">CONTAINED</dd>
      <dt class="failure-summary-dt">Invariant Breach</dt>
      <dd class="failure-summary-val">NONE</dd>
      <dt class="failure-summary-dt">Recovery Path</dt>
      <dd class="failure-summary-val failure-summary-val--accent">VERIFIED</dd>
    </dl>
  `;

  root.appendChild(footer);
  container.appendChild(root);

  let drillRunning = /** @type {string | null} */ (null);

  function setButtonsLocked(locked) {
    buttons.forEach((b) => {
      b.disabled = locked;
    });
  }

  function unlockAll() {
    setButtonsLocked(false);
    drillRunning = null;
  }

  /**
   * @param {string} id
   */
  async function runDrill(id) {
    if (drillRunning) {
      return;
    }
    drillRunning = id;
    setButtonsLocked(true);
    footer.hidden = true;
    footer.classList.remove("failure-prd-summary--visible");

    const card = root.querySelector(`[data-scenario-id="${id}"]`);
    const items = card?.querySelectorAll(".failure-stage");
    const stageIds = getFailureScenarioStages(id);

    items?.forEach((li) => {
      li.classList.remove(
        "failure-stage--done",
        "failure-stage--active",
        "failure-stage--pending",
      );
      li.classList.add("failure-stage--pending");
    });

    for (let i = 0; i < stageIds.length; i++) {
      const li = items?.[i];
      if (li) {
        li.classList.remove("failure-stage--pending");
        li.classList.add("failure-stage--active");
      }
      await sleep(460);
      if (li) {
        li.classList.remove("failure-stage--active");
        li.classList.add("failure-stage--done");
      }
      window.dispatchEvent(
        new CustomEvent("failure-scenario-stage", {
          bubbles: true,
          detail: { scenarioId: id, stageIndex: i, stageId: stageIds[i] },
        }),
      );
    }

    footer.hidden = false;
    window.requestAnimationFrame(() => footer.classList.add("failure-prd-summary--visible"));
    unlockAll();

    window.dispatchEvent(
      new CustomEvent("failure-scenario-complete", {
        bubbles: true,
        detail: { scenarioId: id },
      }),
    );
  }
}
