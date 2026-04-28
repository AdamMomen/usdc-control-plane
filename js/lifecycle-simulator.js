/**
 * Hybrid asset lifecycle — pure definitions (testable).
 * Simulation only; matches PRD §7.2.
 */

/** @typedef {'usdc' | 'tokenized'} SimMode */

/** @typedef {{ id: string; label: string; logTag: string }} LifecyclePhase */

/** USDC Mode A — phase ids align with `LIFECYCLE_STEPS` in app.js. */
export const USDC_PHASES = /** @type {LifecyclePhase[]} */ ([
  { id: "mint", label: "Mint", logTag: "MINT_GATE" },
  { id: "transfer", label: "Transfer request", logTag: "TRANSFER_PENDING" },
  { id: "settlement", label: "Settlement", logTag: "SETTLE_BATCH" },
  { id: "finality", label: "Finality", logTag: "FINALITY_DEPTH_32" },
  { id: "reconciliation", label: "Reconciliation", logTag: "LEDGER_RECON_OK" },
]);

/** Tokenized Mode B */
export const TOKENIZED_PHASES = /** @type {LifecyclePhase[]} */ ([
  { id: "issuance", label: "Asset issuance", logTag: "ISSUANCE_POLICIES" },
  { id: "policy", label: "Policy checks", logTag: "POLICY_PASS" },
  { id: "ownership", label: "Ownership state transition", logTag: "OWNERSHIP_LEDGER" },
  { id: "settlementFinality", label: "Settlement finality", logTag: "SETTLE_FINAL" },
  { id: "invariant", label: "Invariant verification", logTag: "INVARIANT_OK" },
]);

/**
 * @param {SimMode} mode
 * @returns {LifecyclePhase[]}
 */
export function getPhasesForMode(mode) {
  return mode === "usdc" ? USDC_PHASES : TOKENIZED_PHASES;
}

/**
 * Ordered ids for completed USDC runs (for invariant assertions).
 * @returns {string[]}
 */
export function getUsdcStepIdsOrdered() {
  return USDC_PHASES.map((p) => p.id);
}
