import assert from 'assert';
import { WebSocket } from 'ws';
import { BridgeProxy } from './website/vscode_extension/src/proxy.ts';

async function runTests() {
  const proxy = new BridgeProxy();
  const PORT = 8085; // use different port for testing to avoid conflicts
  proxy.start(PORT);

  // Promise to wait for proxy receipt
  const receiptPromise = new Promise((resolve) => {
    proxy.on('message_received', (msg) => {
      resolve(msg);
    });
  });

  const wsClient = new WebSocket(`ws://localhost:${PORT}`);
  
  // Wait for connection
  await new Promise((resolve) => wsClient.on('open', resolve));
  
  // Mock test 1
  wsClient.send(JSON.stringify({ type: 'AIOS_EXECUTE_TASK', payload: { command: 'test' } }));
  const receivedMsg = await receiptPromise;
  assert.strictEqual(receivedMsg.type, 'AIOS_EXECUTE_TASK', 'Proxy should receive AIOS_EXECUTE_TASK');
  
  // Mock test 2: Stream mock response from Orchestrator -> assert UI stream event is successfully fired
  const streamPromise = new Promise((resolve) => {
    wsClient.on('message', (data) => {
      resolve(JSON.parse(data.toString()));
    });
  });

  proxy.streamToUI({ status: 'done' });
  const streamedMsg = await streamPromise;
  
  assert.strictEqual(streamedMsg.type, 'AIOS_STREAM_OUTPUT', 'Proxy should send AIOS_STREAM_OUTPUT');
  assert.strictEqual(streamedMsg.payload.status, 'done', 'Payload should match');

  proxy.stop();
  wsClient.close();
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
