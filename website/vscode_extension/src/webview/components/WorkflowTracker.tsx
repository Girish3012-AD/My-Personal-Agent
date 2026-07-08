import React from 'react';

export const WorkflowTracker = () => {
  return (
    <div className="panel">
      <h2>LearnOS Workflows</h2>
      <div>
        <span>Mastering Arrays (DSA)</span>
        <progress value={70} max={100} />
      </div>
    </div>
  );
};
