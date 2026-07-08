import * as fs from "fs";
import * as path from "path";
import { activate } from "./extension.js";
import { ContextManager } from "./kernel/ContextManager.js";
import { TaskRouter } from "./engines/runtime/TaskRouter.js";

async function verify() {
  console.log("=== RUNNING WORKSPACE OBSERVATION & FLOW VALIDATION ===");
  let failed = false;

  // 1. Mock VS Code environment and test file save handler
  try {
    let watcherCreated = false;
    let savedListener = null;

    const vscodeMock = {
      workspace: {
        createFileSystemWatcher(pattern) {
          watcherCreated = true;
          return {
            onDidChange: () => {},
            onDidCreate: () => {},
            onDidDelete: () => {}
          };
        },
        onDidSaveTextDocument(listener) {
          savedListener = listener;
        }
      },
      window: {
        showInformationMessage(msg) {}
      }
    };

    // Activate observer extension
    activate({}, vscodeMock);

    if (!watcherCreated || !savedListener) {
      throw new Error("Extension did not register watcher or save listeners.");
    }
    console.log("[PASS] Extension activated and registered workspace listeners.");

    // Clean any prior logs
    const suggestionsFile = path.resolve("./vault_data/suggestions.json");
    if (fs.existsSync(suggestionsFile)) {
      fs.unlinkSync(suggestionsFile);
    }

    // Simulate saving a DSA script file
    const dsaDoc = {
      uri: { fsPath: path.resolve("./dsa_practice_test.js") },
      getText: () => "function solve(array) { console.log('Testing binaryTree algorithms'); }"
    };
    await savedListener(dsaDoc);

    // Verify suggestions
    if (!fs.existsSync(suggestionsFile)) {
      throw new Error("Suggestions file was not generated on file save.");
    }
    const suggestData = JSON.parse(fs.readFileSync(suggestionsFile, "utf-8"));
    const dsaMatch = suggestData.find(s => s.type === "LearnOS Mastery Check");
    if (!dsaMatch) {
      throw new Error("DSA keywords did not trigger a Mastery Check suggestion.");
    }
    console.log("[PASS] DSA keyword listener successfully triggered mastery check suggestions.");

    // Verify Context Ingestion
    const contextFile = path.resolve("./vault_data/injected_context/dsa_practice_test.js.json");
    if (!fs.existsSync(contextFile)) {
      throw new Error("Context ingestion file was not written to vault.");
    }
    console.log("[PASS] Auto-Context injection persisted file blocks to vault.");
    
    // Clean up temporary files
    fs.unlinkSync(contextFile);
    fs.unlinkSync(suggestionsFile);
  } catch (e) {
    console.error("[FAIL] Workspace extension observer check failed:", e.message);
    failed = true;
  }

  // 2. Test ContextManager.js injectActiveFileContext
  try {
    const cm = new ContextManager();
    let writeMemoryCalled = false;
    const memoryServiceMock = {
      WriteMemory: async (key, val, lifespan) => {
        writeMemoryCalled = true;
        if (!key.includes("test_file.js")) {
          throw new Error("ContextManager passed invalid key format.");
        }
      }
    };

    await cm.injectActiveFileContext("test_file.js", "content here", memoryServiceMock);
    if (!writeMemoryCalled) {
      throw new Error("injectActiveFileContext did not invoke memory write.");
    }
    console.log("[PASS] ContextManager successfully injected active file blocks into Memory Service.");
  } catch (e) {
    console.error("[FAIL] ContextManager integration failed:", e.message);
    failed = true;
  }

  // 3. Test TaskRouter implicit QualityReviewer transition
  try {
    const tr = new TaskRouter();
    let synthesisExecuted = false;
    let reviewerExecuted = false;

    tr.registerEngine("CodeSynthesizer", {
      executeTask: async (task) => {
        synthesisExecuted = true;
        return { code: "const x = 1;" };
      }
    });

    tr.registerEngine("QualityReviewer", {
      executeTask: async (task) => {
        reviewerExecuted = true;
        return { lint: "clean", security: "secure" };
      }
    });

    // Dispatch synthesis task
    const result = await tr.routeTask({
      id: "task_synth_1",
      type: "code_synthesis",
      engine: "CodeSynthesizer"
    });

    // Wait a brief moment for async review trigger
    await new Promise(resolve => setTimeout(resolve, 50));

    if (!synthesisExecuted) {
      throw new Error("CodeSynthesizer task was not run.");
    }
    if (!reviewerExecuted) {
      throw new Error("Implicit QualityReviewer workflow transition failed to trigger.");
    }
    console.log("[PASS] TaskRouter successfully scheduled implicit quality check workflow.");
  } catch (e) {
    console.error("[FAIL] Implicit transitions check failed:", e.message);
    failed = true;
  }

  if (failed) {
    process.exit(1);
  } else {
    console.log("=== ALL WORKSPACE AUTOMATION VALIDATIONS PASSED ===");
  }
}

verify();
