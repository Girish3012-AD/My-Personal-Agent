import React from 'react';

export const ArchitectureViewer = ({ architecture }: { architecture?: any }) => {
  return (
    <div className="architecture-viewer">
      <h3>System Architecture</h3>
      {architecture ? (
        <ul className="architecture-nodes">
          {architecture.nodes?.map((node: string, idx: number) => (
            <li key={idx} className="arch-node">{node}</li>
          ))}
        </ul>
      ) : (
        <p>No architecture generated.</p>
      )}
    </div>
  );
};
