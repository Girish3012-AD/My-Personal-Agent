import React, { useEffect, useState } from 'react';
import { ProjectContext } from './components/ProjectContext';
import { WorkflowTracker } from './components/WorkflowTracker';

declare global {
  interface Window {
    acquireVsCodeApi: () => any;
  }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

export const App = () => {
  const [streamData, setStreamData] = useState<any[]>([]);

  useEffect(() => {
    const handleMessage = (event: any) => {
      const message = event.data;
      if (message.type === 'AIOS_STREAM_OUTPUT') {
        setStreamData(prev => [...prev, message.payload]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const triggerAnalyze = () => {
    if (vscode) {
      vscode.postMessage({ type: 'AIOS_EXECUTE_TASK', payload: { command: 'Analyze' } });
    }
  };

  return (
    <div className="aios-container">
      <h1>AI-OS Webview</h1>
      <button onClick={triggerAnalyze}>Trigger Analysis</button>
      <ProjectContext />
      <WorkflowTracker />
      <div className="stream-output">
        <h3>Stream Output:</h3>
        {streamData.map((d, i) => <div key={i}>{JSON.stringify(d)}</div>)}
      </div>
    </div>
  );
};

export default App;
