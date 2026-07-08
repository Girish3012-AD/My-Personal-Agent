import React from 'react';

export const ResumeDashboard = ({ vaultData }: { vaultData?: any }) => {
  return (
    <div className="resume-dashboard">
      <h3>Resume Optimization Dashboard</h3>
      {vaultData ? (
        <ul className="resume-blocks">
          {vaultData.projects?.map((proj: any, idx: number) => (
            <li key={idx} className="resume-block">
              <strong>{proj.name}</strong>: {proj.keywords.join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p>No vault data available.</p>
      )}
    </div>
  );
};
