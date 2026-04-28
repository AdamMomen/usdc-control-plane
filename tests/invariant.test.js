import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIFECYCLE_STEPS,
  lifecycleInvariantResult,
  replayWouldDuplicate,
  reconciliationCanRecover,
} from "../app.js";

test("successful lifecycle path returns PASS", () => {
  const r = lifecycleInvariantResult([...LIFECYCLE_STEPS]);
  assert.equal(r, "PASS");
});

test("replay protection: duplicate tx id is flagged", () => {
  const seen = new Set(["tx_a", "tx_b"]);
  assert.equal(replayWouldDuplicate("tx_a", seen), true);
  assert.equal(replayWouldDuplicate("tx_new", seen), false);
});

test("reconciliation recovery when ledgers match", () => {
  assert.equal(reconciliationCanRecover("1_000_000", "1_000_000"), true);
  assert.equal(reconciliationCanRecover("1_000_000", "999_999"), false);
});

test("out-of-order lifecycle fails invariant", () => {
  const bad = [...LIFECYCLE_STEPS];
  [bad[1], bad[2]] = [bad[2], bad[1]];
  assert.equal(lifecycleInvariantResult(bad), "FAIL");
});
