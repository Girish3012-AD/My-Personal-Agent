import React from 'react';

export const MVPTracker = ({ tasks }: { tasks?: any[] }) => {
  return (
    <div className="mvp-tracker">
      <h3>MVP Architecture Tracker</h3>
      <ul>
        {tasks?.map((task, idx) => (
          <li key={idx} className={task.status === "Done" ? "task-done" : "task-pending"}>
            {task.feature} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};
