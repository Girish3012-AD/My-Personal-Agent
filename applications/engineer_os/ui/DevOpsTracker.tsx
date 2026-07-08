import React from 'react';

export const DevOpsTracker = ({ status }: { status?: any }) => {
  return (
    <div className="devops-tracker">
      <h3>DevOps Tracker</h3>
      <div className="status-item">CI/CD: {status?.cicd || 'Pending'}</div>
      <div className="status-item">Security: {status?.security || 'Pending'}</div>
      <div className="status-item">Deploy Readiness: {status?.ready ? 'Ready' : 'Not Ready'}</div>
    </div>
  );
};
