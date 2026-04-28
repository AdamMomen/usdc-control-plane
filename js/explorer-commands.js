/**
 * Simulated explorer responses — Phase 6. No chain access.
 */

import { parseCommand } from "./parse-command.js";

/**
 * @param {string[]} args
 */
function arg0(args, fallback) {
  return args[0] ?? fallback;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {string[]}
 */
export function explorerSimulatedLines(command, args) {
  switch (command) {
    case "inspect-finality": {
      const tx = arg0(args, "tx_4412");
      return [
        `target: ${tx}`,
        "observer: settlement_projection_v4 (sim)",
        "finality_horizon_slots: 32",
        "effective_depth_included: FINAL",
        `guard_rail_tx: ${tx} :: locked`,
      ];
    }
    case "verify-invariant": {
      const pool = arg0(args, "pool_default");
      return [
        `subject: ${pool}`,
        "bundle: supply_ledger,replay_counters,settlement_head",
        "rollup_status: PASS (aggregate simulated)",
        "latency_budget_ms: 85 (fixture)",
      ];
    }
    case "trace-transfer": {
      const batch = arg0(args, "usdc_batch9");
      return [
        `batch_id: ${batch}`,
        "path: issuance -> policy_engine -> queued_settlement -> mirror_ledger",
        "commit_proof: checksum_ok",
        "depth_marker: finalized (sim)",
      ];
    }
    case "simulate-reorg": {
      return [
        "injected_equivocation_slots: +1 (fixture)",
        "policy_anchor: revalidated vs v3",
        "recovery_path: depth_recompute + containment",
        "post_state_risk: bounded / roll-forward simulated",
      ];
    }
    case "why-circle": {
      return [
        "signals: programmable assets · settlement resilience · policy clarity",
        "artifact: invariant-first control plane narrative (desktop + memo)",
        "next: open Hidden Memo from the command palette when you want the succinct intent.",
      ];
    }
    default:
      return ["(no simulated output wired)"];
  }
}

/**
 * @param {string} line
 * @returns {{ ok: false; lines: string[] } | { ok: true; lines: string[]; command: string }}
 */
export function explorerRun(line) {
  const p = parseCommand(line);
  if (!p.ok) {
    /** @type {string[]} */
    const lines =
      "hint" in p && p.hint
        ? [`error: ${p.error}`, `hint: ${p.hint}`]
        : [`error: ${p.error}`];
    return { ok: false, lines };
  }
  const lines = explorerSimulatedLines(p.command, p.args);
  return { ok: true, lines, command: p.command };
}
