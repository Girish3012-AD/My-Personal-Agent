/**
 * KERNEL-001: Intelligence Kernel - Execution Coordinator
 * Coordinates and executes tasks inside the generated plan using platform engines.
 */
export class ExecutionCoordinator {
  constructor(runtimeOrchestrator) {
    this.runtime = runtimeOrchestrator;
  }

  /**
   * Executes the generated plan step-by-step.
   * @param {Object} plan - The execution plan.
   * @returns {Promise<Object>} The summary of the execution outputs.
   */
  async executePlan(plan) {
    console.log(`[ExecutionCoordinator] Starting execution of plan: ${plan.planId}`);
    
    const results = [];
    for (const task of plan.tasks) {
      console.log(`[ExecutionCoordinator] Directing task: ${task.id} (${task.description})`);
      
      // Dispatch task via Runtime (if initialized)
      let output;
      if (this.runtime && typeof this.runtime.routeTask === "function") {
        output = await this.runtime.routeTask(task);
      } else {
        output = { status: "simulated_success", data: {} };
      }
      
      results.push({
        taskId: task.id,
        status: "success",
        output: output
      });
    }

    return {
      planId: plan.planId,
      executionResults: results,
      completedAt: new Date().toISOString()
    };
  }
}
