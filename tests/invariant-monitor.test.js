import { test } from "node:test";
import assert from "node:assert/strict";
import { deriveInvariantRows, INVARIANT_DEFS } from "../js/invariant-monitor.js";

test("five PRD-aligned rows listed", () => {
  assert.equal(INVARIANT_DEFS.length, 5);
  assert.equal(INVARIANT_DEFS[3].id, "finality");
  assert.equal(INVARIANT_DEFS[4].id, "ledger");
});

test("idle state is all standby dashes", () => {
  const rows = deriveInvariantRows("usdc", -1);
  assert.equal(rows.length, 5);
  assert.ok(rows.every((r) => r.value === "—" && r.tone === "standby"));
});

test("after ledger step completed all pass or valid per PRD", () => {
  const rows = deriveInvariantRows("usdc", 4);
  assert.equal(rows.find((r) => r.id === "finality")?.value, "VALID");
  assert.equal(rows.filter((r) => r.id !== "finality").every((r) => r.value === "PASS"), true);
});

test("halfway shows partial rollup", () => {
  const rows = deriveInvariantRows("tokenized", 1);
  assert.equal(rows.find((r) => r.id === "supply")?.tone, "pass");
  assert.equal(rows.find((r) => r.id === "transition")?.tone, "pass");
  assert.equal(rows.find((r) => r.id === "replay")?.tone, "standby");
});
