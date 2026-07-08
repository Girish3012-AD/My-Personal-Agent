import * as fs from "fs";
import * as path from "path";

/**
 * extension.js - AI-OS VS Code Workspace Observer (ESM)
 */
export function activate(context, vscodeMock) {
  const vscode = vscodeMock || global.vscode;

  if (!vscode) {
    console.log("[AI-OS Extension] Standalone activation. Running in mock-observer mode.");
    return;
  }

  console.log("[AI-OS Extension] Activating workspace observation...");

  // 1. File System Watcher
  const watcher = vscode.workspace.createFileSystemWatcher("**/*");
  
  watcher.onDidChange((uri) => {
    console.log(`[AI-OS Watcher] File changed: ${uri.fsPath}`);
  });

  // 2. Auto-Context Injection & Proactive Suggestions on Save
  vscode.workspace.onDidSaveTextDocument((document) => {
    const filePath = document.uri.fsPath || document.fileName;
    const content = document.getText ? document.getText() : fs.readFileSync(filePath, "utf-8");
    
    console.log(`[AI-OS Observer] Document saved: ${filePath}`);

    // Auto-Context Injection
    triggerContextInjection(filePath, content);

    // Proactive Suggestions Engine
    evaluateSuggestions(filePath, content, vscode);
  });
}

/**
 * Auto-Context Injection
 */
function triggerContextInjection(filePath, content) {
  console.log(`[AI-OS Context] Injecting file blocks for: ${path.basename(filePath)}`);
  
  const codeBlocks = [];
  const lines = content.split("\n");
  let currentBlock = [];
  
  for (const line of lines) {
    if (line.includes("function ") || line.includes("class ") || line.includes("interface ")) {
      if (currentBlock.length > 0) {
        codeBlocks.push(currentBlock.join("\n"));
        currentBlock = [];
      }
    }
    currentBlock.push(line);
  }
  if (currentBlock.length > 0) {
    codeBlocks.push(currentBlock.join("\n"));
  }

  const vaultDir = path.resolve("./vault_data/injected_context");
  if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir, { recursive: true });
  }

  const payload = {
    filePath,
    timestamp: new Date().toISOString(),
    blocksCount: codeBlocks.length,
    snippet: content.substring(0, 500)
  };

  fs.writeFileSync(
    path.join(vaultDir, `${path.basename(filePath)}.json`),
    JSON.stringify(payload, null, 2),
    "utf-8"
  );
  console.log(`[AI-OS Context] Persisted context frame for: ${path.basename(filePath)}`);
}

/**
 * Proactive Suggestion Engine
 */
function evaluateSuggestions(filePath, content, vscode) {
  const suggestionsFile = path.resolve("./vault_data/suggestions.json");
  const dirname = path.dirname(suggestionsFile);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  let suggestions = [];
  try {
    if (fs.existsSync(suggestionsFile)) {
      suggestions = JSON.parse(fs.readFileSync(suggestionsFile, "utf-8"));
    }
  } catch (e) {
    suggestions = [];
  }

  // DSA Suggestion Check
  if (content.match(/array|linkedList|binaryTree|sorting|dfs|bfs/i)) {
    console.log("[AI-OS Observer] DSA keywords detected. Triggering LearnOS suggestion.");
    const suggestion = {
      type: "LearnOS Mastery Check",
      title: "Run Mastery Check",
      message: `We detected DSA patterns in ${path.basename(filePath)}. Would you like to run a LearnOS assessment?`,
      timestamp: new Date().toISOString()
    };
    suggestions.push(suggestion);
    vscode.window.showInformationMessage(suggestion.message);
  }

  // API Compliance Check
  if (content.match(/app\.get|app\.post|router\.(get|post|put|delete)|\/api\//i)) {
    console.log("[AI-OS Observer] API route detected. Triggering EngineerOS compliance review.");
    
    let ruleText = "Verify endpoint parameter validation.";
    try {
      const templatePath = path.resolve("./templates/api_documentation_template.md");
      if (fs.existsSync(templatePath)) {
        ruleText = fs.readFileSync(templatePath, "utf-8").substring(0, 100) + "...";
      }
    } catch (err) {}

    const suggestion = {
      type: "EngineerOS API Compliance",
      title: "API Compliance Suggestion",
      message: `New API endpoint detected in ${path.basename(filePath)}. EngineerOS recommends validating structure against api_documentation_template.md rules: "${ruleText}"`,
      timestamp: new Date().toISOString()
    };
    suggestions.push(suggestion);
    vscode.window.showInformationMessage(suggestion.message);
  }

  fs.writeFileSync(suggestionsFile, JSON.stringify(suggestions, null, 2), "utf-8");
}
