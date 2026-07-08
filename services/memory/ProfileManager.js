/**
 * SERVICE-001: Memory Service - Profile Manager
 * Manages permanent user profiles, personalization data, and persistent settings.
 */
export class ProfileManager {
  constructor(storage = {}) {
    this.storage = storage;
  }

  /**
   * Loads a user profile by ID.
   * @param {string} userId - The user identifier.
   * @returns {Promise<Object>} The user profile data structure.
   */
  async loadProfile(userId) {
    console.log(`[ProfileManager] Loading profile for user: ${userId}`);
    if (!this.storage[userId]) {
      this.storage[userId] = {
        userId,
        preferences: {},
        masteryScores: {}, // Maps concept IDs to mastery percentages
        history: [],
        createdAt: new Date().toISOString()
      };
    }
    return this.storage[userId];
  }

  /**
   * Updates user preferences or learning statistics.
   * @param {string} userId - The user identifier.
   * @param {Object} updates - Profile delta updates.
   * @returns {Promise<Object>} The updated profile.
   */
  async updateProfile(userId, updates) {
    console.log(`[ProfileManager] Updating profile for user: ${userId}`);
    const profile = await this.loadProfile(userId);

    if (updates.preferences) {
      profile.preferences = { ...profile.preferences, ...updates.preferences };
    }
    if (updates.masteryScores) {
      profile.masteryScores = { ...profile.masteryScores, ...updates.masteryScores };
    }
    if (updates.historyItem) {
      profile.history.push(updates.historyItem);
    }

    this.storage[userId] = profile;
    return profile;
  }
}
