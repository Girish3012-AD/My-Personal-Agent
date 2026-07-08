import assert from 'assert';
import { WebSocket } from 'ws';
import { BridgeProxy } from './website/vscode_extension/src/proxy.ts';
import { QualityReviewer } from './applications/engineer_os/QualityReviewer.ts';
import { MemoryService } from './services/memory_service/MemoryService.ts';

// Mock domains and services for testing
const domains = {
  "dsa_mastery": {
    "Sliding Window": { prerequisites: ["Arrays", "Two Pointers"] }
  }
};

async function runTests() {
  const proxy = new BridgeProxy();
  const PORT = 8080;
  proxy.start(PORT);

  // Simulate RUNTIME-001 Orchestrator binding to proxy
  const memory = new MemoryService();
  const reviewer = new QualityReviewer();

  proxy.on('message_received', async (msg) => {
    // Log active session in MemoryService
    await memory.WriteMemory("active_session", msg.cmd, 3600);

    if (msg.cmd === "AIOS:AnalyzeCode") {
      // Route to ENG-ENG-03 (QualityReviewer)
      const result = reviewer.reviewCode(msg.data);
      proxy.streamToUI({
        source: "ENG-ENG-03",
        payload: { bigO: result.complexity }
      });
    } 
    else if (msg.cmd === "AIOS:MasterConcept") {
      // Route to LRN-ENG-01
      const concept = msg.data;
      const prereqs = domains["dsa_mastery"][concept]?.prerequisites || [];
      proxy.streamToUI({
        source: "LRN-ENG-01",
        payload: { path: prereqs }
      });
    }
  });

  // Client connects to proxy
  const wsClient = new WebSocket(`ws://localhost:${PORT}`);
  await new Promise(resolve => wsClient.on('open', resolve));

  // --- Workflow A (EngineerOS) ---
  const workflowAPromise = new Promise(resolve => {
    const handler = (data) => {
      const resp = JSON.parse(data.toString());
      if (resp.payload?.source === "ENG-ENG-03") {
        wsClient.off('message', handler);
        resolve(resp.payload);
      }
    };
    wsClient.on('message', handler);
  });

  wsClient.send(JSON.stringify({ cmd: "AIOS:AnalyzeCode", data: "function sort(arr) { return arr.sort(); }" }));
  const resultA = await workflowAPromise;
  assert.strictEqual(resultA.source, "ENG-ENG-03", "Should route to ENG-ENG-03");
  assert.ok(resultA.payload.bigO, "Should contain Big-O output");
  // Assert Memory
  assert.strictEqual(memory.vault.get("active_session").value, "AIOS:AnalyzeCode", "Memory should log the session");


  // --- Workflow B (LearnOS) ---
  const workflowBPromise = new Promise(resolve => {
    const handler = (data) => {
      const resp = JSON.parse(data.toString());
      if (resp.payload?.source === "LRN-ENG-01") {
        wsClient.off('message', handler);
        resolve(resp.payload);
      }
    };
    wsClient.on('message', handler);
  });

  wsClient.send(JSON.stringify({ cmd: "AIOS:MasterConcept", data: "Sliding Window" }));
  const resultB = await workflowBPromise;
  assert.strictEqual(resultB.source, "LRN-ENG-01", "Should route to LRN-ENG-01");
  assert.deepStrictEqual(resultB.payload.path, ["Arrays", "Two Pointers"], "Should fetch prerequisites");
  assert.strictEqual(memory.vault.get("active_session").value, "AIOS:MasterConcept", "Memory should log the session");

  proxy.stop();
  wsClient.close();
}

runTests().catch(err => {
  console.error("Ignition failed:", err);
  process.exit(1);
});
