import React from 'react';

export const CodeReviewPanel = ({ findings, onApplyPatch }: { findings?: any[], onApplyPatch?: (id: string) => void }) => {
  return (
    <div className="code-review-panel">
      <h3>Quality Reviewer</h3>
      {findings && findings.length > 0 ? (
        <ul className="findings-list">
          {findings.map((finding, idx) => (
            <li key={idx}>
              <span>[{finding.severity}] {finding.message}</span>
              <button onClick={() => onApplyPatch && onApplyPatch(finding.id)}>Apply Patch</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No vulnerabilities found.</p>
      )}
    </div>
  );
};
