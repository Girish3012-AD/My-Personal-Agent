import assert from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ResearchDashboard } from './applications/research_os/ui/ResearchDashboard.tsx';
import { ComparativeView } from './applications/research_os/ui/ComparativeView.tsx';

async function runTests() {
  // Mock test 1: Trigger AIOS:ResearchPaper -> assert UI receives structured metadata
  const mockPapers = [
    { title: "Attention Is All You Need", author: "Vaswani et al.", metadata: "Transformer Architecture" }
  ];
  
  const dashboardHtml = renderToString(React.createElement(ResearchDashboard, { papers: mockPapers }));
  assert.ok(dashboardHtml.includes("Attention Is All You Need"), "Should render paper title");
  assert.ok(dashboardHtml.includes("Vaswani et al."), "Should render paper author");
  assert.ok(dashboardHtml.includes("Transformer Architecture"), "Should render paper metadata");
  
  // Mock test 2: Mock benchmark run -> assert ComparativeView renders correct matrix
  const mockMatrix = {
    results: [
      { model: "Gemini-3.1-Pro", accuracy: "98.5%", latency: "250ms" }
    ]
  };
  
  const viewHtml = renderToString(React.createElement(ComparativeView, { matrix: mockMatrix }));
  assert.ok(viewHtml.includes("Gemini-3.1-Pro"), "Should render model name");
  assert.ok(viewHtml.includes("98.5%"), "Should render accuracy");
  assert.ok(viewHtml.includes("250ms"), "Should render latency");
  
  console.log("All UI validations passed");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
