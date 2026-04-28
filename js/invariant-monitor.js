/**
 * Trust invariant hero rows — simulation-only derivation from lifecycle progress.
 * PRD §7.3 wording; rows light as simulated pipeline progresses.
 */

/** @typedef {{ id: string; label: string; value: string; tone: "standby" | "pass" | "valid" }} InvariantDisplayRow */

export const INVARIANT_DEFS = [
  { id: "supply", label: "Supply Integrity" },
  { id: "transition", label: "State Transition Valid" },
  { id: "replay", label: "Replay Safety" },
  { id: "finality", label: "Settlement Finality" },
  { id: "ledger", label: "Ledger Consistency" },
];

/** Threshold: row i turns green once this lifecycle step index (0–4) has completed. */
const ROW_MIN_COMPLETED_IDX = /** @type {const} */ ([0, 1, 2, 3, 4]);

/**
 * Maps completed lifecycle step index to invariant row display.
 * @param {"usdc" | "tokenized"} _mode Reserved for asymmetric rules later (both use same five-phase order).
 * @param {number} completedStepIndex Highest completed lifecycle step (-1 idle / reset).
 * @returns {InvariantDisplayRow[]}
 */
export function deriveInvariantRows(_mode, completedStepIndex) {
  return INVARIANT_DEFS.map((def, i) => {
    const minDone = ROW_MIN_COMPLETED_IDX[i];
    if (completedStepIndex < 0 || completedStepIndex < minDone) {
      return {
        ...def,
        value: "—",
        tone: /** @type {const} */ ("standby"),
      };
    }
    if (def.id === "finality") {
      return {
        ...def,
        value: "VALID",
        tone: /** @type {const} */ ("valid"),
      };
    }
    return {
      ...def,
      value: "PASS",
      tone: /** @type {const} */ ("pass"),
    };
  });
}
