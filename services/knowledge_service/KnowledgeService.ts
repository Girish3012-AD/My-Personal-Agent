import { KnowledgePersistence } from './KnowledgePersistence.ts';

export class KnowledgeService {
  private cache: Map<string, any> = new Map();
  private persistence: KnowledgePersistence;

  constructor() {
    this.persistence = new KnowledgePersistence();
  }

  public queryNode(domainName: string): any {
    if (this.cache.has(domainName)) {
      return this.cache.get(domainName);
    }
    
    // Cold-Storage load
    const data = this.persistence.loadNode(domainName);
    if (data) {
      this.cache.set(domainName, data);
      return data;
    }
    
    throw new Error(`Domain node ${domainName} not found.`);
  }

  public invalidateCache(domainName: string): void {
    this.cache.delete(domainName);
  }
}
