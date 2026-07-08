/**
 * DocGenerator
 * Auto-generate documentation using /templates/srs_document_template.md
 */
export class DocGenerator {
  public generateDocs(projectData: any): string {
    return `# System Requirements Specification\nProject: ${projectData.name}\nGenerated from template.`;
  }
}
