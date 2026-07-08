import * as fs from "fs";
import * as path from "path";
import { PersistenceAdapter } from "./PersistenceAdapter.ts";

/**
 * SERVICE-001: Memory Service Implementation
 * Module ID: SERVICE-001
 * Version: 1.0.0
 * Dependencies: fs, path
 */

export type PriorityLevel = "Critical" | "Supporting" | "Background";

export interface ContextItem {
  id: string;
  domain: string;
  intent: string;
  value: any;
  priority: PriorityLevel;
  timestamp: string;
}

export interface MemoryEntry {
  value: any;
  lifespan: number;
  expiresAt: number;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null; // null if present
}

export interface ValidatedSkill {
  id: string;
  name: string;
  confidence: number;
  evidenceId: string; // FK to WorkExperience
}

export interface IdentitySnapshot {
  id: string;
  timestamp: string;
  skills: ValidatedSkill[];
  experiences: WorkExperience[];
}

/**
 * ProjectVaultStore
 * Implements a persistent or semi-persistent JSON file storage vault.
 */
export class ProjectVaultStore {
  private filePath: string;
  private data: Record<string, any> = {};

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
    this.ensureDirectoryExistence(this.filePath);
    this.load();
  }

  private ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
      }
    } catch (e) {
      console.warn("[ProjectVaultStore] Failed to read storage file, initializing empty:", e);
      this.data = {};
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("[ProjectVaultStore] Failed to write storage file:", e);
    }
  }

  public get(key: string): any {
    this.load();
    return this.data[key];
  }

  public set(key: string, value: any): void {
    this.data[key] = value;
    this.save();
  }
}

/**
 * SessionTracker
 * Validates context priorities: Critical, Supporting, Background.
 */
export class SessionTracker {
  private activeContexts: ContextItem[] = [];

  /**
   * Validates if the priority level complies with requirements.
   */
  public validatePriority(priority: string): PriorityLevel {
    const normalized = priority.trim();
    if (normalized === "Critical" || normalized === "Supporting" || normalized === "Background") {
      return normalized as PriorityLevel;
    }
    throw new Error(`Invalid priority level: "${priority}". Must be 'Critical', 'Supporting', or 'Background'.`);
  }

  /**
   * Tracks a new context item.
   */
  public addContext(domain: string, intent: string, value: any, priority: string): ContextItem {
    const validatedPriority = this.validatePriority(priority);
    const item: ContextItem = {
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

  public getContexts(): ContextItem[] {
    return this.activeContexts;
  }
}

/**
 * MemoryService
 * Primary implementation class of SERVICE-001.
 */
export class MemoryService {
  private vault: ProjectVaultStore;
  private tracker: SessionTracker;
  private profileFile: string;
  private adapter: PersistenceAdapter;

  constructor(vaultPath: string = "./vault_data/vault.json", profilePath: string = "./vault_data/profile.json") {
    this.vault = new ProjectVaultStore(vaultPath);
    this.tracker = new SessionTracker();
    this.profileFile = path.resolve(profilePath);
    this.adapter = new PersistenceAdapter("./vault_data/persistent_state.json");
  }

  /**
   * Writes a key-value pair to memory with expiration timestamp.
   * @param key Memory identifier.
   * @param value Memory payload.
   * @param lifespan Lifespan duration in milliseconds.
   */
  public async WriteMemory(key: string, value: any, lifespan: number): Promise<void> {
    console.log(`[MemoryService] Writing memory for key: "${key}"`);
    const entry: MemoryEntry = {
      value,
      lifespan,
      expiresAt: Date.now() + lifespan
    };
    this.vault.set(key, entry);
    this.adapter.saveState(key, entry);
  }

  /**
   * Queries active context trackers based on domain and intent.
   * @param domain Target knowledge domain.
   * @param intent User or system intent.
   */
  public async QueryContext(domain: string, intent: string): Promise<ContextItem[]> {
    console.log(`[MemoryService] Querying contexts for domain: "${domain}" and intent: "${intent}"`);
    return this.tracker.getContexts().filter(
      item => item.domain === domain && item.intent === intent
    );
  }

  /**
   * Updates user skill scores in the profile.
   * @param domain Target knowledge domain.
   * @param skill_delta Delta value to modify the skill level.
   */
  public async UpdateProfile(domain: string, skill_delta: number): Promise<void> {
    console.log(`[MemoryService] Updating profile for domain: "${domain}" with delta: ${skill_delta}`);
    
    let currentProfile: Record<string, number> = {};
    try {
      if (fs.existsSync(this.profileFile)) {
        const raw = fs.readFileSync(this.profileFile, "utf-8");
        currentProfile = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[MemoryService] Failed to load current profile, resetting:", e);
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
      this.adapter.saveState("profile_" + domain, { score: newScore });
      console.log(`[MemoryService] Profile successfully updated: "${domain}" is now ${newScore}`);
    } catch (e) {
      console.error("[MemoryService] Failed to write profile update:", e);
    }
  }

  /**
   * Helper method for verification testing.
   */
  public getSessionTracker(): SessionTracker {
    return this.tracker;
  }
}
