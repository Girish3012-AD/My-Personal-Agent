import fs from 'fs';
import assert from 'assert';
import * as esbuild from 'esbuild';
import path from 'path';

async function runTests() {
  const packageJsonPath = './website/vscode_extension/package.json';
  
  // Mock test 2: Parse package.json -> assert valid VS Code activation events
  console.log("Mock test 2: Parse package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  assert.ok(pkg.activationEvents.includes("onCommand:AIOS.AnalyzeCode"), "Missing AnalyzeCode activation event");
  assert.ok(pkg.activationEvents.includes("onCommand:AIOS.ResearchPaper"), "Missing ResearchPaper activation event");
  assert.ok(pkg.activationEvents.includes("onCommand:AIOS.MasterConcept"), "Missing MasterConcept activation event");
  assert.ok(pkg.activationEvents.includes("onView:aios-sidebar"), "Missing sidebar view activation event");
  console.log("✓ package.json has all required commands and view events.");

  // Mock test 1: Execute a mock esbuild compilation of the React webview components
  console.log("Mock test 1: Esbuild compilation of App.tsx");
  const entryPoint = './website/vscode_extension/src/webview/App.tsx';
  
  try {
    const result = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      write: false,
      external: ['react', 'react-dom'], // Externalizing React because we didn't do full npm install inside the extension folder
      format: 'esm',
    });
    assert.ok(result.errors.length === 0, "Esbuild compilation failed");
    console.log("✓ Esbuild compilation completed without errors.");
  } catch (err) {
    assert.fail(`Esbuild build threw an error: ${err.message}`);
  }
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
