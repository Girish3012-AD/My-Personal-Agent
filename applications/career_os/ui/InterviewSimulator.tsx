import React from 'react';

export const InterviewSimulator = ({ feedback }: { feedback?: string }) => {
  return (
    <div className="interview-simulator">
      <h3>STAR Method Mock Interview</h3>
      <div className="chat-interface">
        <textarea placeholder="Describe a time when..."></textarea>
        <button>Submit Response</button>
      </div>
      {feedback && (
        <div className="live-feedback">
          <strong>Feedback:</strong> {feedback}
        </div>
      )}
    </div>
  );
};
