/**
 * PLATFORM-001: LearnOS - LRN-ENG-02 (Concept Teacher)
 * Formulates concept definitions and patterns to explain topics to the user.
 */
export class ConceptTeacher {
  /**
   * @param {Object} services - Container for Core platform service instances.
   * @param {Object} services.knowledgeService - Instance of Knowledge Service.
   */
  constructor({ knowledgeService }) {
    this.knowledge = knowledgeService;
  }

  /**
   * Teaches/Explains a specific concept using registered pattern and mental models.
   * @param {string} conceptName - Name of the concept.
   * @returns {Promise<Object>} The lesson content frame.
   */
  async teachConcept(conceptName) {
    console.log(`[ConceptTeacher] Explaining concept: ${conceptName}`);
    
    // Retrieve mental model to frame explanation (e.g. first principles)
    const firstPrinciples = this.knowledge.mentalModelVault.getModel("first_principles");
    
    // Retrieve coding pattern if any matches
    let codePattern = null;
    if (conceptName.toLowerCase().includes("array") || conceptName.toLowerCase().includes("sort")) {
      codePattern = this.knowledge.patternLibrary.getPattern("two_pointers");
    }

    return {
      concept: conceptName,
      pedagogyModel: firstPrinciples ? firstPrinciples.name : "Standard",
      explanation: `Explanatory breakdown for ${conceptName} from fundamental truths.`,
      cognitiveAnchor: firstPrinciples ? firstPrinciples.promptSnippet : "",
      suggestedPattern: codePattern ? codePattern.name : null,
      patternDescription: codePattern ? codePattern.description : null,
      timestamp: new Date().toISOString()
    };
  }
}
