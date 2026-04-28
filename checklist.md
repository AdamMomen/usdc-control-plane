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

---

## Docker Build Check

```bash
docker build -t usdc-control-plane .
```

Pass criteria:
- build succeeds
- no missing files

---

## Optional Unit Tests

```bash
node --test
```

Tests cover:

### Command Parser
- [ ] `why-circle`
- [ ] `inspect-finality`
- [ ] unknown command handling

### Invariant Resolver
- [ ] successful lifecycle returns PASS
- [ ] replay protection logic
- [ ] reconciliation recovery

### Failure Modes
- [ ] duplicate replay scenario valid
- [ ] disturbance scenario valid
- [ ] repair scenario valid

Pass criteria:
- all tests green

---

## Gate 2 — Manual Local Verification

Run locally:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Verify:

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
- [ ] Add README

Commit:

```bash
git add .
git commit -m "Initial setup"
git push
```

Verify:
- [ ] repo exists
- [ ] clean git status

---

# Phase 0.5 — Verification Setup

Create:

```text
package.json
tests/
```

---

## package.json

```json
{
  "scripts": {
    "check":"node --check app.js && node --test",
    "test":"node --test"
  }
}
```

---

## Initial test scaffolding
- [ ] command parser tests
- [ ] invariant tests
- [ ] failure mode tests

Run:

```bash
npm run check
```

Verify:
- [ ] syntax clean
- [ ] tests green

Commit.

---

# Phase 1 — Project Skeleton

Create:

```text
index.html
styles.css
app.js
Dockerfile
nginx.conf
```

Tasks:
- [ ] base HTML shell
- [ ] base CSS
- [ ] base JS bootstrap
- [ ] assets folder
- [ ] resume asset

Verify:
- [ ] shell loads
- [ ] no console errors

Commit / push.

---

# Phase 1.5 — First Coolify Deployment

In Coolify:

- [ ] Connect GitHub repo
- [ ] Dockerfile deployment
- [ ] Expose port 80

---

## Dockerfile

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
EXPOSE 80
```

---

## nginx.conf

```nginx
server {
 listen 80;
 root /usr/share/nginx/html;
 index index.html;

 location / {
   try_files $uri $uri/ /index.html;
 }
}
```

Verify:
- [ ] first deploy succeeds
- [ ] live URL works
- [ ] auto deploy on push works

Test:
- [ ] make CSS change
- [ ] push
- [ ] verify redeploy

Do not continue until working.

---

# Phase 2 — Desktop Shell

## Boot Sequence
- [ ] animated startup logs
- [ ] skip boot
- [ ] desktop reveal

Verify:
- [ ] smooth animation
- [ ] skip works
- [ ] live deployment works

---

## Window Manager
Build:
- [ ] Lifecycle window
- [ ] Invariant window
- [ ] Explorer window
- [ ] Failure window
- [ ] Architecture window

Implement:
- [ ] dragging
- [ ] focus/z-index
- [ ] default positions

Verify:
- [ ] drag works
- [ ] stacking works
- [ ] layout balanced

---

## Verification
- [ ] Automated checks
- [ ] Local verification
- [ ] Live verification
- [ ] User approval

STOP. Wait for approval.

Commit / push.

---

# Phase 3 — Command Palette

Build:
- [ ] Cmd/Ctrl-K
- [ ] search commands
- [ ] launch actions
- [ ] Escape closes

Commands:
- [ ] open lifecycle
- [ ] open invariants
- [ ] open explorer
- [ ] open failure modes
- [ ] open memo

Verify:
- [ ] keyboard shortcut works
- [ ] commands launch correctly

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 4 — Hybrid Asset Lifecycle Simulator

## USDC Mode
- [ ] mint flow
- [ ] transfer
- [ ] finality
- [ ] reconciliation

---

## Tokenized Asset Mode
- [ ] issuance flow
- [ ] ownership transitions
- [ ] invariant verification

Verify:
- [ ] mode switching works
- [ ] flow coherent

Reviewer Credibility Gate:
- [ ] feels infrastructure-oriented
- [ ] avoids toy demo feel

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 5 — Trust Invariant Monitor

Build:

- [ ] Supply Integrity
- [ ] State Transition Valid
- [ ] Replay Safety
- [ ] Settlement Finality
- [ ] Ledger Consistency

Tasks:
- [ ] indicators render
- [ ] status updates
- [ ] hook to simulator

Verify:
- [ ] indicators update
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
- [ ] parser
- [ ] outputs
- [ ] unknown command handling

Verify:
- [ ] all commands work

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 7 — Failure Modes

## Duplicate Replay
- [ ] detect
- [ ] contain
- [ ] recover

## Finality Disturbance
- [ ] disturb
- [ ] revalidate
- [ ] recover

## Reconciliation Drift
- [ ] mismatch
- [ ] repair
- [ ] invariant re-check

Verify:
- [ ] scenarios credible
- [ ] recovery clear

Verification gates pass.

STOP. Wait for approval.

Commit / push.

---

# Phase 8 — Content Layer

## Hidden Memo
- [ ] write why-circle
- [ ] subtle OCP reference

Verify:
- [ ] concise
- [ ] technically credible

---

## Top Bar Links
- [ ] GitHub
- [ ] Resume
- [ ] Email

Verify:
- [ ] links work

Commit / push.

---

# Phase 8.5 — Copy Review Gate

Check:
- [ ] no blockchain clichés
- [ ] no exaggerated claims
- [ ] Circle relevance explicit
- [ ] OCP reference accurate
- [ ] Simulation Mode disclaimer visible
- [ ] CTA copy clear

Must pass.

---

# Phase 9 — Coolify Production Hardening

## Domain
- [ ] attach custom domain

Suggested:

```text
controlplane.adammomen.com
```

- [ ] enable TLS

Verify:
- [ ] domain resolves
- [ ] HTTPS valid

---

## Container Health
- [ ] logs clean
- [ ] healthy container
- [ ] restart succeeds

---

## Rollback Test
- [ ] intentionally break small thing
- [ ] deploy
- [ ] rollback previous release

Verify rollback works.

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