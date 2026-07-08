import * as vscode from 'vscode';
import { BridgeProxy } from './proxy.ts';

export function activate(context: vscode.ExtensionContext) {
  const provider = new AIOSSidebarProvider(context.extensionUri);
  const proxy = new BridgeProxy();
  
  // Start WebSocket Server
  proxy.start(8080);
  provider.setProxy(proxy);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('aios-sidebar', provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('AIOS.AnalyzeCode', () => {
      const editor = vscode.window.activeTextEditor;
      const text = editor ? editor.document.getText() : "";
      
      proxy.emit('message_received', { type: 'AIOS_EXECUTE_TASK', payload: { command: 'AIOS.AnalyzeCode', context: text, target: 'ENG-ENG-03' } });
      vscode.window.showInformationMessage('Code Analysis triggered...');
    }),
    vscode.commands.registerCommand('AIOS.GenerateArchitecture', () => {
      proxy.emit('message_received', { type: 'AIOS_EXECUTE_TASK', payload: { command: 'AIOS.GenerateArchitecture', target: 'ENG-ENG-01' } });
      vscode.window.showInformationMessage('Architecture generation triggered...');
    }),
    vscode.commands.registerCommand('AIOS.ResearchPaper', () => {
      const editor = vscode.window.activeTextEditor;
      const text = editor ? editor.document.getText() : "";
      proxy.emit('message_received', { type: 'AIOS_EXECUTE_TASK', payload: { command: 'AIOS.ResearchPaper', context: text, target: 'RES-ENG-02' } });
      vscode.window.showInformationMessage('Research Paper ingestion triggered...');
    }),
    vscode.commands.registerCommand('AIOS.BenchmarkModels', () => {
      proxy.emit('message_received', { type: 'AIOS_EXECUTE_TASK', payload: { command: 'AIOS.BenchmarkModels', target: 'RES-ENG-03' } });
      vscode.window.showInformationMessage('Benchmarking initialized...');
    }),
    vscode.commands.registerCommand('AIOS:OpenMasteryTracker', () => {
      vscode.commands.executeCommand('workbench.view.extension.aios-explorer');
      vscode.window.showInformationMessage('Opening Mastery Tracker...');
    }),
    vscode.commands.registerCommand('AIOS:OpenCareerPortal', () => {
      vscode.commands.executeCommand('workbench.view.extension.aios-explorer');
      vscode.window.showInformationMessage('Opening Career Portal...');
    }),
    vscode.commands.registerCommand('AIOS:OpenStartupPlanner', () => {
      vscode.commands.executeCommand('workbench.view.extension.aios-explorer');
      vscode.window.showInformationMessage('Opening Startup Planner...');
    })
  );

  // Expose LRN-ENG-04 (MasteryAssessor) results to the VS Code StatusBar
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(mortar-board) Mastery: 85%";
  statusBarItem.tooltip = "LRN-ENG-04 Assessor Results";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

class AIOSSidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private proxy?: BridgeProxy;

  constructor(private readonly _extensionUri: vscode.Uri) {}
  
  public setProxy(proxy: BridgeProxy) {
    this.proxy = proxy;
    this.proxy.on('message_received', (msg) => {
      if (this._view) {
        this._view.webview.postMessage(msg);
      }
    });
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    
    // Pass messages from React App to Proxy
    webviewView.webview.onDidReceiveMessage(data => {
      if (data.type === 'AIOS_EXECUTE_TASK') {
         // Orchestrator processing logic would go here
      }
    });

    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>AI-OS</title></head>
      <body>
        <div id="root"></div>
        <script src="webview.js"></script>
        <script>
          window.acquireVsCodeApi = acquireVsCodeApi || function() { return { postMessage: () => {} } };
        </script>
      </body>
      </html>
    `;
  }
}
