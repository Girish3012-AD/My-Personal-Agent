# AI-OS User Manual

Welcome to the AI-OS (Artificial Intelligence Operating System) User Manual. This guide provides comprehensive instructions on how to install, boot, and utilize the full suite of AI-OS platforms directly within your VS Code environment.

## 1. Getting Started

### Installation
1. Clone the AI-OS repository to your local workspace.
2. Ensure you have Node.js (v24+) installed.
3. Install the VS Code extension by navigating to `website/vscode_extension/` and running `npm install`.

### Bootloader Sequence
To initialize the AI-OS ecosystem, run the following command from the root directory:
```bash
./start.sh
```
This script will automatically detect your environment, initialize `KERNEL-001`, start core services (Memory and Knowledge), and attach the WebSocket proxy (`8080`) for IDE communication.

### VS Code Setup
Once the bootloader is running, open the command palette in VS Code (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type:
`AIOS: Open Mastery Tracker` or click the AI-OS icon in the activity bar.

## 2. Primary Workflows

### LearnOS
- **Mastery Dashboard**: Track your cognitive mastery across domains (e.g., Data Structures, Algorithms). The status bar will automatically update with your live `LRN-ENG-04` Mastery Assessor scores.
- **Path Generator**: Generate customized learning curriculums for target skills.

### EngineerOS
- **Code Analysis**: Highlight any code snippet in your editor and run the `AIOS: Analyze Code` command. The `QualityReviewer` will stream Big-O metrics and security vulnerabilities to the AI-OS sidebar.
- **Architecture Viewer**: Trigger `AIOS: Generate Architecture` to visually map your system topology.

### CareerOS
- **Resume Dashboard**: AI-OS automatically maps your internal `ProjectVault` history to ATS-optimized keyword blocks.
- **Interview Simulator**: Practice the STAR method interactively inside the sidebar, receiving live feedback streams from the AI orchestrator.

## 3. Troubleshooting
- **Proxy Disconnected**: If the VS Code sidebar fails to load, verify that port `8080` is available and that `./start.sh` was executed successfully.
- **Knowledge Cache Misses**: Restart the core process to force a cold-storage re-hydration from the `domains/` folder.

> For a deeper understanding of the underlying architecture, please refer to the [Technical Report](technical_report.pdf_ready.md).
