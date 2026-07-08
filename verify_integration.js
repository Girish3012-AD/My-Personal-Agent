import assert from "assert";
import { SkillVerifierEngine } from "./applications/career_os/SkillVerifierEngine.ts";
import { ExecutionCoordinator } from "./engines/runtime/ExecutionCoordinator.ts";

async function runTests() {
  console.log("--- Starting AEOS & CareerOS Integration Tests ---");
  
  // Test 1: SkillVerifierEngine threshold rules
  console.log("Running SkillVerifierEngine tests...");
  const skillEngine = new SkillVerifierEngine();
  
  // Mock test 1: Conf=0.60 -> assert 'Unverified'
  const result1 = skillEngine.verifySkill("React", 0.60, "exp-123");
  assert.strictEqual(result1, "Unverified", "Skill with confidence < 0.7 should be Unverified");
  console.log("✓ Mock test 1 passed (0.60 -> Unverified)");
  
  // Mock test 2: Conf=0.85 -> assert 'Verified'
  const result2 = skillEngine.verifySkill("Node.js", 0.85, "exp-123");
  assert.strictEqual(result2, "Verified", "Skill with confidence >= 0.7 should be Verified");
  console.log("✓ Mock test 2 passed (0.85 -> Verified)");

  // Test 2: ExecutionCoordinator MCP Gate
  console.log("\nRunning ExecutionCoordinator tests...");
  const coordinator = new ExecutionCoordinator();
  
  console.log("Executing MCP command (should pause for human approval)...");
  const startTime = Date.now();
  const execResult = await coordinator.executeMCPCommand("test_command", ["arg1"]);
  const elapsedTime = Date.now() - startTime;
  
  assert.strictEqual(execResult.status, "success", "MCP command should execute successfully after approval");
  assert.ok(elapsedTime >= 100, `Execution should have paused for at least 100ms (took ${elapsedTime}ms)`);
  console.log("✓ ExecutionCoordinator mock human approval gate passed");
  
  console.log("\n--- All tests passed! ---");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
