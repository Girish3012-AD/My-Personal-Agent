import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

/**
 * Bridge Proxy
 * Connects VS Code UI to RUNTIME-001 via WebSocket.
 */
export class BridgeProxy extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private client: WebSocket | null = null;

  public start(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', (ws) => {
      this.client = ws;
      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          // Emit to Orchestrator (RUNTIME-001)
          this.emit('message_received', parsed);
        } catch (e) {
          console.error("Invalid message format");
        }
      });
    });
  }

  public streamToUI(payload: any) {
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify({
        type: "AIOS_STREAM_OUTPUT",
        payload
      }));
    }
  }

  public stop() {
    if (this.wss) {
      this.wss.close();
    }
  }
}
