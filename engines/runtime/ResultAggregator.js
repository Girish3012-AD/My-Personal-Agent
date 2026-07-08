/**
 * RUNTIME-001: Engine Orchestrator - Result Aggregator
 * Merges and filters outputs from multiple concurrent execution engines.
 */
export class ResultAggregator {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Aggregates multiple task outcomes.
   * @param {Array<Object>} outcomes - Execution outcomes.
   * @returns {Object} Combined results summary.
   */
  aggregate(outcomes) {
    console.log("[ResultAggregator] Aggregating outcomes...");
    
    const combinedData = {};
    const errors = [];
    let successCount = 0;

    outcomes.forEach(outcome => {
      if (outcome.status === "success" || outcome.status === "simulated_success") {
        successCount++;
        if (outcome.output && outcome.output.data) {
          Object.assign(combinedData, outcome.output.data);
        }
      } else {
        errors.push({
          taskId: outcome.taskId,
          error: outcome.error || "Execution failed"
        });
      }
    });

    return {
      success: errors.length === 0,
      totalTasks: outcomes.length,
      successCount: successCount,
      data: combinedData,
      errors: errors,
      timestamp: new Date().toISOString()
    };
  }
}
