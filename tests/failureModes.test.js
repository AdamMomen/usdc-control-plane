import { test } from "node:test";
import assert from "node:assert/strict";
import {
  failureScenarioIsValid,
  getFailureScenarioStages,
  FAILURE_SCENARIOS,
} from "../app.js";

test("duplicate replay scenario is valid and has recovery path", () => {
  assert.equal(failureScenarioIsValid("duplicate-replay"), true);
  const stages = getFailureScenarioStages("duplicate-replay");
  assert.ok(stages.includes("contain"));
  assert.ok(stages.includes("recover"));
});

test("finality disturbance scenario valid", () => {
  assert.equal(failureScenarioIsValid("finality-disturbance"), true);
  const stages = getFailureScenarioStages("finality-disturbance");
  assert.ok(stages.includes("revalidate"));
});

test("reconciliation drift repair scenario valid", () => {
  assert.equal(failureScenarioIsValid("reconciliation-drift"), true);
  const stages = getFailureScenarioStages("reconciliation-drift");
  assert.ok(stages.includes("repair"));
});

test("documented scenarios are non-empty", () => {
  for (const id of Object.keys(FAILURE_SCENARIOS)) {
    assert.ok(getFailureScenarioStages(id).length > 0, id);
  }
});
