import * as fs from 'fs';
import * as path from 'path';

export class PersistenceAdapter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public saveState(key: string, data: any): void {
    let current: any = {};
    if (fs.existsSync(this.filePath)) {
      current = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    current[key] = data;
    fs.writeFileSync(this.filePath, JSON.stringify(current, null, 2), 'utf-8');
  }

  public loadState(key: string): any {
    if (fs.existsSync(this.filePath)) {
      const current = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
      return current[key];
    }
    return null;
  }
}
