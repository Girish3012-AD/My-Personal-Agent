/**
 * PLATFORM-001: LearnOS - LRN-ENG-04 (Mastery Assessor)
 * Grades user code execution attempts and updates profile states in Memory Service.
 */
export class MasteryAssessor {
  /**
   * @param {Object} services - Container for Core platform service instances.
   * @param {Object} services.memoryService - Instance of Memory Service.
   */
  constructor({ memoryService }) {
    this.memory = memoryService;
  }

  /**
   * Evaluates user attempt and updates mastery.
   * @param {string} userId - User identifier.
   * @param {string} concept - Target concept.
   * @param {string} userCode - Code submitted.
   * @param {boolean} testPassed - If unit tests passed.
   * @returns {Promise<Object>} The evaluation and new mastery level.
   */
  async assess(userId, concept, userCode, testPassed) {
    console.log(`[MasteryAssessor] Evaluating attempt for user: ${userId} on concept: ${concept}`);
    
    // Retrieve previous profile
    const profile = await this.memory.profileManager.loadProfile(userId);
    const prevScore = profile.masteryScores[concept.toLowerCase()] || 0;
    
    // Calculate new score based on attempt correctness
    let delta = testPassed ? 15 : -5;
    let newScore = Math.max(0, Math.min(100, prevScore + delta));

    // Persist new score in Memory Service
    await this.memory.profileManager.updateProfile(userId, {
      masteryScores: {
        [concept.toLowerCase()]: newScore
      },
      historyItem: {
        type: "practice_submission",
        concept: concept,
        score: newScore,
        timestamp: new Date().toISOString()
      }
    });

    return {
      userId,
      concept,
      evaluation: testPassed ? "PASSED" : "FAILED",
      delta: delta,
      previousScore: prevScore,
      newScore: newScore,
      updatedAt: new Date().toISOString()
    };
  }
}
