/**
 * SERVICE-001: Memory Service - Session Tracker
 * Tracks individual active user-agent conversations, short-term history, and checkpoint states.
 */
export class SessionTracker {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Starts a new session or loads an existing one.
   * @param {string} sessionId - The session identifier.
   * @returns {Promise<Object>} The session state.
   */
  async createSession(sessionId) {
    console.log(`[SessionTracker] Starting session tracker: ${sessionId}`);
    const state = {
      sessionId,
      startTime: new Date().toISOString(),
      messages: [],
      checkpoints: {}
    };
    this.sessions.set(sessionId, state);
    return state;
  }

  /**
   * appends a message to the session memory buffer.
   * @param {string} sessionId - The session identifier.
   * @param {Object} message - Message frame containing role and text content.
   */
  async appendMessage(sessionId, message) {
    console.log(`[SessionTracker] Appending message for session: ${sessionId}`);
    if (!this.sessions.has(sessionId)) {
      await this.createSession(sessionId);
    }
    const state = this.sessions.get(sessionId);
    state.messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...message
    });
    this.sessions.set(sessionId, state);
    return state;
  }

  /**
   * Retrieves active messages for the session.
   * @param {string} sessionId - The session identifier.
   * @returns {Promise<Array>} List of message logs.
   */
  async getHistory(sessionId) {
    if (!this.sessions.has(sessionId)) {
      return [];
    }
    return this.sessions.get(sessionId).messages;
  }
}
