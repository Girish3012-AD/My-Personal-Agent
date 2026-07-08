/**
 * RUNTIME-001: Engine Orchestrator - Task Router
 * Routes sub-tasks to the correct engines or agents.
 */
export class TaskRouter {
  constructor(registry = {}) {
    this.registry = registry;
  }

  /**
   * Registers a target engine.
   * @param {string} name - The engine identifier.
   * @param {Object} engineInstance - The engine interface instance.
   */
  registerEngine(name, engineInstance) {
    this.registry[name] = engineInstance;
    console.log(`[TaskRouter] Registered engine: ${name}`);
  }

  /**
   * Routes task to the appropriate engine.
   * @param {Object} task - The task object.
   * @returns {Promise<Object>} The task execution result.
   */
  async routeTask(task) {
    console.log(`[TaskRouter] Routing task: ${task.id} to engine: ${task.engine}`);
    
    const engine = this.registry[task.engine];
    if (!engine) {
      console.warn(`[TaskRouter] Engine ${task.engine} not found. Running simulated fallback.`);
      return { status: "simulated_success", data: { text: `Simulated run of task: ${task.id}` } };
    }

    try {
      let result;
      if (typeof engine.executeTask === "function") {
        result = await engine.executeTask(task);
      } else {
        throw new Error(`Engine ${task.engine} lacks executeTask interface.`);
      }

      // Implicit Workflow Transitions
      if (task.type === "code_synthesis") {
        console.log("[TaskRouter] Implicit transition: code_synthesis finished. Triggering background QualityReviewer...");
        const reviewer = this.registry["QualityReviewer"];
        if (reviewer && typeof reviewer.executeTask === "function") {
          reviewer.executeTask({
            id: `review_${task.id}`,
            type: "quality_review",
            engine: "QualityReviewer",
            input: result
          }).then(revOut => {
            console.log(`[TaskRouter] Background QualityReviewer finished for: ${task.id}`, revOut);
          }).catch(err => {
            console.error(`[TaskRouter] Background QualityReviewer failed for: ${task.id}`, err);
          });
        } else {
          console.warn("[TaskRouter] QualityReviewer engine not registered. Skipping background check.");
        }
      }

      return result;
    } catch (error) {
      console.error(`[TaskRouter] Error executing task on ${task.engine}:`, error);
      throw error;
    }
  }
}
