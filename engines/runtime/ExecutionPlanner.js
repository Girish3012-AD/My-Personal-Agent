/**
 * RUNTIME-001: Engine Orchestrator - Execution Planner
 * Schedules concurrent and serial tasks based on dependencies.
 */
export class ExecutionPlanner {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Schedules tasks into sequential execution batches/phases.
   * @param {Array<Object>} tasks - List of task models.
   * @returns {Array<Array<Object>>} List of task batches.
   */
  schedule(tasks) {
    console.log("[ExecutionPlanner] Scheduling task tree...");
    
    // Perform simple topological sort or batch allocation
    const resolved = new Set();
    const batches = [];
    let remaining = [...tasks];

    while (remaining.length > 0) {
      const currentBatch = remaining.filter(task => {
        const deps = task.dependencies || [];
        return deps.every(dep => resolved.has(dep));
      });

      if (currentBatch.length === 0) {
        console.error("[ExecutionPlanner] Circular dependency detected!");
        // Force remaining into a batch to prevent infinite loop
        batches.push(remaining);
        break;
      }

      batches.push(currentBatch);
      currentBatch.forEach(task => resolved.add(task.id));
      remaining = remaining.filter(task => !currentBatch.includes(task));
    }

    return batches;
  }
}
