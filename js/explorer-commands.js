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
const TOPIC_HELP = /** @type {Record<string, string[]>} */ ({
  help: ["help — list commands · help <name> describes one"],
  "inspect-finality": [
    "inspect-finality [tx_id]",
    "  Simulated finality horizon / depth markers for a settlement target.",
  ],
  "verify-invariant": [
    "verify-invariant [pool_id]",
    "  Simulated rollup of supply / replay / settlement head checks.",
  ],
  "trace-transfer": [
    "trace-transfer [batch_id]",
    "  Simulated path proof across policy engine and mirrored ledger staging.",
  ],
  "simulate-reorg": ["simulate-reorg", "  Injects a controlled equivocation; shows recovery narration (fixture)."],
  "why-circle": ["why-circle", "  Succinct reviewer positioning — ties to programmable assets / settlement."],
});

function linesForHelpTopic(name) {
  const lines = TOPIC_HELP[name];
  if (lines) {
    return [...lines];
  }
  return [`unknown topic: ${name}`, "type: help"];
}

function linesForHelpListing() {
  return [
    "chain state explorer — simulation commands:",
    "",
    "  help [topic]               list commands or describe one",
    "  inspect-finality [tx_id]    finality / depth snapshot (fixture)",
    "  verify-invariant [pool_id]  invariant rollup for a liquidity pool tag",
    "  trace-transfer [batch_id] end-to-end transfer trace",
    "  simulate-reorg              reorg containment + recovery (fixture)",
    "  why-circle                  Circle-fit narrative hook",
    "",
    "synopsis: run: help inspect-finality · help simulate-reorg …",
  ];
}

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {string[]}
 */
export function explorerSimulatedLines(command, args) {
  switch (command) {
    case "help": {
      const topic = /** @type {string | undefined} */ (args[0]);
      if (topic) {
        return linesForHelpTopic(topic.trim().toLowerCase());
      }
      return linesForHelpListing();
    }
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
