/**
 * ArchitecturePlanner
 * Parses requirements and outputs system architecture and module decomposition.
 */
export class ArchitecturePlanner {
  public parseRequirements(requirements: string): any {
    const isMicroservices = requirements.toLowerCase().includes("microservice") || requirements.toLowerCase().includes("scale");
    return {
      architecture: isMicroservices ? "Microservices" : "Monolith",
      modules: ["Core", "API", "Database"]
    };
  }
}
