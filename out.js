// verify_app_ui.js
import assert from "assert";
import React2 from "react";
import { renderToString } from "react-dom/server";

// applications/startup_os/ui/LeanCanvasView.tsx
import React from "react";
var LeanCanvasView = ({ playbook }) => {
  const leanCanvasNode = playbook?.nodes?.find((n) => n.id === "Lean_Canvas");
  return /* @__PURE__ */ React.createElement("div", { className: "lean-canvas-view" }, /* @__PURE__ */ React.createElement("h3", null, "Lean Canvas Visualizer"), leanCanvasNode ? /* @__PURE__ */ React.createElement("div", { className: "canvas-grid" }, /* @__PURE__ */ React.createElement("h4", null, leanCanvasNode.id), /* @__PURE__ */ React.createElement("p", null, leanCanvasNode.description)) : /* @__PURE__ */ React.createElement("p", null, "Playbook data missing."));
};

// verify_app_ui.js
async function runTests() {
  const mockPlaybook = {
    nodes: [
      {
        id: "Lean_Canvas",
        description: "1-page business plan template that helps you deconstruct your idea into its key assumptions."
      }
    ]
  };
  const viewHtml = renderToString(React2.createElement(LeanCanvasView, { playbook: mockPlaybook }));
  assert.ok(viewHtml.includes("Lean_Canvas"), "Should render Lean_Canvas title");
  assert.ok(viewHtml.includes("1-page business plan template"), "Should render Lean_Canvas description");
  console.log("All App UI validations passed");
}
runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
