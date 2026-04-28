/**
 * Extract ```mermaid``` blocks from architecture.md and parse with `mermaid` (npm).
 * Mermaid expects a browser-like global `document` (DOMPurify); happy-dom provides it in Node.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Window } from "happy-dom";

const browser = new Window({ url: "https://localhost/" });
globalThis.window = browser;
globalThis.document = browser.document;
globalThis.self = browser;
Object.defineProperty(globalThis, "navigator", {
  value: browser.navigator,
  configurable: true,
  writable: true,
});

const mermaid = (await import("mermaid")).default;

const __dirname = dirname(fileURLToPath(import.meta.url));
const archPath = join(__dirname, "..", "architecture.md");

await mermaid.initialize({ startOnLoad: false });

const md = readFileSync(archPath, "utf8");
const blocks = [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1].trim());

if (!blocks.length) {
  console.error("validate-mermaid-architecture: no ```mermaid``` blocks found in architecture.md");
  process.exitCode = 1;
  process.exit(1);
}

let failed = 0;
for (let i = 0; i < blocks.length; i++) {
  const text = blocks[i];
  try {
    const result = await mermaid.parse(text);
    const type =
      typeof result === "object" && result !== null && "diagramType" in result
        ? /** @type {{ diagramType: string }} */ (result).diagramType
        : "?";
    console.log(`diagram ${i + 1}/${blocks.length}: OK (${type})`);
  } catch (err) {
    failed += 1;
    console.error(`diagram ${i + 1}/${blocks.length}: PARSE FAILED`);
    console.error(String(/** @type {Error} */ (err)?.message ?? err));
    console.error("--- offending definition ---");
    console.error(text);
    console.error("----------------------------");
  }
}

if (failed) {
  process.exitCode = 1;
  process.exit(1);
}

console.log(`validate-mermaid-architecture: ${blocks.length} diagram(s) OK`);
