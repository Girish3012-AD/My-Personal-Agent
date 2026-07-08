/**
 * SERVICE-002: Knowledge Service - Mental Model Vault
 * Stores structured reasoning templates and cognitive frameworks (e.g., First Principles).
 */
export class MentalModelVault {
  constructor() {
    this.models = new Map();
    this.initializeDefaultModels();
  }

  initializeDefaultModels() {
    this.registerModel("first_principles", {
      name: "First Principles",
      coreIdea: "Break a problem down to its fundamental truths and build up from there.",
      promptSnippet: "Analyze the objective by stripping assumptions and specifying basic axioms."
    });
    this.registerModel("inversion", {
      name: "Inversion",
      coreIdea: "Instead of planning for success, plan to avoid failure.",
      promptSnippet: "List ways this task can fail, then create a checklist to prevent those failures."
    });
  }

  /**
   * Registers a mental model.
   * @param {string} id - Model identifier.
   * @param {Object} modelData - Model properties.
   */
  registerModel(id, modelData) {
    console.log(`[MentalModelVault] Registering model: ${id}`);
    this.models.set(id, { id, ...modelData });
  }

  /**
   * Retrieves a mental model.
   * @param {string} id - Model identifier.
   * @returns {Object|null} The mental model data.
   */
  getModel(id) {
    return this.models.get(id) || null;
  }
}
