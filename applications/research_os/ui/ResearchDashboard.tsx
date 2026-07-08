import React from 'react';

export const ResearchDashboard = ({ papers }: { papers?: any[] }) => {
  return (
    <div className="research-dashboard">
      <h3>Research Dashboard</h3>
      {papers && papers.length > 0 ? (
        <ul className="papers-list">
          {papers.map((paper, idx) => (
            <li key={idx}>
              <strong>{paper.title}</strong> - {paper.author}
              <p>Metadata: {paper.metadata}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No research metadata available.</p>
      )}
    </div>
  );
};
