import assert from "assert";
import { ComparativeAnalyzer } from "./applications/research_os/ComparativeAnalyzer.ts";
import { MVPPlanner } from "./applications/startup_os/MVPPlanner.ts";

async function runTests() {
  const analyzer = new ComparativeAnalyzer();
  const planner = new MVPPlanner();
  
  // Mock test 1: Pass mock benchmark data -> assert ComparativeAnalyzer calculates score delta correctly
  const benchmarks = [
    { name: "ModelA", score: 90.5 },
    { name: "ModelB", score: 85.0 }
  ];
  const analysis = analyzer.analyzeBenchmarks(benchmarks);
  assert.strictEqual(analysis.scoreDelta, 5.5, "Score delta should be exactly 5.5");
  
  // Mock test 2: Pass raw MVP idea -> assert MVPPlanner generates a valid task payload
  const idea = "AI-powered coffee recommendation app";
  const payload = planner.generateTaskPayload(idea);
  assert.ok(payload.taskId, "Payload must have a taskId");
  assert.ok(payload.modules.length > 0, "Payload must outline architecture modules");
  assert.strictEqual(payload.description, `Build MVP for: ${idea}`, "Payload description must match the idea");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
