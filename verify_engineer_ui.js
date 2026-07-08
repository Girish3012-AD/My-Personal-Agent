import assert from 'assert';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ArchitectureViewer } from './applications/engineer_os/ui/ArchitectureViewer.tsx';
import { CodeReviewPanel } from './applications/engineer_os/ui/CodeReviewPanel.tsx';

async function runTests() {
  // Mock test 1: Trigger AIOS:AnalyzeCode -> assert UI receives structured security vulnerabilities payload.
  const mockFindings = [
    { id: "vuln-1", severity: "High", message: "SQL Injection found" }
  ];
  
  const reviewHtml = renderToString(React.createElement(CodeReviewPanel, { findings: mockFindings }));
  assert.ok(reviewHtml.includes("High"), "Should render finding severity");
  assert.ok(reviewHtml.includes("SQL Injection found"), "Should render finding message");
  assert.ok(reviewHtml.includes("Apply Patch"), "Should render apply patch button");
  
  // Mock test 2: Mock architecture generation -> assert ArchitectureViewer receives nodes for Microservices/Database nodes.
  const mockArchitecture = {
    nodes: ["Microservices", "Database", "API Gateway"]
  };
  
  const archHtml = renderToString(React.createElement(ArchitectureViewer, { architecture: mockArchitecture }));
  assert.ok(archHtml.includes("Microservices"), "Should render Microservices node");
  assert.ok(archHtml.includes("Database"), "Should render Database node");
  
  console.log("All UI validations passed");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
