import React from 'react';

export const LeanCanvasView = ({ playbook }: { playbook?: any }) => {
  const leanCanvasNode = playbook?.nodes?.find((n: any) => n.id === "Lean_Canvas");
  
  return (
    <div className="lean-canvas-view">
      <h3>Lean Canvas Visualizer</h3>
      {leanCanvasNode ? (
        <div className="canvas-grid">
          <h4>{leanCanvasNode.id}</h4>
          <p>{leanCanvasNode.description}</p>
        </div>
      ) : (
        <p>Playbook data missing.</p>
      )}
    </div>
  );
};
