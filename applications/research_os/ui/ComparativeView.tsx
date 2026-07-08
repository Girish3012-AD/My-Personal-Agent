import React from 'react';

export const ComparativeView = ({ matrix }: { matrix?: any }) => {
  return (
    <div className="comparative-view">
      <h3>Comparative Analysis Matrix</h3>
      {matrix ? (
        <table className="benchmark-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Latency</th>
            </tr>
          </thead>
          <tbody>
            {matrix.results?.map((row: any, idx: number) => (
              <tr key={idx}>
                <td>{row.model}</td>
                <td>{row.accuracy}</td>
                <td>{row.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No benchmark data available.</p>
      )}
    </div>
  );
};
