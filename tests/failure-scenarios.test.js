import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FAILURE_SCENARIOS,
  failureScenarioIsValid,
  getFailureScenarioStages,
} from "../js/failure-scenarios.js";

test("failure-scenarios module matches app taxonomy", () => {
  assert.equal(failureScenarioIsValid("duplicate-replay"), true);
  assert.deepEqual(getFailureScenarioStages("duplicate-replay"), [
    "detect",
    "contain",
    "recover",
    "invariant-recheck",
  ]);
  assert.equal(Object.keys(FAILURE_SCENARIOS).length, 3);
});
