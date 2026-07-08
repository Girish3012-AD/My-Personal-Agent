/**
 * SERVICE-003: Workflow Service - State Tracker
 * Monitors progress transitions, state checks, and step rollbacks for workflows.
 */
export class StateTracker {
  constructor() {
    this.workflows = new Map();
  }

  /**
   * Initializes state tracking for a new workflow flow instance.
   * @param {string} workflowId - The workflow run identifier.
   * @param {string} type - The workflow category type.
   * @returns {Object} Initialized state.
   */
  startWorkflow(workflowId, type) {
    console.log(`[StateTracker] Starting workflow state track for: ${workflowId} (${type})`);
    const state = {
      workflowId,
      type,
      status: "INITIATED",
      history: [{ status: "INITIATED", timestamp: new Date().toISOString() }]
    };
    this.workflows.set(workflowId, state);
    return state;
  }

  /**
   * Advances the state of a workflow run.
   * @param {string} workflowId - The workflow run identifier.
   * @param {string} nextStatus - New status state (e.g., 'RUNNING', 'COMPLETED', 'FAILED').
   * @param {Object} metadata - Optional context metrics.
   * @returns {Object} Updated workflow state.
   */
  transition(workflowId, nextStatus, metadata = {}) {
    console.log(`[StateTracker] Workflow ${workflowId} transitioning to: ${nextStatus}`);
    
    if (!this.workflows.has(workflowId)) {
      this.startWorkflow(workflowId, "unknown");
    }

    const state = this.workflows.get(workflowId);
    state.status = nextStatus;
    state.history.push({
      status: nextStatus,
      metadata,
      timestamp: new Date().toISOString()
    });

    this.workflows.set(workflowId, state);
    return state;
  }

  /**
   * Retrieves current status.
   * @param {string} workflowId - The workflow run identifier.
   * @returns {Object|null} Workflow state.
   */
  getWorkflowState(workflowId) {
    return this.workflows.get(workflowId) || null;
  }
}
