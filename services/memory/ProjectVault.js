/**
 * SERVICE-001: Memory Service - Project Vault
 * Handles workspace-specific file memory, configuration saving, and codebase indexes.
 */
export class ProjectVault {
  constructor(vaultDir = "./vault") {
    this.vaultDir = vaultDir;
    this.index = new Map();
  }

  /**
   * Saves an artifact or file to the project vault index.
   * @param {string} projectId - The active project identifier.
   * @param {string} filename - Target file name.
   * @param {Object|string} content - Contents to save.
   * @returns {Promise<Object>} The status of the write.
   */
  async saveArtifact(projectId, filename, content) {
    console.log(`[ProjectVault] Saving artifact: ${filename} for project: ${projectId}`);
    
    const key = `${projectId}:${filename}`;
    const entry = {
      projectId,
      filename,
      content,
      savedAt: new Date().toISOString()
    };
    
    this.index.set(key, entry);
    return { success: true, key: key, savedAt: entry.savedAt };
  }

  /**
   * Retrieves an artifact from the project vault index.
   * @param {string} projectId - The active project identifier.
   * @param {string} filename - Target file name.
   * @returns {Promise<Object|null>} The artifact entry or null.
   */
  async getArtifact(projectId, filename) {
    const key = `${projectId}:${filename}`;
    return this.index.get(key) || null;
  }
}
