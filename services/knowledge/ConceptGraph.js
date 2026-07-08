/**
 * SERVICE-002: Knowledge Service - Concept Graph
 * Manages semantic node relationships, core concepts, and algorithm mappings.
 */
export class ConceptGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  /**
   * Adds a concept node.
   * @param {string} id - Node identifier.
   * @param {Object} data - Node attributes (description, mastery thresholds).
   */
  addNode(id, data = {}) {
    console.log(`[ConceptGraph] Adding node: ${id}`);
    this.nodes.set(id, { id, ...data });
  }

  /**
   * Connects two concepts in the graph.
   * @param {string} source - Source node identifier.
   * @param {string} target - Target node identifier.
   * @param {string} type - Relationship type (e.g., 'requires', 'implements').
   */
  addEdge(source, target, type = "requires") {
    console.log(`[ConceptGraph] Connecting ${source} -> ${target} (${type})`);
    this.edges.push({ source, target, type });
  }

  /**
   * Retrieves adjacent nodes by relationship.
   * @param {string} nodeId - Target node.
   * @param {string} relationType - Relation type.
   * @returns {Array<Object>} List of related nodes.
   */
  getRelated(nodeId, relationType = "requires") {
    const targets = this.edges
      .filter(edge => edge.source === nodeId && edge.type === relationType)
      .map(edge => this.nodes.get(edge.target))
      .filter(Boolean);

    return targets;
  }
}
