import { test } from "node:test";
import assert from "node:assert/strict";
import { explorerRun, explorerSimulatedLines } from "../js/explorer-commands.js";

test("unknown command yields error lines", () => {
  const r = explorerRun("bogus");
  assert.equal(r.ok, false);
  assert.ok(r.lines[0]?.includes("error"));
});

test("empty line errors", () => {
  const r = explorerRun("   ");
  assert.equal(r.ok, false);
});

test("inspect-finality echoes target", () => {
  const lines = explorerSimulatedLines("inspect-finality", ["tx_xyz"]);
  assert.ok(lines.some((l) => l.includes("tx_xyz")));
});

test("why-circle returns positioning copy", () => {
  const r = explorerRun("why-circle");
  assert.equal(r.ok, true);
  assert.ok(r.lines.join(" ").includes("intent"));
});

test("help lists commands", () => {
  const r = explorerRun("help");
  assert.equal(r.ok, true);
  assert.ok(r.lines.join("\n").includes("inspect-finality"));
  assert.ok(r.lines.join("\n").includes("simulate-reorg"));
});

test("help with topic expands", () => {
  const r = explorerRun("help inspect-finality");
  assert.equal(r.ok, true);
  assert.ok(r.lines.some((l) => /finality/i.test(l)));
});

test("help unknown topic", () => {
  const r = explorerRun("help not-a-real-cmd-topic");
  assert.equal(r.ok, true);
  assert.ok(r.lines.join(" ").includes("unknown topic"));
});

test("simulate-reorg returns containment language", () => {
  const r = explorerRun("simulate-reorg");
  assert.equal(r.ok, true);
  assert.ok(
    r.lines.some((l) => /equivocation|recovery|bounded|policy_anchor/i.test(l)),
    r.lines.join("|"),
  );
});
