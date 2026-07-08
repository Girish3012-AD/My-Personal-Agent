import React from 'react';

export const PathGeneratorView = ({ onGenerate }: { onGenerate?: (objective: string) => void }) => {
  const triggerGenerate = () => {
    if (onGenerate) {
      onGenerate("Target Objective");
    }
  };

  return (
    <div className="path-generator">
      <h3>Curriculum Generator</h3>
      <button id="btn-generate" onClick={triggerGenerate}>Generate Roadmap</button>
    </div>
  );
};
