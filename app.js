/**
 * USDC Control Plane — core logic (testable) and browser bootstrap.
 * Simulation only; no network or chain access.
 */

export { parseCommand } from "./js/parse-command.js";

/** Expected USDC transfer path for invariant checks */
export const LIFECYCLE_STEPS = ["mint", "transfer", "settlement", "finality", "reconciliation"];

/**
 * After a simulation run, PASS only if every stage completed in order (simulated checklist).
 * @param {string[]} completedInOrder
 */
export function lifecycleInvariantResult(completedInOrder) {
  if (completedInOrder.length !== LIFECYCLE_STEPS.length) {
    return "FAIL";
  }
  for (let i = 0; i < LIFECYCLE_STEPS.length; i++) {
    if (completedInOrder[i] !== LIFECYCLE_STEPS[i]) {
      return "FAIL";
    }
  }
  return "PASS";
}

/**
 * @param {string} txId
 * @param {Set<string>} committedTxIds
 */
export function replayWouldDuplicate(txId, committedTxIds) {
  return committedTxIds.has(txId);
}

/**
 * @param {string} ledgerA
 * @param {string} ledgerB
 */
export function reconciliationCanRecover(ledgerA, ledgerB) {
  return ledgerA === ledgerB;
}

export {
  FAILURE_SCENARIOS,
  failureScenarioIsValid,
  getFailureScenarioStages,
} from "./js/failure-scenarios.js";

if (typeof document !== "undefined") {
  const start = () => {
    import("./js/desktop-shell.js").then((m) => m.mount("#app-root"));
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}
