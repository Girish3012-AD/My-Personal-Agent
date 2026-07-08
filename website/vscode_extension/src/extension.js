import { WebSocket } from "ws";

/**
 * website/vscode_extension/src/extension.js
 * Node-executable ESM version of the extension commands registration.
 */
export function activate(context, vscodeMock) {
  const vscode = vscodeMock || global.vscode;

  if (!vscode) {
    console.log("[AIOS Extension] Running outside VS Code context.");
    return;
  }

  const outputChannel = vscode.window.createOutputChannel("AI-OS");

  vscode.commands.registerCommand("AIOS:AnalyzeCode", async () => {
    outputChannel.appendLine("[AI-OS Client] Command 'AIOS:AnalyzeCode' triggered.");
    outputChannel.show(true);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      outputChannel.appendLine("[AI-OS Client] Error: No active editor window found.");
      return;
    }

    const codeContent = editor.document.getText();
    const fileName = editor.document.fileName;

    outputChannel.appendLine(`[AI-OS Client] Analyzing file: ${fileName}`);

    const ws = new WebSocket("ws://localhost:8080");

    ws.on("open", () => {
      outputChannel.appendLine("[AI-OS Client] Connected to AI-OS Proxy.");

      const payload = {
        command: "AIOS_EXECUTE_TASK",
        payload: {
          id: `anal_${Date.now()}`,
          type: "code_synthesis",
          engine: "CodeSynthesizer",
          input: {
            fileName,
            codeContent
          }
        }
      };

      ws.send(JSON.stringify(payload));
    });

    ws.on("message", (data) => {
      try {
        const response = JSON.parse(data);
        if (response.type === "thought") {
          outputChannel.appendLine(`[AI-OS Stream] ${response.content}`);
        } else if (response.type === "result") {
          outputChannel.appendLine("[AI-OS Stream] Result Received successfully:");
          outputChannel.appendLine(JSON.stringify(response.content, null, 2));
          ws.close();
        } else if (response.type === "error") {
          outputChannel.appendLine(`[AI-OS Stream Error] ${response.content}`);
          ws.close();
        }
      } catch (err) {
        outputChannel.appendLine(`[AI-OS Client Error] Fail to parse frame: ${err.message}`);
      }
    });

    ws.on("error", (err) => {
      outputChannel.appendLine(`[AI-OS Client Error] WebSocket error: ${err.message}`);
    });

    ws.on("close", () => {
      outputChannel.appendLine("[AI-OS Client] Connection to AI-OS Proxy closed.");
    });
  });
}
