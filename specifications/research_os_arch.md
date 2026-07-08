# ResearchOS Engine Architecture & Specification
**Module ID**: SYS-SPEC-003-ARCH  
**Version**: 1.0.0  
**Traceability Reference**: REQ-RES-001, REQ-RES-002, REQ-RES-003  

---

## 1. Executive Summary
ResearchOS is a high-level intelligence platform running on top of the AI-OS Core kernel. Its primary objective is to automate the analysis of technology literature, academic publications, and commercial benchmarks. It achieves this by mapping evidence to semantic graphs, cross-referencing claims via the Knowledge Service (SERVICE-002), and using the Core Reasoning Kernel (KERNEL-001) for deep comparative evaluation.

---

## 2. Core Execution Pipeline
ResearchOS triggers the orchestrator to route workflows through three specialized intelligence engines in sequence:

```mermaid
graph LR
    UserRequest[Research Request] --> ResearchOS[ResearchOS Master]
    ResearchOS --> SC[SourceCollector Engine]
    SC --> ES[EvidenceSynthesizer Engine]
    ES --> CA[ComparativeAnalyzer Engine]
    CA --> Report[Final Research Report]
```

### A. SourceCollector (Engine)
- **Module ID**: LRN-ENG-SC-01
- **Responsibility**: Ingests unstructured inputs (PDFs, URL queries, benchmark results) and breaks them down into normalized research frames.
- **Traceability**: Satisfies **REQ-RES-001**.
- **Interfaces**:
  ```typescript
  interface SourceCollectorInput {
    sources: string[]; // URLs or local file paths
    queryConstraints: string[];
  }
  interface IngestedFrame {
    sourceId: string;
    rawText: string;
    metadata: { author?: string; date?: string; version?: string };
  }
  ```

### B. EvidenceSynthesizer (Engine)
- **Module ID**: LRN-ENG-ES-02
- **Responsibility**: Parses claims, metrics, and axioms from the ingested frames, extracting raw assertions.
- **Fact Verification Mapping**: Integrates directly with **SERVICE-002 (Knowledge Service)**. It queries the `ConceptGraph` and the `PatternLibrary` to check if a synthesized claim contradicts established facts or matches known patterns.
- **Traceability**: Satisfies **REQ-RES-002**.
- **Interfaces**:
  ```typescript
  interface EvidenceAssertion {
    claimId: string;
    subject: string;
    predicate: string;
    object: string;
    confidenceScore: number;
    verificationStatus: "Verified" | "Contradicted" | "Unverified";
  }
  ```

### C. ComparativeAnalyzer (Engine)
- **Module ID**: LRN-ENG-CA-03
- **Responsibility**: Performs logical comparison between synthesized evidence assertions.
- **Reasoning Kernel Mapping**: Invokes the **Core Reasoning Kernel (KERNEL-001)** (specifically the `ReasoningManager` running the *Tree of Thoughts* approach) to resolve contradictions, evaluate benchmarks, and produce conclusions.
- **Traceability**: Satisfies **REQ-RES-003**.
- **Interfaces**:
  ```typescript
  interface ComparisonMatrix {
    commonalities: string[];
    contradictions: Array<{ assertionA: string; assertionB: string; resolution: string }>;
    benchmarkAnalysis: Record<string, any>;
  }
  ```

---

## 3. Integration Mappings

### A. SourceCollector -> KnowledgeService Ingestion Flow
1. **Collector Ingestion**: `SourceCollector` parses incoming literature (academic papers, benchmark logs).
2. **Schema Alignment**: It maps raw data fields to standard `AcademicPaper` and `TechnicalBenchmark` structures defined in [research_knowledge_schema.json](file:///d:/mywork/prompt/domains/research_knowledge_schema.json).
3. **Knowledge Injection**: It registers these elements into `SERVICE-002 (Knowledge Service)`'s `ConceptGraph` utilizing the `ConceptMapping` entity to link research metrics directly to core domain nodes (e.g., matching a paper about sorting algorithms to the `Sorting` node in [dsa_mastery.json](file:///d:/mywork/prompt/domains/dsa_mastery.json)).

### B. ComparativeAnalyzer -> MemoryService Benchmarking Flow
1. **Extraction**: `ComparativeAnalyzer` reads runtime metrics conforming to `TechnicalBenchmark` specifications.
2. **Delta Processing**: Runs comparative metrics calculations and triggers the Core Kernel's `ReasoningManager` for an assessment of the delta significance.
3. **Vault Persistence**: Serializes the generated `ComparisonMatrix` results and records them in `SERVICE-001 (Memory Service)`'s `ProjectVault` JSON file store, preserving performance histories.

### C. Verification Loop (SERVICE-002 Integration)
When the `EvidenceSynthesizer` parses a claim:
1. It queries `ReferenceAPI.queryReference(topic)`.
2. It cross-checks the claim terms in `ConceptGraph.getRelated(nodeId, "requires")`.
3. If the claim deviates from documented architecture rules, it marks the claim status as `Contradicted`.

### D. Logical Reasoning Loop (KERNEL-001 Integration)
During final analysis, the `ComparativeAnalyzer` offloads logical inference to the Kernel:
1. Translates comparison goals into input frames for `InputProcessor`.
2. Resolves intent via `IntentAnalyzer` mapping to `research_query`.
3. `ReasoningManager` processes the statements using First Principles (`MentalModelVault`) to draft the evaluation report.
