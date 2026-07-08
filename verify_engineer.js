import assert from "assert";
import { QualityReviewer } from "./applications/engineer_os/QualityReviewer.ts";
import { ArchitecturePlanner } from "./applications/engineer_os/ArchitecturePlanner.ts";

async function runTests() {
  const reviewer = new QualityReviewer();
  const planner = new ArchitecturePlanner();
  
  // Mock test 1: Pass raw code snippet -> assert QualityReviewer successfully returns Big-O complexity.
  const codeSnippet = "for(let i=0; i<n; i++) { console.log(i); }";
  const reviewResult = reviewer.reviewCode(codeSnippet);
  assert.strictEqual(reviewResult.complexity, "O(N)", "Complexity should be O(N)");
  
  // Mock test 2: Pass basic requirements -> assert ArchitecturePlanner outputs a Microservices node.
  const reqs = "Build a highly scalable microservice system.";
  const architectureResult = planner.parseRequirements(reqs);
  assert.strictEqual(architectureResult.architecture, "Microservices", "Architecture should be Microservices");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
