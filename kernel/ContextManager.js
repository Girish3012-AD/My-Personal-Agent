/**
 * KERNEL-001: Intelligence Kernel - Context Manager
 * Manages active contexts, working memory, and transient conversation structures.
 */
export class ContextManager {
  constructor(config = {}) {
    this.config = config;
    this.activeContexts = new Map();
  }

  /**
   * Loads or creates a context frame for a session.
   * @param {string} sessionId - The session identifier.
   * @returns {Promise<Object>} The session context frame.
   */
  async getContext(sessionId) {
    console.log(`[ContextManager] Retrieving context for session: ${sessionId}`);
    if (!this.activeContexts.has(sessionId)) {
      this.activeContexts.set(sessionId, {
        sessionId,
        variables: {},
        activeTools: [],
        history: [],
        updatedAt: new Date().toISOString()
      });
    }
    return this.activeContexts.get(sessionId);
  }

  /**
   * Updates an active context with new variables or history.
   * @param {string} sessionId - The session identifier.
   * @param {Object} updates - Context key-value updates.
   * @returns {Promise<Object>} The updated context frame.
   */
  async updateContext(sessionId, updates) {
    console.log(`[ContextManager] Updating context for session: ${sessionId}`);
    const context = await this.getContext(sessionId);
    
    if (updates.variables) {
      context.variables = { ...context.variables, ...updates.variables };
    }
    if (updates.historyItem) {
      context.history.push(updates.historyItem);
    }
    
    context.updatedAt = new Date().toISOString();
    this.activeContexts.set(sessionId, context);
    return context;
  }

  /**
   * Automatically pulls relevant code blocks from saved active files into Memory Service.
   * @param {string} filePath - Absolute path to the saved file.
   * @param {string} content - Saved file text content.
   * @param {Object} memoryService - Memory Service instance (SERVICE-001).
   */
  async injectActiveFileContext(filePath, content, memoryService) {
    console.log(`[ContextManager] Auto-injecting context from file: ${filePath}`);
    const key = `active_file:${filePath}`;
    
    // Write code blocks summary into Memory Service using standard methods
    if (memoryService && typeof memoryService.WriteMemory === "function") {
      await memoryService.WriteMemory(key, {
        contentLength: content.length,
        timestamp: new Date().toISOString()
      }, 3600000); // 1-hour lifespan
    }
  }
}
