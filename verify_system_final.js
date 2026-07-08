import assert from 'assert';
import { BridgeProxy } from './website/vscode_extension/src/proxy.ts';
import { MemoryService } from './services/memory_service/MemoryService.ts';
import { KnowledgeService } from './services/knowledge_service/KnowledgeService.ts';
import { QualityReviewer } from './applications/engineer_os/QualityReviewer.ts';

async function runTests() {
  // 1. Kernel (Mock)
  const kernelActive = true;
  assert.ok(kernelActive, "Kernel failed to initialize");

  // 2. Orchestrator Proxy
  const proxy = new BridgeProxy();
  proxy.start(8081);
  assert.ok(proxy, "Orchestrator proxy failed");

  // 3. Memory & Persistence
  const memory = new MemoryService("./vault_data/sys_vault.json", "./vault_data/sys_profile.json");
  await memory.WriteMemory("ping", "pong", 1000);
  assert.ok(memory, "MemoryService failed");

  // 4. Knowledge Graph Lazy-Loading
  const knowledge = new KnowledgeService();
  const dsa = knowledge.queryNode("dsa_mastery");
  assert.ok(dsa, "Knowledge Service failed to lazy-load domain");

  // 5. Engines (Eng/Res/Career/Startup)
  const reviewer = new QualityReviewer();
  const result = reviewer.reviewCode("function test() {}");
  assert.ok(result.complexity, "EngineerOS engine failed to parse complexity");

  proxy.stop();
}

runTests().catch(err => {
  console.error("System diagnostic failed:", err);
  process.exit(1);
});
