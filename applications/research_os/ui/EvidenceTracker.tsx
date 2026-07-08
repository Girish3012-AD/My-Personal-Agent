import React from 'react';

export const EvidenceTracker = ({ evidences }: { evidences?: any[] }) => {
  return (
    <div className="evidence-tracker">
      <h3>Evidence Tracker</h3>
      <ul>
        {evidences?.map((ev, idx) => (
          <li key={idx} className={ev.isValid ? "status-valid" : "status-invalid"}>
            Source: <a href={ev.link}>{ev.source}</a>
            <span> - {ev.isValid ? "Validated" : "Unverified"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
