/**
 * CLI parser shared by Chain State Explorer UI and tests (via app.js re-export).
 */

const KNOWN_COMMANDS = new Set([
  "inspect-finality",
  "verify-invariant",
  "trace-transfer",
  "simulate-reorg",
  "why-circle",
]);

/**
 * @param {string} line
 * @returns {{ ok: true, command: string, args: string[] } | { ok: false, error: string, hint?: string }}
 */
export function parseCommand(line) {
  const trimmed = typeof line === "string" ? line.trim() : "";
  if (!trimmed) {
    return { ok: false, error: "empty input" };
  }
  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  if (!KNOWN_COMMANDS.has(command)) {
    return {
      ok: false,
      error: `unknown command: ${command}`,
      hint: "try: inspect-finality | why-circle | verify-invariant | trace-transfer | simulate-reorg",
    };
  }
  return { ok: true, command, args };
}
