/**
 * SERVICE-002: Knowledge Service - Pattern Library
 * Manages recurring system, software development, and algorithmic patterns.
 */
export class PatternLibrary {
  constructor() {
    this.patterns = new Map();
    this.initializeDefaultPatterns();
  }

  initializeDefaultPatterns() {
    this.registerPattern("sliding_window", {
      name: "Sliding Window",
      domain: "DSA",
      description: "Maintains a subset of elements in a list, modifying boundaries dynamically.",
      complexity: "O(N)"
    });
    this.registerPattern("two_pointers", {
      name: "Two Pointers",
      domain: "DSA",
      description: "Uses two indices to read/modify structures from outer edges inward or sequentially.",
      complexity: "O(N)"
    });
  }

  /**
   * Registers a reusable pattern.
   * @param {string} id - Pattern identifier.
   * @param {Object} patternData - Properties of the pattern.
   */
  registerPattern(id, patternData) {
    console.log(`[PatternLibrary] Registering pattern: ${id}`);
    this.patterns.set(id, { id, ...patternData });
  }

  /**
   * Retrieves pattern details.
   * @param {string} id - Pattern identifier.
   * @returns {Object|null} The pattern data.
   */
  getPattern(id) {
    return this.patterns.get(id) || null;
  }
}
