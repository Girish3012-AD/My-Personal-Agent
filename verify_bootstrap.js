import * as fs from "fs";
import * as path from "path";

async function verify() {
  console.log("=== RUNNING BOOTSTRAP VALIDATION TESTS ===");
  let failed = false;

  // 1. Validate domains/dsa_mastery.json
  try {
    const jsonPath = path.resolve("./domains/dsa_mastery.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File not found: ${jsonPath}`);
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const requiredNodes = ["Arrays", "Linked Lists", "Hash Maps", "Stacks", "Queues", "Trees", "Graphs"];

    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new Error("dsa_mastery.json lacks nodes array.");
    }

    const nodeMap = new Map();
    data.nodes.forEach(node => {
      nodeMap.set(node.id, node);
      // Validate schema
      if (!node.id || !node.definition || !node.complexity || !node.prerequisites || !node.patterns) {
        throw new Error(`Node ${JSON.stringify(node)} violates schema contract.`);
      }
      if (typeof node.complexity.access !== "string" || 
          typeof node.complexity.search !== "string" || 
          typeof node.complexity.insert !== "string") {
        throw new Error(`Node ${node.id} complexity schema violates contract.`);
      }
    });

    requiredNodes.forEach(nodeName => {
      if (!nodeMap.has(nodeName)) {
        throw new Error(`Missing expected node in domain graph: ${nodeName}`);
      }
    });

    console.log("[PASS] domains/dsa_mastery.json conforms to schema and contains all required nodes.");
  } catch (error) {
    console.error("[FAIL] Domain Graph validation error:", error.message);
    failed = true;
  }

  // 2. Validate services/memory_service/MemoryService.ts Method Signatures
  try {
    const tsPath = path.resolve("./services/memory_service/MemoryService.ts");
    if (!fs.existsSync(tsPath)) {
      throw new Error(`File not found: ${tsPath}`);
    }

    const fileContent = fs.readFileSync(tsPath, "utf-8");
    const requiredSignatures = [
      "WriteMemory",
      "QueryContext",
      "UpdateProfile",
      "ProjectVaultStore",
      "SessionTracker",
      "Critical",
      "Supporting",
      "Background"
    ];

    requiredSignatures.forEach(sig => {
      if (!fileContent.includes(sig)) {
        throw new Error(`MemoryService.ts lacks required interface elements or signatures: ${sig}`);
      }
    });

    console.log("[PASS] MemoryService.ts contains all required classes, interfaces, and method signatures.");
  } catch (error) {
    console.error("[FAIL] Memory Service validation error:", error.message);
    failed = true;
  }

  // 3. Validate specifications/research_os_arch.md
  try {
    const archPath = path.resolve("./specifications/research_os_arch.md");
    if (!fs.existsSync(archPath)) {
      throw new Error(`File not found: ${archPath}`);
    }

    const markdown = fs.readFileSync(archPath, "utf-8");
    const requiredHeadings = ["SourceCollector", "EvidenceSynthesizer", "ComparativeAnalyzer", "SERVICE-002", "KERNEL-001"];

    requiredHeadings.forEach(heading => {
      if (!markdown.includes(heading)) {
        throw new Error(`research_os_arch.md is missing section reference to: ${heading}`);
      }
    });

    console.log("[PASS] specifications/research_os_arch.md exists and covers all required components.");
  } catch (error) {
    console.error("[FAIL] ResearchOS Architecture document validation error:", error.message);
    failed = true;
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log("=== ALL VALIDATIONS PASSED ===");
  }
}

verify();
