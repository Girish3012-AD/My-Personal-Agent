/**
 * RUNTIME-001: Engine Orchestrator - Circuit Breaker
 * Manages fault tolerance, prevents cascading failures, and tracks system health.
 */
export class CircuitBreaker {
  constructor(threshold = 3, cooldownMs = 5000) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
    this.failureCount = 0;
    this.state = "CLOSED"; // CLOSED, OPEN, HALF-OPEN
    this.lastFailureTime = null;
  }

  /**
   * Records execution outcome and checks state transition.
   * @param {boolean} success - Whether the execution succeeded.
   */
  recordOutcome(success) {
    if (success) {
      this.reset();
    } else {
      this.recordFailure();
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    console.warn(`[CircuitBreaker] Failure recorded. Count: ${this.failureCount}/${this.threshold}`);
    
    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
      console.error(`[CircuitBreaker] State transitioned to OPEN. Actions will block.`);
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = "CLOSED";
    this.lastFailureTime = null;
  }

  /**
   * Evaluates if actions can be executed.
   * @returns {boolean} True if allowed to proceed.
   */
  allowExecution() {
    if (this.state === "CLOSED") {
      return true;
    }

    if (this.state === "OPEN") {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.state = "HALF-OPEN";
        console.log(`[CircuitBreaker] Cooldown expired. Transitioned to HALF-OPEN.`);
        return true;
      }
      return false;
    }

    return true; // HALF-OPEN allows execution to test
  }
}
