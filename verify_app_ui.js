import assert from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { LeanCanvasView } from './applications/startup_os/ui/LeanCanvasView.tsx';

async function runTests() {
  const mockPlaybook = {
    nodes: [
      {
        id: "Lean_Canvas",
        description: "1-page business plan template that helps you deconstruct your idea into its key assumptions."
      }
    ]
  };
  
  const viewHtml = renderToString(React.createElement(LeanCanvasView, { playbook: mockPlaybook }));
  
  assert.ok(viewHtml.includes("Lean_Canvas"), "Should render Lean_Canvas title");
  assert.ok(viewHtml.includes("1-page business plan template"), "Should render Lean_Canvas description");
  
  console.log("All App UI validations passed");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
