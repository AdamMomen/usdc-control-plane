import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand } from "../app.js";

test("help is recognized", () => {
  const r = parseCommand("help");
  assert.equal(r.ok, true);
  assert.equal(r.command, "help");
  assert.deepEqual(r.args, []);
});

test("help with topic parses args", () => {
  const r = parseCommand("help simulate-reorg");
  assert.equal(r.ok, true);
  assert.deepEqual(r.args, ["simulate-reorg"]);
});

test("why-circle is recognized", () => {
  const r = parseCommand("why-circle");
  assert.equal(r.ok, true);
  assert.equal(r.command, "why-circle");
  assert.deepEqual(r.args, []);
});

test("inspect-finality with tx id", () => {
  const r = parseCommand("inspect-finality tx_4412");
  assert.equal(r.ok, true);
  assert.equal(r.command, "inspect-finality");
  assert.deepEqual(r.args, ["tx_4412"]);
});

test("unknown command returns structured error", () => {
  const r = parseCommand("totally-unknown");
  assert.equal(r.ok, false);
  assert.ok("error" in r);
  assert.match(r.error, /unknown command/i);
});

test("case-insensitive command token", () => {
  const r = parseCommand("WHY-CIRCLE");
  assert.equal(r.ok, true);
  assert.equal(r.command, "why-circle");
});
