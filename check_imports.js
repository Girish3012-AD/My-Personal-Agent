/**
 * AI-OS Bootstrap Verification Script
 * Validates ES Module imports, class instantiations, and verifies component integration.
 */
import {
  InputProcessor,
  IntentAnalyzer,
  ContextManager,
  ReasoningManager,
  PlanningManager,
  ExecutionCoordinator,
  ValidationManager
} from "./kernel/index.js";

import {
  TaskRouter,
  ExecutionPlanner,
  ResultAggregator,
  CircuitBreaker
} from "./engines/runtime/index.js";

import {
  ProfileManager,
  SessionTracker,
  ProjectVault,
  RetrievalEngine
} from "./services/memory/index.js";

import {
  ConceptGraph,
  PatternLibrary,
  MentalModelVault,
  ReferenceAPI
} from "./services/knowledge/index.js";

import {
  TemplateEngine,
  StateTracker
} from "./services/workflow/index.js";

// LearnOS modules
import { CurriculumGenerator } from "./applications/learn_os/engines/CurriculumGenerator.js";
import { ConceptTeacher } from "./applications/learn_os/engines/ConceptTeacher.js";
import { PracticeSynthesizer } from "./applications/learn_os/engines/PracticeSynthesizer.js";
import { MasteryAssessor } from "./applications/learn_os/engines/MasteryAssessor.js";

async function verify() {
  console.log("=== STARTING AI-OS IMPORT & INSTANTIATION VERIFICATION ===");

  try {
    // 1. Core Services Instantiation
    const memoryService = {
      profileManager: new ProfileManager(),
      sessionTracker: new SessionTracker(),
      projectVault: new ProjectVault(),
      retrievalEngine: new RetrievalEngine()
    };

    const knowledgeService = {
      conceptGraph: new ConceptGraph(),
      patternLibrary: new PatternLibrary(),
      mentalModelVault: new MentalModelVault(),
      referenceAPI: new ReferenceAPI()
    };

    const workflowService = {
      templateEngine: new TemplateEngine(),
      stateTracker: new StateTracker()
    };

    console.log("[PASS] Core services instantiated successfully.");

    // 2. Runtime Orchestrator Instantiation
    const taskRouter = new TaskRouter();
    const planner = new ExecutionPlanner();
    const aggregator = new ResultAggregator();
    const cb = new CircuitBreaker();

    console.log("[PASS] Runtime Orchestrator instantiated successfully.");

    // 3. Kernel Pipeline Instantiation
    const ip = new InputProcessor();
    const ia = new IntentAnalyzer();
    const cm = new ContextManager();
    const rm = new ReasoningManager();
    const pm = new PlanningManager();
    const ec = new ExecutionCoordinator(taskRouter);
    const vm = new ValidationManager();

    console.log("[PASS] Kernel modules instantiated successfully.");

    // 4. LearnOS Engines Instantiation (Consuming Core Services)
    const curriculumGen = new CurriculumGenerator({ memoryService, knowledgeService });
    const teacher = new ConceptTeacher({ knowledgeService });
    const practiceSynth = new PracticeSynthesizer({ memoryService });
    const assessor = new MasteryAssessor({ memoryService });

    console.log("[PASS] LearnOS platform engines instantiated and cross-linked successfully.");

    // 5. Simulate cognitive pipeline execution
    console.log("\n--- SIMULATING KERNEL COGNITIVE PIPELINE ---");
    const rawInput = "I want to study Arrays and Sorting in DSA.";
    const frame = await ip.process(rawInput, { source: "user_console" });
    console.log("  Input Frame normalized:", JSON.stringify(frame));

    const intent = await ia.analyze(frame);
    console.log("  Intent Analyzer output:", JSON.stringify(intent));

    const context = await cm.getContext("test_user_session_123");
    const reasoning = await rm.reason(intent.goals[0], context);
    const plan = await pm.generatePlan(reasoning);
    console.log("  Kernel generated execution plan:", JSON.stringify(plan));

    // Register LearnOS as a mock engine in taskRouter
    taskRouter.registerEngine("LearnOS", {
      executeTask: async (task) => {
        console.log(`    [LearnOS Engine Mock] Running task: ${task.description}`);
        return { status: "success", data: { lesson: "Completed mock lesson on Arrays" } };
      }
    });

    const execResult = await ec.executePlan(plan);
    const validation = await vm.validate(intent.goals[0], execResult);
    console.log("  Validation results:", JSON.stringify(validation));

    // 6. Simulate LearnOS curriculum flow
    console.log("\n--- SIMULATING LEARNOS CURRICULUM FLOW ---");
    const curriculum = await curriculumGen.generateTrack("user_456", "DOMAIN-001");
    console.log("  Curriculum generated:", JSON.stringify(curriculum));

    const lesson = await teacher.teachConcept("Arrays");
    console.log("  Teacher explanation:", JSON.stringify(lesson));

    const exercise = await practiceSynth.generateExercise("user_456", "Arrays");
    console.log("  Exercise synthesized:", JSON.stringify(exercise));

    const assessment = await assessor.assess("user_456", "Arrays", "function solve() {}", true);
    console.log("  Assessment results:", JSON.stringify(assessment));

    console.log("\n=== ALL AI-OS CORE AND LEARNOS MODULES VERIFIED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n[FAIL] Verification error:", error);
    process.exit(1);
  }
}

verify();
