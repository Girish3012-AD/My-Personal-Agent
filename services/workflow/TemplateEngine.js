/**
 * SERVICE-003: Workflow Service - Template Engine
 * Loads, manages, and formats reusable workflow templates and markdown forms.
 */
export class TemplateEngine {
  constructor() {
    this.templates = new Map();
    this.initializeDefaultTemplates();
  }

  initializeDefaultTemplates() {
    this.registerTemplate("agent_dispatch", `
# Dispatching Agent: {{agentName}}
Role: {{role}}
Goal: {{goal}}
Assigned Modules: {{modules}}
    `.trim());
  }

  /**
   * Registers a reusable string template.
   * @param {string} id - Template identifier.
   * @param {string} rawText - String with double mustache variables.
   */
  registerTemplate(id, rawText) {
    console.log(`[TemplateEngine] Registering template: ${id}`);
    this.templates.set(id, rawText);
  }

  /**
   * Renders a template with contextual parameters.
   * @param {string} id - Template identifier.
   * @param {Object} data - Key-value replacements.
   * @returns {string} The formatted template.
   */
  render(id, data = {}) {
    const raw = this.templates.get(id);
    if (!raw) {
      throw new Error(`Template ${id} not found.`);
    }

    let rendered = raw;
    for (const [key, val] of Object.entries(data)) {
      rendered = rendered.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(val));
    }
    return rendered;
  }
}
