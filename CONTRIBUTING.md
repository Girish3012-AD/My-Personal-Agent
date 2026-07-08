# Contributing to AI-OS

We welcome contributions to expand the capabilities of AI-OS. Please adhere to the following governance rules to ensure the integrity of the ecosystem.

## 1. Engine Development Rules
- **Template Adherence**: All new engines (e.g., `ENG-ENG-XX`) must strictly comply with the universal module template standard.
- **Asynchronous Execution**: Adhere to `10X_PARALLEL` asynchronous execution logic. Engines must never block the primary event loop in `KERNEL-001`.
- **Statelessness**: Engines must remain entirely stateless. All persistent data MUST be routed through `SERVICE-001` (MemoryService).

## 2. Knowledge Injection
- To add a new domain, create a strictly formatted JSON file in `/domains/`.
- Ensure all nodes contain standard parameters: `id`, `type`, `description`, `prerequisites`, and `cross_links`.

## 3. Commit Conventions
- Prefix commits logically: `feat:`, `fix:`, `docs:`, `chore:`.
- Ensure all automated unit tests (`verify_*.js`) pass before issuing a Pull Request.

## 4. Testing Requirements
- Every new UI component must include SSR Mock Validation inside a localized `verify_ui.js` runner utilizing `esbuild`.
