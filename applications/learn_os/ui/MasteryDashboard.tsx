import React from 'react';

export const MasteryDashboard = ({ profile }: { profile?: any }) => {
  return (
    <div className="mastery-dashboard">
      <h3>Mastery Dashboard (DSA)</h3>
      <ul className="nodes-list">
        {profile?.nodes?.map((node: any) => (
          <li key={node.id} className={node.completed ? "status-complete" : "status-pending"}>
            {node.id} - {node.completed ? "Completed" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};
