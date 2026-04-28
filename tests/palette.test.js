import { test } from "node:test";
import assert from "node:assert/strict";
import { filterPaletteEntries, PALETTE_ENTRIES } from "../js/command-palette.js";

test("filterPaletteEntries empty query returns all", () => {
  const out = filterPaletteEntries("", PALETTE_ENTRIES);
  assert.equal(out.length, PALETTE_ENTRIES.length);
});

test("filterPaletteEntries narrows by label", () => {
  const out = filterPaletteEntries("invariant", PALETTE_ENTRIES);
  assert.ok(out.every((e) => e.label.toLowerCase().includes("invariant") || /invariant/i.test(e.hint ?? "")));
  assert.ok(out.length >= 1);
});
