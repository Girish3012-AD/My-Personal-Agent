import assert from 'assert';
import { MemoryService } from './services/memory_service/MemoryService.ts';
import { PersistenceAdapter } from './services/memory_service/PersistenceAdapter.ts';
import { KnowledgeService } from './services/knowledge_service/KnowledgeService.ts';

async function runTests() {
  console.log("Running persistence mock tests...");

  // Mock test 1: Write profile state -> mock kill process -> reload system -> assert profile state is restored.
  const memory1 = new MemoryService("./vault_data/vault_test.json", "./vault_data/profile_test.json");
  await memory1.UpdateProfile("test_domain", 50);
  
  // Simulate process kill and reload
  const adapter = new PersistenceAdapter("./vault_data/persistent_state.json");
  const restoredProfile = adapter.loadState("profile_test_domain");
  assert.strictEqual(restoredProfile.score, 50, "Profile state should be restored from PersistenceAdapter");

  // Mock test 2: Invalidate domain node cache -> trigger query -> assert correct node hydrations from disk.
  const knowledge = new KnowledgeService();
  // We rely on dsa_mastery.json existing from previous steps
  const domainData = knowledge.queryNode("dsa_mastery");
  assert.ok(domainData, "Should hydrate from disk initially");
  assert.strictEqual(domainData.domain, "DSA Mastery", "Domain name should match");
  
  knowledge.invalidateCache("dsa_mastery");
  const rehydrated = knowledge.queryNode("dsa_mastery");
  assert.ok(rehydrated, "Should re-hydrate from disk after invalidation");
  assert.strictEqual(rehydrated.domain, "DSA Mastery", "Domain name should match after re-hydration");

  console.log("All persistence validations passed");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
