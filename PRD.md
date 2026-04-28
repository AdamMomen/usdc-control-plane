Agreed. Correct sequence:

1. **PRD.md** (lock product)
2. Review/refine
3. **checklist.md** (execution spec + verification gates)
4. Review/refine
5. **architecture.md** (Mermaid systems diagrams)

One document at a time.

## PRD v2 (Revised Draft)

Use this as the new structure.

---

# `PRD.md`

# USDC Control Plane

**Trust Invariants for Programmable Assets**

## 1. Problem / Opportunity

Senior engineering roles receive commodity applications.

A résumé does not adequately demonstrate how a candidate thinks about distributed trust systems, programmable assets, and blockchain infrastructure.

This project creates a product artifact that acts as an interactive systems brief tailored for Circle.

Goal: increase probability of internal routing and interview conversion.

---

# 2. Product Thesis

**USDC Control Plane** is a simulated internal engineering console demonstrating how I think about infrastructure problems involved in trustworthy programmable assets.

It should feel like a credible internal prototype, not a portfolio site.

Core thesis:

```text
Demonstrate understanding of tokenization infrastructure
through invariants, failure domains, and asset state transitions.
```

---

# 3. Intended User Reaction

Within 45–60 seconds, a reviewer should think:

```text
This person understands our domain unusually well.
```

---

# 4. Target Audience

Primary:

* Hiring manager
* Senior engineers
* Technical recruiters

Secondary:

* Internal referrers
* Engineering leadership

---

# 5. MVP Scope

Version 1 includes six modules only:

1. Boot Sequence
2. Hybrid Asset Lifecycle Simulator
3. Trust Invariant Monitor
4. Chain State Explorer
5. Failure Modes
6. Architecture Window

No additional modules in v1.

---

# 6. Engineering Signals Being Communicated

This artifact should signal:

* Systems thinking
* Invariant-driven design
* Distributed systems intuition
* Finality awareness
* Tokenization domain understanding
* Product taste under constraints

---

# 7. Functional Modules

## 7.1 Boot Sequence

Startup:

```text
Loading USDC Control Plane...
Verifying trust invariants...
Checking settlement assumptions...
Scanning failure domains...
Access granted.
```

Requirements:

* animated boot logs
* skippable
* transitions into desktop

---

## 7.2 Hybrid Asset Lifecycle Simulator

Two modes:

### Mode A — USDC Transfer

```text
Mint
Transfer request
Settlement
Finality
Reconciliation
```

---

### Mode B — Tokenized Asset Lifecycle

```text
Asset issuance
Policy checks
Ownership state transition
Settlement finality
Invariant verification
```

Subtle note:
Policy checks and settlement progression are modeled as distinct concerns in the simulator.

---

## 7.3 Trust Invariant Monitor

Hero component.

Display:

```text
Supply Integrity ........ PASS
State Transition Valid .. PASS
Replay Safety ........... PASS
Settlement Finality ..... VALID
Ledger Consistency ...... PASS
```

Purpose:
make invariants the conceptual centerpiece.

---

## 7.4 Chain State Explorer

Supported commands:

```bash
inspect-finality tx_4412
verify-invariant pool_2
trace-transfer usdc_batch9
simulate-reorg
why-circle
```

Simulated output only.

No real chain access.

---

## 7.5 Failure Modes

Scenarios:

### Duplicate Replay

Contain replay risk.

### Finality Disturbance

Model reorg handling.

### Reconciliation Drift

Model invariant protection.

Display:

```text
Failure Domain .......... CONTAINED
Invariant Breach ........ NONE
Recovery Path ........... VERIFIED
```

---

## 7.6 Architecture Window

Flow shown:

```text
Asset Intent
→ Policy Engine
→ State Transition Engine
→ Event Queue
→ Settlement Layer
→ Reconciliation Layer
→ Invariant Verification
```

Title:

**How I Think About Programmable Asset Infrastructure**

---

# 8. 60-Second Skim Path

If user only spends 60 seconds:

1 Boot
2 Open lifecycle simulator
3 View invariant monitor
4 Open failure modes
5 Run `why-circle`

Designed for skim behavior.

---

# 9. Anti-Goals

Must not feel like:

* Crypto marketing site
* Portfolio website
* Hacker gimmick
* Blockchain buzzword demo
* Overengineered frontend toy

---

# 10. Visual Direction

Style:

* internal engineering control plane
* protocol observability console
* dark command center aesthetic

Reference mood:
PostHog style polish, protocol tooling feel.

Tone:
85% serious
15% playful

---

# 11. Technical Constraints

V1 stack:

```text
HTML
CSS
Vanilla JavaScript
Coolify (static hosting)
```

No framework required.

No backend.

No database.

---

# 12. Deployment

GitHub repository
→ Coolify static deploy
→ Public HTTPS URL

Static site only (no Docker / no app container).

---

# 13. Success Metrics

Tier 1
Reviewer spends >60 seconds exploring.

Tier 2
Artifact gets internally forwarded.

Tier 3
Interview generated.

---

# 14. Stretch Features (Only if time remains)

Optional only:

* Consensus disturbance simulator
* Deeper chain telemetry panel
* Additional scenario modes

Not part of MVP.

---

# 15. Simulation Disclaimer

Visible badge:

```text
Simulation Mode
No live chain interaction
```