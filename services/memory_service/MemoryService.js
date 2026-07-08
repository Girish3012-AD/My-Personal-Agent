import * as fs from "fs";
import * as path from "path";

/**
 * services/memory_service/MemoryService.js
 * Node-executable ESM version of the Memory Service.
 */

export class ProjectVaultStore {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
    this.ensureDirectoryExistence(this.filePath);
    this.data = {};
    this.load();
  }

  ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
      }
    } catch (e) {
      console.warn("[ProjectVaultStore] Failed to load database, starting fresh:", e.message);
      this.data = {};
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("[ProjectVaultStore] Failed to write database:", e.message);
    }
  }

  get(key) {
    this.load();
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }
}

export class SessionTracker {
  constructor() {
    this.activeContexts = [];
  }

  validatePriority(priority) {
    const normalized = priority.trim();
    if (normalized === "Critical" || normalized === "Supporting" || normalized === "Background") {
      return normalized;
    }
    throw new Error(`Invalid priority level: "${priority}". Must be 'Critical', 'Supporting', or 'Background'.`);
  }

  addContext(domain, intent, value, priority) {
    const validatedPriority = this.validatePriority(priority);
    const item = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      domain,
      intent,
      value,
      priority: validatedPriority,
      timestamp: new Date().toISOString()
    };
    this.activeContexts.push(item);
    return item;
  }

  getContexts() {
    return this.activeContexts;
  }
}

export class MemoryService {
  constructor(vaultPath = "./vault_data/vault.json", profilePath = "./vault_data/profile.json") {
    this.vault = new ProjectVaultStore(vaultPath);
    this.tracker = new SessionTracker();
    this.profileFile = path.resolve(profilePath);
  }

  async WriteMemory(key, value, lifespan) {
    console.log(`[MemoryService] Writing memory for key: "${key}"`);
    const entry = {
      value,
      lifespan,
      expiresAt: Date.now() + lifespan
    };
    this.vault.set(key, entry);
  }

  async QueryContext(domain, intent) {
    console.log(`[MemoryService] Querying contexts for domain: "${domain}" and intent: "${intent}"`);
    return this.tracker.getContexts().filter(
      item => item.domain === domain && item.intent === intent
    );
  }

  async UpdateProfile(domain, skill_delta) {
    console.log(`[MemoryService] Updating profile for domain: "${domain}" with delta: ${skill_delta}`);
    
    let currentProfile = {};
    try {
      if (fs.existsSync(this.profileFile)) {
        const raw = fs.readFileSync(this.profileFile, "utf-8");
        currentProfile = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[MemoryService] Failed to load profile, resetting:", e.message);
    }

    const currentScore = currentProfile[domain] || 0;
    const newScore = Math.max(0, Math.min(100, currentScore + skill_delta));
    currentProfile[domain] = newScore;

    try {
      const dirname = path.dirname(this.profileFile);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      fs.writeFileSync(this.profileFile, JSON.stringify(currentProfile, null, 2), "utf-8");
      console.log(`[MemoryService] Profile successfully updated: "${domain}" is now ${newScore}`);
    } catch (e) {
      console.error("[MemoryService] Failed to write profile update:", e.message);
    }
  }

  getSessionTracker() {
    return this.tracker;
  }
}
