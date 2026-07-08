/**
 * ComparativeAnalyzer
 * Execute R-004 (Comparative Analysis) via KERNEL-001 to output decision matrices.
 */
export class ComparativeAnalyzer {
  public analyzeBenchmarks(benchmarks: { name: string, score: number }[]): any {
    if (!benchmarks || benchmarks.length < 2) return null;
    const sorted = [...benchmarks].sort((a, b) => b.score - a.score);
    const top = sorted[0];
    const second = sorted[1];
    
    return {
      topModel: top.name,
      scoreDelta: top.score - second.score,
      matrix: sorted
    };
  }
}
