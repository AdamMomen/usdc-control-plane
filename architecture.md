# Architecture

**USDC Control Plane** — trust invariants for programmable assets (simulation only).

## Stack

- **Client:** static HTML, CSS, and JavaScript (no framework required for v1).
- **Hosting:** files published to HTTPS (e.g. Coolify static site).
- **Not included:** backend, database, auth, live blockchain RPC, analytics.

---

## System at a glance

What the reviewer loads in the browser and which windows map to which concerns.

```mermaid
flowchart LR
  R[Reviewer] --> SPA[USDC Control Plane SPA]
  SPA --> W1[Asset Lifecycle]
  SPA --> W2[Invariant Monitor]
  SPA --> W3[Chain State Explorer]
  SPA --> W4[Failure Modes]
  SPA --> W5[Architecture]
```

The **command palette** (e.g. Ctrl/⌘+K) and **hidden memo** paths reuse the same shell; they are not separate servers.

---

## Deploy path

```mermaid
flowchart LR
  P[Push to Git] --> Y[Host]
  Y --> U[HTTPS URL]
```

The host syncs or copies the repo root; the browser only fetches static assets.

---

## Trust boundary

All state is **simulated in the browser**. Nothing in this artifact calls a production chain or holds keys.

```mermaid
flowchart TD
  B[Browser] --> S[Simulated control plane]
  S -.-> X1[No live chain]
  S -.-> X2[No wallet or keys]
  S -.-> X3[No user data store]
```

---

## Simulation pipeline (conceptual)

High-level stages the **Lifecycle** window walks through (USDC and tokenized modes differ in labels; same idea).

```mermaid
flowchart LR
  a[Intent] --> b[Policy checks]
  b --> c[State transition]
  c --> d[Settlement]
  d --> e[Finality]
  e --> f[Reconciliation]
  f --> g[Invariant verification]
```

---

## Testing (repo)

Automated checks run with Node’s test runner: command parser, invariant resolver, failure scenarios, and palette filtering. See `package.json` and `tests/`.

---

## Diagrams in this file

Markdown code fences with the **`mermaid`** language tag render on **GitHub** in ordinary `.md` previews (you do **not** need MDX). After editing a diagram, run `pnpm run check` — it runs `scripts/validate-mermaid-architecture.mjs`, which parses each block with the **`mermaid`** package (plus a **happy-dom** shim so Node provides the DOM APIs that Mermaid expects).
