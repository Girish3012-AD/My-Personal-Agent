import * as fs from 'fs';
import * as path from 'path';

export class KnowledgePersistence {
  private domainsDir: string;

  constructor(domainsDir: string = './domains') {
    this.domainsDir = path.resolve(domainsDir);
  }

  public loadNode(domainName: string): any {
    const filePath = path.join(this.domainsDir, `${domainName}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
    return null;
  }
}
