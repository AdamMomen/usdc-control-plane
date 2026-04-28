import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getPhasesForMode,
  getUsdcStepIdsOrdered,
  TOKENIZED_PHASES,
  USDC_PHASES,
} from "../js/lifecycle-simulator.js";

test("USDC phases align with app.js lifecycle step ids", () => {
  assert.deepEqual(getUsdcStepIdsOrdered(), [
    "mint",
    "transfer",
    "settlement",
    "finality",
    "reconciliation",
  ]);
});

test("both modes have five phases", () => {
  assert.equal(USDC_PHASES.length, 5);
  assert.equal(TOKENIZED_PHASES.length, 5);
  assert.equal(getPhasesForMode("usdc").length, 5);
  assert.equal(getPhasesForMode("tokenized").length, 5);
});

test("tokenized pipeline ends with invariant verification", () => {
  assert.equal(TOKENIZED_PHASES[TOKENIZED_PHASES.length - 1].id, "invariant");
});
