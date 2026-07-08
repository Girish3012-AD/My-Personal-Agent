import * as fs from "fs";
import * as path from "path";

async function verify() {
  console.log("=== RUNNING RESEARCH KNOWLEDGE LAYER VALIDATIONS ===");
  let failed = false;

  // 1. Verify research_knowledge_schema.json
  try {
    const schemaPath = path.resolve("./domains/research_knowledge_schema.json");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`File not found: ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    const requiredTypes = ["AcademicPaper", "TechnicalBenchmark", "ConceptMapping"];

    requiredTypes.forEach(type => {
      if (!schema.entity_types || !schema.entity_types[type]) {
        throw new Error(`Schema lacks entity type definition for: ${type}`);
      }
    });

    console.log("[PASS] research_knowledge_schema.json is valid and contains required entity types.");
  } catch (e) {
    console.error("[FAIL] Schema check failed:", e.message);
    failed = true;
  }

  // 2. Validate implements_concept mapping reference against dsa_mastery.json
  try {
    const dsaPath = path.resolve("./domains/dsa_mastery.json");
    if (!fs.existsSync(dsaPath)) {
      throw new Error(`File not found: ${dsaPath}`);
    }

    const dsaData = JSON.parse(fs.readFileSync(dsaPath, "utf-8"));
    const validDsaIds = new Set(dsaData.nodes.map(n => n.id));

    // Simulated AcademicPaper instance
    const samplePaper = {
      doi: "10.1145/3586.3587",
      title: "Optimizing Array Layouts",
      implements_concept: "Arrays" // Matches a node in dsa_mastery.json
    };

    if (!validDsaIds.has(samplePaper.implements_concept)) {
      throw new Error(`Paper maps to invalid concept ID: "${samplePaper.implements_concept}"`);
    }

    console.log(`[PASS] Claim linkage validation: implements_concept value "${samplePaper.implements_concept}" points to a valid DSA node.`);
  } catch (e) {
    console.error("[FAIL] Graph link validation failed:", e.message);
    failed = true;
  }

  // 3. Verify ReasoningManager.ts Class and Interfaces
  try {
    const rmPath = path.resolve("./kernel/ReasoningManager.ts");
    if (!fs.existsSync(rmPath)) {
      throw new Error(`File not found: ${rmPath}`);
    }

    const content = fs.readFileSync(rmPath, "utf-8");
    const expectedTerms = [
      "BenchmarkComparisonFrame",
      "ReasoningPassResult",
      "ReasoningManager",
      "requestReasoningPass"
    ];

    expectedTerms.forEach(term => {
      if (!content.includes(term)) {
        throw new Error(`ReasoningManager.ts lacks definition for: ${term}`);
      }
    });

    console.log("[PASS] ReasoningManager.ts contains expected class and delta reasoning signatures.");
  } catch (e) {
    console.error("[FAIL] ReasoningManager TS check failed:", e.message);
    failed = true;
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log("=== ALL RESEARCH KNOWLEDGE LAYER VALIDATIONS PASSED ===");
  }
}

verify();
