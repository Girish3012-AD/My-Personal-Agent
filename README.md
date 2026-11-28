# AI‑OS — Artificial Intelligence Operating System
[![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Girish3012-AD/My-Personal-Agent/releases/tag/v1.0.0)
[![Status Production‑Ready](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)](https://github.com/Girish3012-AD/My-Personal-Agent)
[![License MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![JS/TS](https://img.shields.io/badge/language-JavaScript%2FTypeScript-yellow.svg)](package.json)

**Plain‑English pitch** – AI‑OS is a locally‑run “operating system” for autonomous agents. It combines a core runtime, a VS Code extension, and a browser dashboard to let developers and recruiters **learn**, **engineer**, **research**, **plan careers**, or **bootstrap startups** entirely on‑premise.

<!-- TODO: Add dashboard / VS Code Mastery Tracker screenshot -->

---

## System Architecture
```mermaid
flowchart TD
    VSCodeExt[VS Code Extension<br/>(website/vscode_extension)] -->|WebSocket| BridgeProxy[BridgeProxy :8081]
    Dashboard[Dashboard UI (Vite :5173)] <--> BridgeProxy
    BridgeProxy <--> Kernel[Kernel]
    Kernel <--> RuntimeEngines[Runtime Engines]
    RuntimeEngines <--> Applications[Applications]
    RuntimeEngines <--> Services[Services\nMemoryService, KnowledgeService]
    Services <--> DomainData[Domain Data<br/>(domains/*.json, vault_data/)]
```

**Layer roles**
- **VS Code Extension** – forwards VS Code commands to the local bridge.
- **BridgeProxy** – HTTP/WS gateway (listens on 8081) for dashboard and runtime.
- **Kernel** – intent parsing, planning, and orchestration.
- **Runtime Engines** – task routing, execution planning, result aggregation, circuit‑breaker.
- **Applications** – LearnOS, EngineerOS, ResearchOS, CareerOS, StartupOS.
- **Services** – in‑process MemoryService and KnowledgeService.
- **Domain Data** – static JSON mastery playbooks used by the engines.

---

## Core Modules (Status & I/O)
| Module | Status | Input → Action → Output |
|--------|--------|--------------------------|
| LearnOS | **Active** | Curriculum request → `CurriculumGenerator`, `ConceptTeacher`, `PracticeSynthesizer`, `MasteryAssessor` → JSON curriculum + UI view |
| EngineerOS | **Active** | Code spec → `ArchitecturePlanner`, `CodeSynthesizer`, `QualityReviewer`, `DeploymentPlanner` → generated source files + quality report |
| ResearchOS | **Beta** | Research query → `KnowledgeService` lazy‑loads domain → structured notes & citations |
| CareerOS | **Beta** | Resume & job posting → skill gap analysis → ATS‑optimized resume & interview feedback |
| StartupOS | **Planned** | Lean‑Canvas outline → MVP scaffold (currently stubbed) |

---

## Tech Stack & Prerequisites
| Requirement | Detail |
|-------------|--------|
| **Node.js** | >= 22.6.0 (required for `--experimental-strip-types` used by the VS Code proxy) |
| **Package manager** | npm |
| **TypeScript** | Sources compiled on‑the‑fly (no build step) |
| **VS Code** | 1.80+ (for the extension host) |
| **OS** | Linux/macOS/WSL – run `./start.sh` **or** Windows – run `dashboard\START.bat` |
| **Env vars** | None – the system runs fully offline |

---

## Installation & Quick Start
```bash
# Clone the repo (relative path works anywhere)
git clone https://github.com/Girish3012-AD/My-Personal-Agent.git
cd My-Personal-Agent
npm ci
```

**Linux/macOS/WSL**
```bash
./start.sh   # prints a 4‑step boot sequence and leaves the proxy running
```

**Windows**
```cmd
dashboard\START.bat   # launches backend and Vite frontend, then opens the dashboard in your browser
```

After the boot sequence finishes, open VS Code, press **Ctrl ⇧ P**, and run **`AIOS: Open Mastery Tracker`** to view the dashboard UI.

---

## Usage Walkthrough (end‑to‑end)
1. Start the system (`./start.sh` or `START.bat`).
2. In VS Code, run **`AIOS: Open Mastery Tracker`** – the dashboard appears at `http://localhost:5173`.
3. Choose **LearnOS → New Curriculum**, type `frontend_mastery`.
4. The runtime receives the intent, `CurriculumGenerator` creates a 6‑week syllabus, `ConceptTeacher` writes lesson notes, `PracticeSynthesizer` generates exercises, and `MasteryAssessor` produces a grading rubric.
5. The dashboard instantly shows progress and a markdown view of the curriculum. Click **Export → JSON** to save `learn_os/output/frontend_mastery.json` for downstream use.

All steps happen locally; no external API keys are required.

---

## Verification & Testing
Run the bundled health‑check suite:
```bash
node verify_system_final.js
```
Typical successful output (truncated):
```
✔ Kernel initialized
✔ BridgeProxy listening on 8081
✔ MemoryService wrote ping → pong
✔ KnowledgeService loaded dsa_mastery
✔ EngineerOS QualityReviewer returned complexity metric
All checks passed.
```
Individual `verify_*.js` scripts isolate each subsystem (e.g., `verify_engineer.js`, `verify_research_ui.js`).

---

## Repository Structure
```
My-Personal-Agent
├─ applications
│  ├─ career_os/
│  ├─ engineer_os/
│  │  ├─ ArchitecturePlanner.ts
│  │  ├─ CodeSynthesizer.ts
│  │  ├─ DeploymentPlanner.ts
│  │  ├─ QualityReviewer.ts
│  │  └─ ui/
│  ├─ learn_os/
│  │  ├─ engines/
│  │  │  ├─ ConceptTeacher.js
│  │  │  ├─ CurriculumGenerator.js
│  │  │  ├─ MasteryAssessor.js
│  │  │  └─ PracticeSynthesizer.js
│  │  └─ ui/
│  ├─ project_os/
│  ├─ research_os/
│  └─ startup_os/
├─ dashboard
│  └─ START.bat
├─ domains                # JSON mastery/playbook files
├─ engines
│  └─ runtime/
│     ├─ CircuitBreaker.js
│     ├─ ExecutionCoordinator.ts
│     ├─ ExecutionPlanner.js
│     ├─ ResultAggregator.js
│     └─ TaskRouter.js
├─ kernel
│  ├─ ContextManager.js
│  ├─ ExecutionCoordinator.js
│  ├─ InputProcessor.js
│  ├─ IntentAnalyzer.js
│  ├─ PlanningManager.js
│  ├─ ReasoningManager.js
│  └─ ValidationManager.js
├─ services
│  ├─ knowledge_service/
│  └─ memory_service/
├─ website
│  └─ vscode_extension/
│     └─ src/
│        └─ proxy.ts
├─ start.sh               # Linux/macOS bootloader
├─ package.json
└─ README.md
```
---

## Documentation, Roadmap & Contributing
- **Docs** – see the `docs/` folder for user manuals and technical reports.
- **Changelog** – [CHANGELOG.md](CHANGELOG.md)
- **Contribution guide** – [CONTRIBUTING.md](CONTRIBUTING.md)
- **License** – [LICENSE](LICENSE)

### Roadmap
- [x] Core kernel & runtime services (Memory, Knowledge, BridgeProxy)
- [x] LearnOS engine suite (Curriculum generation, mastery assessment)
- [x] EngineerOS code synthesis & quality review
- [x] Basic health‑check scripts (`verify_system_final.js`)
- [ ] ResearchOS full paper ingestion pipeline
- [ ] CareerOS ATS‑optimized resume builder
- [ ] StartupOS Lean‑Canvas generator & MVP scaffolding

---

Enjoy experimenting with a fully‑local, multi‑agent AI operating system!
