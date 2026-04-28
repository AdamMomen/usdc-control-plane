/**
 * Failure domain taxonomy — shared by app.js tests and failure-modes UI.
 */

export const FAILURE_SCENARIOS = {
  "duplicate-replay": ["detect", "contain", "recover", "invariant-recheck"],
  "finality-disturbance": ["disturb", "revalidate", "recover"],
  "reconciliation-drift": ["mismatch", "repair", "invariant-recheck"],
};

/**
 * @param {string} id
 */
export function failureScenarioIsValid(id) {
  return Object.prototype.hasOwnProperty.call(FAILURE_SCENARIOS, id);
}

/**
 * @param {string} id
 */
export function getFailureScenarioStages(id) {
  return FAILURE_SCENARIOS[id] ?? [];
}
