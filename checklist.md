# CHECKLIST.md

# Execution Rule

Every phase follows this pipeline:

```text
Build
Automated Check
Manual Local Verify
Commit
Push
Coolify Deploy
Live Verify
User Acceptance
Proceed
```

A phase is not complete until all gates pass.

---

# Verification Protocol

## Acceptance Gates

Every major phase must pass four gates.

---

## Gate 1 — Automated Checks

### Syntax Check

```bash
node --check app.js
```

Pass criteria:
- no syntax errors

**(you)** Run `pnpm run check` (includes syntax) and confirm it passes locally.

---

## Static site sanity (optional)

Production is **static files** only (Coolify or any static host).

Pass criteria:
- `pnpm run check` passes (same as automated check above)
- `pnpm run dev` or a one-line static server serves the root and `index.html` loads

**(you)** No container build — confirm the deployed site matches what you get from a local static preview.

---

## Optional Unit Tests

```bash
node --test
```

Tests cover:

### Command Parser
- [x] `why-circle`
- [x] `inspect-finality`
- [x] unknown command handling

### Invariant Resolver
- [x] successful lifecycle returns PASS
- [x] replay protection logic
- [x] reconciliation recovery

### Failure Modes
- [x] duplicate replay scenario valid
- [x] disturbance scenario valid
- [x] repair scenario valid

Pass criteria:
- all tests green

---

## Gate 2 — Manual Local Verification

Run locally (repo root):

```bash
pnpm install
pnpm run dev
```

This uses [`serve`](https://github.com/vercel/serve) on port **8080**. Alternatives you can use instead:

```bash
php -S localhost:8080 -t .
# or
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Verify (tick when true — **please confirm**):

- [ ] page loads
- [ ] feature behaves correctly
- [ ] no console errors
- [ ] layout looks correct

---

## Gate 3 — Live Coolify Verification

After push and deploy verify:

- [ ] feature works on live URL
- [ ] deployed matches local
- [ ] assets load
- [ ] HTTPS works
- [ ] no regressions

Required every phase.

---

## Gate 4 — User Acceptance Checkpoint

After each major phase stop and ask:

```text
Please verify Phase X:

1 Does it work?
2 Does it feel credible?
3 Any issues before proceeding?
4 Approved to continue?
```

Do not continue until approved.

---

# Phase 0 — Repo Initialization

## Create repository
- [x] Create GitHub repo `usdc-control-plane`
- [x] Add PRD.md
- [x] Add README

Commit:

```bash
git add .
git commit -m "Initial setup"
git push
```

Verify (agent cannot finish these without you — **please confirm**):

- [ ] Remote exists and you can `git pull` / see this commit on GitHub
- [ ] `git status` clean after sync (no unexpected local changes)

---

# Phase 0.5 — Verification Setup

Create:

```text
package.json
tests/
```

---

## package.json

Use **pnpm** (see `packageManager` in `package.json`). Example shape:

```json
{
  "scripts": {
    "check": "node --check app.js && node --test",
    "test": "node --test",
    "dev": "serve . -l 8080"
  }
}
```

---

## Initial test scaffolding
- [x] command parser tests
- [x] invariant tests
- [x] failure mode tests

Run:

```bash
pnpm install
pnpm run check
```

Verify (**please confirm**):

- [ ] syntax clean (no `node --check` errors)
- [ ] tests green (`node --test` passes)

Commit.

---

# Phase 1 — Project Skeleton

Create:

```text
index.html
styles.css
app.js
```

Tasks:
- [x] base HTML shell
- [x] base CSS
- [x] base JS bootstrap
- [x] assets folder
- [x] resume asset (`assets/resume.txt` placeholder — replace with PDF when wiring links in Phase 8)

Verify (**please confirm** via Gate 2 + below):

- [ ] shell loads (`pnpm run dev` or PHP / Python server)
- [ ] no console errors in browser devtools

**Please verify Phase 0 / 0.5 / 1 before Phase 1.5:**

1. Does `pnpm run check` pass on your machine?
2. Does `pnpm run dev` (or your PHP static server) show the scaffold without errors?
3. Any issues before Coolify deployment?
4. Approved to continue to Phase 1.5 — First Coolify deployment?

Commit / push.

---

# Phase 1.5 — First Coolify Deployment

In Coolify (or equivalent):

- [ ] Connect GitHub repo
- [ ] Deploy as **static site** (publish repo root — `index.html` at `/`)

Coolify publishes the SPA as uploaded/copied assets; no Dockerfile or separate app server required.

Verify:
- [x] first deploy succeeds
- [x] live URL works
- [x] auto deploy on push works

Test:
- [x] make CSS change
- [x] push
- [x] verify redeploy

Do not continue until working.

---

# Phase 2 — Desktop Shell

## Boot Sequence
- [x] animated startup logs
- [x] skip boot (**Escape** only — no button)
- [x] desktop reveal

Verify (**please confirm**):
- [ ] smooth animation
- [ ] **Escape** skips boot
- [ ] live deployment works (after Phase 1.5 Coolify is live)

---

## Window Manager
Build:
- [x] Lifecycle window
- [x] Invariant window
- [x] Explorer window
- [x] Failure window
- [x] Architecture window

Implement:
- [x] dragging
- [x] focus/z-index
- [x] default positions

Verify (**please confirm**):
- [ ] drag works
- [ ] stacking works
- [ ] layout balanced

---

## Verification
- [x] Automated checks (`pnpm run check`)
- [ ] Local verification
- [ ] Live verification
- [ ] User approval

STOP. Wait for approval.

Commit / push.

---

# Phase 2.5 — BazingaOS Desktop Metaphor (transition)

Evolve the Phase 2 shell forward: same window manager and apps—clearer **desktop OS** metaphor and spatial onboarding. **Transition/incremental**, not a rollback or parallel redesign.

## Desktop chrome

Build:

- [x] **BazingaOS** identity (name + visuals consistent with existing boot/desktop styling)
- [x] **Icons-first desktop**: apps appear as icons; **opening a window is explicit** (click)—initial desktop is calm, not a pile of open windows (`desktop-icons-surface` — draggable icons; windows `desktop-window--closed` until opened)
- [x] First-run **onboarding** wizard (single window, multi-step **Next**/**Finish**); completion stored in **localStorage** (`bazingaos.onboarding.completed`); no repeat; **boot splash skipped** on return visits once complete
- [ ] Trash on the desktop (affordance + behavior—empty vs items, optional restore)

## Files / previews / Easter eggs

Build:

- [ ] **Files** area (folder or desktop pile) with enough entries to feel like a real filesystem
- [ ] **Preview** for at least one substantive file (e.g. resume/CV viewer—fits the portfolio narrative)
- [ ] At least one **hidden or non-obvious** asset path (Easter egg—extra file, dotfile joke, or “empty” folder that isn’t)

## Stay aligned with the roadmap

Non-goals:

- Throwing away draggable windows, palette commands, or app content—this phase **re-skins and re-enters** through the desktop.

Verify (**please confirm**):

- [ ] Feels like one OS, not two products stitched together
- [ ] Phase 3 command palette still launches the same windows/actions after changes to entry UX

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 3 — Command Palette

Build:
- [x] Cmd/Ctrl-K
- [x] search commands
- [x] launch actions
- [x] Escape closes

Commands:
- [x] open lifecycle
- [x] open invariants
- [x] open explorer
- [x] open failure modes
- [x] open memo

Verify (**please confirm**):
- [ ] keyboard shortcut works
- [ ] commands launch correctly

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 4 — Hybrid Asset Lifecycle Simulator

## USDC Mode
- [x] Mint → transfer → settlement → finality → reconciliation (`Run simulation`)

---

## Tokenized Asset Mode
- [x] Issuance → policy checks → ownership transition → settlement finality → invariant verification

Verify (**please confirm**):
- [x] mode switching works
- [x] flow coherent

Reviewer Credibility Gate (**please confirm**):
- [ ] feels infrastructure-oriented
- [ ] avoids toy demo feel

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 5 — Trust Invariant Monitor

Build:

- [x] Supply Integrity
- [x] State Transition Valid
- [x] Replay Safety
- [x] Settlement Finality (**VALID** at depth)
- [x] Ledger Consistency

Tasks:
- [x] indicators render
- [x] status updates (`lifecycle-sim-begin` · `lifecycle-sim-step` · `lifecycle-sim-reset`)
- [x] hook to simulator

Verify (**please confirm**):
- [ ] indicators update while **Run simulation** advances
- [ ] feels like hero feature

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 6 — Chain State Explorer

Commands:

```bash
inspect-finality
verify-invariant
trace-transfer
simulate-reorg
why-circle
```

Tasks:
- [x] parser (`js/parse-command.js`, re-exported from `app.js`)
- [x] outputs (fixture lines in `js/explorer-commands.js`)
- [x] unknown command handling

Verify (**please confirm**):
- [ ] all commands work in the Chain State Explorer window

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 7 — Failure Modes

## Duplicate Replay
- [x] detect
- [x] contain
- [x] recover
- [x] invariant re-check (`Run scenario`)

## Finality Disturbance
- [x] disturb
- [x] revalidate
- [x] recover

## Reconciliation Drift
- [x] mismatch
- [x] repair
- [x] invariant re-check

Verify (**please confirm**):
- [ ] scenarios credible
- [ ] recovery clear (PRD summary strip after drill)

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 8 — Content Layer

## Hidden Memo
- [x] write why-circle (hidden memo · palette + **`why-circle` explorer** path)

Verify (**please confirm**):
- [ ] concise
- [ ] technically credible

---

## Top Bar Links
- [x] GitHub (`content-config.js` → profile URL)
- [x] Résumé (Google Doc URL in `content-config.js`)
- [x] X (`content-config.js` → `X_URL`)
- [x] Email (`mailto:?subject=` or set `EMAIL_TO` in content-config)

Verify (**please confirm**):
- [ ] links work in your deployed environment

Commit / push.

---

# Phase 8.5 — Copy Review Gate

Check:
- [x] no blockchain clichés
- [x] no exaggerated claims
- [x] Circle relevance explicit
- [x] Simulation Mode disclaimer visible
- [x] CTA copy clear

Must pass.

---

# Phase 9 — Coolify Production Hardening

## Domain
- [x] attach custom domain

Suggested:

```text
controlplane.adammomen.com
```

- [x] enable TLS

Verify:
- [x] domain resolves
- [x] HTTPS valid

---

## Deploy health (static site)

No container — verify the hosted site and Coolify project behave:

- [x] live URL returns the app (no unexpected 5xx)
- [x] redeploy / restart path works in Coolify when needed

---

## Rollback Test
- [x] intentionally break small thing
- [x] deploy
- [x] rollback previous release

Verify rollback works: **passed**

---

# Phase 10 — Final QA

## Functional Testing
- [ ] all interactions work

---

## UX Testing
- [ ] intuitive flow
- [ ] 60-second skim path works

---

## Recruiter Simulation
- [ ] relevance obvious in 15 sec
- [ ] interesting in 60 sec

---

## Engineer Simulation
- [ ] infra engineer would respect it
- [ ] invariants compelling
- [ ] failure modes elevate artifact

All pass.

---

# Phase 11 — Application Submission

- [ ] final URL tested incognito
- [ ] add URL to application
- [ ] add URL to referral outreach
- [ ] freeze deployed version

---

# Scope Guard

Priority if time runs short:

```text
1 Boot
2 Lifecycle Simulator
3 Invariant Monitor
4 Explorer
5 Failure Modes
```

Everything else optional.

---

# Kill List

Forbidden:
- [ ] no framework migration
- [ ] no backend
- [ ] no feature creep
- [ ] no extra modules after Phase 7
- [ ] no polish rabbit holes

Protect schedule.

---

# Git Discipline

After each phase:

```bash
git add .
git commit -m "Complete phase X"
git push
```

Verify live deployment every time.

Always.

---

# Failure Rule

If any gate fails:

```text
Fix
Retest
Redeploy
Reverify
Only then continue
```

Never continue with known defects.