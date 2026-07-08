/**
 * KERNEL-001: Intelligence Kernel - Input Processor
 * Normalizes incoming user messages, system signals, and API inputs.
 */
export class InputProcessor {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Processes raw input into a standardized AI-OS input frame.
   * @param {Object|string} rawInput - The raw input payload.
   * @param {Object} metadata - Metadata associated with the source.
   * @returns {Promise<Object>} The normalized input frame.
   */
  async process(rawInput, metadata = {}) {
    console.log("[InputProcessor] Processing raw input...");
    
    let text = "";
    let type = "text";
    
    if (typeof rawInput === "string") {
      text = rawInput;
    } else if (rawInput && typeof rawInput === "object") {
      text = rawInput.text || rawInput.content || "";
      type = rawInput.type || "payload";
    }

    return {
      timestamp: new Date().toISOString(),
      source: metadata.source || "user",
      type: type,
      content: text.trim(),
      raw: rawInput,
      contextHints: metadata.contextHints || []
    };
  }
}
