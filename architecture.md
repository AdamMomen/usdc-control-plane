# ARCHITECTURE.md

# USDC Control Plane  
**Trust Invariants for Programmable Assets**

Static single-page application: built assets served as files (e.g. Coolify static hosting).

No backend.  
No database.  
No live chain integrations.  
Simulation only.

---

# 1. System Context

## Purpose

The application is a simulated internal control plane demonstrating:
- tokenization infrastructure thinking
- trust invariants
- failure domains
- state transitions
- programmable asset flows

---

## System Context Diagram

```mermaid
flowchart TD

A[Circle Reviewer]
--> B[Public Application URL]

B --> C[USDC Control Plane SPA]

C --> D[Boot Sequence]
C --> E[Asset Lifecycle Simulator]
C --> F[Invariant Monitor]
C --> G[Chain State Explorer]
C --> H[Failure Modes]
C --> I[Architecture Window]
C --> J[Hidden Memo]

J --> K[GitHub]
J --> L[Resume]
J --> M[Contact]
```

---

# 2. Deployment Architecture

## Hosting Architecture

```mermaid
flowchart TD

A[Local Development]
--> B[Git Commit]

B --> C[GitHub Repository]

C --> D[Coolify]

D --> E[Static site publish]

E --> G[HTTPS Domain]

G --> H[Circle Reviewer]
```

---

## Deployment Runtime

```mermaid
flowchart LR

GitHub --> Coolify
Coolify --> StaticFiles
StaticFiles --> PublicURL
```

---

# 3. Repository Architecture

```mermaid
flowchart TD

A[Repository]

A --> B[index.html]
A --> C[styles.css]
A --> D[app.js]

A --> G[PRD.md]
A --> H[checklist.md]
A --> I[architecture.md]

A --> J[tests]

J --> K[commandParser.test.js]
J --> L[invariant.test.js]
J --> M[failureModes.test.js]
```

---

# 4. Runtime Architecture

```mermaid
flowchart TD

Browser
--> AppShell

AppShell --> BootController
AppShell --> WindowManager
AppShell --> CommandPalette
AppShell --> TerminalEngine

AppShell --> LifecycleSimulator
AppShell --> InvariantEngine
AppShell --> FailureModeEngine
AppShell --> ArchitectureRenderer
```

---

# 5. UI State Model

```mermaid
stateDiagram-v2

[*] --> Booting

Booting --> DesktopReady

DesktopReady --> WindowFocused
WindowFocused --> WindowDragging
WindowDragging --> WindowFocused

DesktopReady --> CommandPaletteOpen
CommandPaletteOpen --> CommandExecuted
CommandExecuted --> DesktopReady

DesktopReady --> TerminalActive

TerminalActive --> ExplorerResponse
TerminalActive --> HiddenMemo
TerminalActive --> ErrorState
```

---

# 6. Desktop Layout Architecture

Default layout:

```mermaid
flowchart TD

A[Desktop]

A --> B[Top Left
Asset Lifecycle]

A --> C[Top Right
Invariant Monitor]

A --> D[Bottom Left
Chain Explorer]

A --> E[Bottom Right
Failure Modes]

A --> F[Center Modal
Architecture Window]
```

---

# 7. Boot Sequence Flow

```mermaid
sequenceDiagram

participant User
participant Browser
participant Boot
participant Desktop

User->>Browser: open URL

Browser->>Boot:
initialize boot sequence

Boot->>Boot:
load system logs

Boot->>Boot:
verify invariants

Boot->>Boot:
scan failure domains

Boot->>Desktop:
show desktop shell

Desktop->>User:
interactive control plane ready
```

---

# 8. Hybrid Asset Lifecycle Architecture

## High-Level Flow

```mermaid
flowchart TD

Intent
--> PolicyChecks
--> StateTransition
--> Settlement
--> Finality
--> Reconciliation
--> InvariantVerification
```

---

## Hybrid Modes

```mermaid
flowchart LR

A[USDC Mode]
--> B[Mint]
--> C[Transfer]
--> D[Settlement]
--> E[Reconciliation]

F[Tokenized Asset Mode]
--> G[Asset Issuance]
--> H[Ownership State Transition]
--> I[Settlement Finality]
--> J[Invariant Check]
```

---

# 9. Lifecycle Simulation Sequence

```mermaid
sequenceDiagram

participant User
participant Simulator
participant Invariants
participant UI

User->>Simulator:
Run Simulation

Simulator->>Simulator:
Mint

Simulator->>Simulator:
Transfer

Simulator->>Simulator:
Settlement

Simulator->>Simulator:
Finality

Simulator->>Simulator:
Reconciliation

Simulator->>Invariants:
Verify invariants

Invariants->>UI:
PASS status
```

---

# 10. Trust Invariant Architecture

## Core Invariants

```mermaid
flowchart TD

A[Trust Invariants]

A --> B[Supply Integrity]
A --> C[State Transition Validity]
A --> D[Replay Safety]
A --> E[Settlement Finality]
A --> F[Ledger Consistency]
```

---

## Invariant Update Logic

```mermaid
flowchart TD

SimulationEvents
--> InvariantResolver
--> StatusEngine
--> UIIndicators
```

---

# 11. Chain State Explorer Architecture

```mermaid
flowchart TD

CommandInput
--> Parser

Parser --> Decision

Decision --> FinalityQuery
Decision --> InvariantQuery
Decision --> TransferTrace
Decision --> ReorgSimulation
Decision --> HiddenMemo

FinalityQuery --> ResponseRenderer
InvariantQuery --> ResponseRenderer
TransferTrace --> ResponseRenderer
ReorgSimulation --> ResponseRenderer
HiddenMemo --> ResponseRenderer
```

---

## Command Parser Flow

```mermaid
flowchart TD

Input
--> IsKnownCommand

IsKnownCommand -->|yes| Execute
IsKnownCommand -->|no| Error

Execute --> StructuredOutput
Error --> HelpfulMessage
```

---

# 12. Failure Modes Architecture

```mermaid
flowchart TD

FailureModes
--> DuplicateReplay
--> FinalityDisturbance
--> ReconciliationDrift
```

---

## Duplicate Replay Flow

```mermaid
flowchart TD

DuplicateDetected
--> IdempotencyProtection
--> Containment
--> Recovery
--> InvariantRecheck
```

---

## Finality Disturbance Flow

```mermaid
flowchart TD

DisturbanceDetected
--> Revalidation
--> Recovery
--> FinalityConfirmed
```

---

## Reconciliation Drift Flow

```mermaid
flowchart TD

MismatchDetected
--> RepairPath
--> LedgerRecheck
--> InvariantsPass
```

---

# 13. Failure Mode Sequence

```mermaid
sequenceDiagram

participant User
participant FailureEngine
participant Recovery
participant Invariants

User->>FailureEngine:
Run scenario

FailureEngine->>FailureEngine:
Inject failure

FailureEngine->>Recovery:
Trigger recovery logic

Recovery->>Invariants:
Recheck system invariants

Invariants->>User:
Safe state verified
```

---

# 14. Window Manager Architecture

```mermaid
flowchart TD

MouseDown
--> DragStart

DragStart
--> MouseMove

MouseMove
--> PositionUpdate

PositionUpdate
--> MouseUp

MouseUp
--> DragEnd
```

---

## Window Focus Logic

```mermaid
flowchart TD

WindowClick
--> RaiseZIndex
--> FocusedWindow
```

---

# 15. Command Palette Architecture

```mermaid
flowchart TD

KeyboardListener
--> CmdK

CmdK
--> PaletteOpen

PaletteOpen
--> SearchCommands

SearchCommands
--> CommandSelected

CommandSelected
--> WindowLaunch

CommandSelected
--> ActionExecution
```

---

# 16. Testing Architecture

## Verification Flow

```mermaid
flowchart TD

Build
--> AutomatedChecks

AutomatedChecks
--> ManualLocal

ManualLocal
--> LiveCoolifyVerify

LiveCoolifyVerify
--> UserAcceptance

UserAcceptance -->|pass| NextPhase
UserAcceptance -->|fail| FixAndRetest
```

---

## Unit Test Coverage

```mermaid
flowchart TD

Tests
--> CommandParserTests
--> InvariantTests
--> FailureModeTests
```

---

# 17. Coolify Deployment Architecture

```mermaid
flowchart TD

PushToGitHub
--> CoolifyWebhook

CoolifyWebhook
--> StaticPublish

StaticPublish
--> LiveProductionURL
```

---

## Rollback Flow

```mermaid
flowchart TD

BadDeploy
--> DetectIssue
--> Rollback
--> PreviousStableRelease
```

---

# 18. Security Boundary

```mermaid
flowchart TD

Browser
--> SimulatedDataOnly

SimulatedDataOnly -. no live chain .-> BlockchainRPC

SimulatedDataOnly -. no secrets .-> Secrets

SimulatedDataOnly -. no database .-> Persistence
```

Security assumptions:
- no private keys
- no wallet interaction
- no live chain calls
- no user data collection

---

# 19. Conceptual layering (simulation-only)

Conceptual separation of policy vs settlement paths—inspiration only:

```mermaid
flowchart TD

OwnershipStateTransitions
--> StateMachineThinking

StateMachineThinking
--> AssetLifecycleModeling

AssetLifecycleModeling
--> TrustInvariantDesign
```

Reference is conceptual, not product dependency.

---

# 20. Non-Goals Architecture

Excluded intentionally:

```mermaid
flowchart TD

Excluded
--> NoBackend
--> NoDatabase
--> NoAuth
--> NoLiveBlockchain
--> NoAnalytics
--> NoFrameworkComplexity
```

Scope protection.

---

# 21. Future Stretch Architecture (Optional)

Only after MVP complete.

```mermaid
flowchart TD

MVP
--> ConsensusDisturbanceSimulator
--> RichTelemetryLayer
--> DeepLinkableScenarios
--> ReactUpgradeOptional
```

Not in current scope.