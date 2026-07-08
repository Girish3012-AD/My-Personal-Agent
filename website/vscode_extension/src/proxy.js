import { WebSocketServer } from "ws";
import { TaskRouter } from "../../../engines/runtime/index.js";

/**
 * vscode_extension/src/proxy.js
 * Node-executable ESM version of the VS Code bridge proxy.
 */

const router = new TaskRouter();

router.registerEngine("CodeSynthesizer", {
  executeTask: async (task) => {
    return {
      status: "success",
      data: { review: "Code analysis completed. Structure conforms to standard patterns." }
    };
  }
});

const wss = new WebSocketServer({ port: 8080 });

console.log("[AI-OS Proxy] WebSocket server listening on port 8080");

wss.on("connection", (ws) => {
  console.log("[AI-OS Proxy] VS Code extension client connected.");

  ws.on("message", async (message) => {
    try {
      const request = JSON.parse(message);
      console.log(`[AI-OS Proxy] Received request: ${request.command}`);

      if (request.command === "AIOS_EXECUTE_TASK") {
        const task = request.payload;

        ws.send(JSON.stringify({
          type: "thought",
          content: `[Orchestrator] Routing task "${task.id}" of type "${task.type}" to ${task.engine}...`
        }));

        const result = await router.routeTask(task);

        ws.send(JSON.stringify({
          type: "result",
          content: result
        }));
      } else {
        ws.send(JSON.stringify({
          type: "error",
          content: `Unknown command: ${request.command}`
        }));
      }
    } catch (e) {
      console.error("[AI-OS Proxy] Message processing failure:", e);
      ws.send(JSON.stringify({
        type: "error",
        content: e.message
      }));
    }
  });

  ws.on("close", () => {
    console.log("[AI-OS Proxy] Client connection closed.");
  });
});

export { wss, router };
